"""
═══════════════════════════════════════════════════════════════════
  Métodos Numéricos — Plataforma de Cálculo
  Universidad Mariano Gálvez de Guatemala
  Curso 021  Métodos Numéricos
═══════════════════════════════════════════════════════════════════
  Métodos disponibles:
    1. Newton-Raphson
    2. Secante
    3. Müller
    4. Eliminación de Gauss
    5. Gauss-Seidel
    6. Gauss-Jordan
═══════════════════════════════════════════════════════════════════
  Dependencias: sympy  (pip install sympy)
═══════════════════════════════════════════════════════════════════
"""

import cmath
import copy
import math
import os
import sys

try:
    import sympy as sp
except ImportError:
    print("[ERROR] SymPy no está instalado. Ejecuta:  pip install sympy")
    sys.exit(1)


# ══════════════════════════════════════════════════════════════════
#  UTILIDADES DE CONSOLA
# ══════════════════════════════════════════════════════════════════

def cls():
    os.system("cls" if os.name == "nt" else "clear")


def linea(char="═", n=65):
    print(char * n)


def titulo(texto):
    linea()
    print(f"  {texto}")
    linea()


def separador():
    print("─" * 65)


def pedir_float(prompt, puede_omitir=False):
    """
    Solicita un número flotante al usuario.
    Si puede_omitir=True, permite dejar en blanco (devuelve None).
    """
    while True:
        val = input(prompt).strip()
        if puede_omitir and val == "":
            return None
        try:
            return float(val)
        except ValueError:
            print("  ✗ Valor inválido. Ingresa un número (e.g. 1.5 o -2).")


def pedir_int(prompt, minimo=1):
    while True:
        val = input(prompt).strip()
        try:
            n = int(val)
            if n >= minimo:
                return n
            print(f"  ✗ Debe ser un entero ≥ {minimo}.")
        except ValueError:
            print("  ✗ Valor inválido. Ingresa un número entero.")


def pedir_funcion(prompt="  f(x) = "):
    """Solicita una expresión simbólica en x y la valida con SymPy."""
    x = sp.Symbol("x")
    while True:
        expr_str = input(prompt).strip()
        if not expr_str:
            print("  ✗ La expresión no puede estar vacía.")
            continue
        try:
            expr = sp.sympify(expr_str)
            # Verificar que se puede lambdificar y evaluar
            f_test = sp.lambdify(x, expr, modules=["math"])
            f_test(1.0)  # prueba de evaluación
            return expr_str, expr
        except Exception as e:
            print(f"  ✗ Expresión inválida: {e}")
            print("    Ejemplos válidos: x**3 - x - 2 | sin(x) - x/2 | exp(x) - 3")


def mostrar_tabla_iteraciones(headers, filas, fmt=None):
    """
    Imprime una tabla con headers y filas dadas.
    fmt: lista de anchos de columna (opcional).
    """
    if fmt is None:
        fmt = [max(len(str(h)), max((len(str(f[i])) for f in filas), default=0))
               for i, h in enumerate(headers)]
    separador_tabla = "+" + "+".join("-" * (w + 2) for w in fmt) + "+"
    fila_fmt = "| " + " | ".join(f"{{:<{w}}}" for w in fmt) + " |"
    print(separador_tabla)
    print(fila_fmt.format(*[str(h) for h in headers]))
    print(separador_tabla.replace("-", "="))
    for fila in filas:
        print(fila_fmt.format(*[str(c)[:fmt[i]] for i, c in enumerate(fila)]))
    print(separador_tabla)


def formatear_numero(val, decimales=8):
    """Formatea un número para mostrarlo limpiamente."""
    if isinstance(val, complex):
        if abs(val.imag) < 1e-10:
            return f"{val.real:.{decimales}f}"
        return f"{val.real:.{decimales}f} + {val.imag:.{decimales}f}i"
    try:
        return f"{float(val):.{decimales}f}"
    except Exception:
        return str(val)


def pausar():
    print()
    input("  Presiona ENTER para continuar...")


# ══════════════════════════════════════════════════════════════════
#  1. NEWTON-RAPHSON
# ══════════════════════════════════════════════════════════════════

def newton_raphson():
    titulo("MÉTODO DE NEWTON-RAPHSON")
    print("  Busca raíces de f(x) = 0 usando la fórmula:")
    print("  x_{n+1} = x_n - f(x_n) / f'(x_n)")
    print()
    print("  Reglas de uso:")
    print("  • Usa 'x' como variable.")
    print("  • Potencias: x**2  (no x^2)")
    print("  • Funciones: sin(x), cos(x), exp(x), log(x), sqrt(x)")
    separador()

    # ── Pedir parámetros ──────────────────────────────────────────
    func_str, f_sym = pedir_funcion("  f(x) = ")

    x_sym = sp.Symbol("x")
    print()
    print("  Derivada (deja en blanco para calcularla automáticamente con SymPy):")
    deriv_input = input("  f'(x) = ").strip()

    if deriv_input == "":
        fp_sym = sp.diff(f_sym, x_sym)
        print(f"  → Derivada calculada automáticamente: f'(x) = {fp_sym}")
    else:
        try:
            fp_sym = sp.sympify(deriv_input)
        except Exception as e:
            print(f"  ✗ Derivada inválida: {e}. Se usará la derivada automática.")
            fp_sym = sp.diff(f_sym, x_sym)

    print()
    x0       = pedir_float("  Valor inicial x0 = ")
    tol      = pedir_float("  Tolerancia (e.g. 0.0001) = ")
    max_iter = pedir_int  ("  Máximo de iteraciones     = ")

    # ── Construir funciones numéricas ─────────────────────────────
    try:
        f  = sp.lambdify(x_sym, f_sym,  modules=["math"])
        fp = sp.lambdify(x_sym, fp_sym, modules=["math"])
    except Exception as e:
        print(f"\n  ✗ Error construyendo las funciones: {e}")
        pausar(); return

    # ── Iteraciones ───────────────────────────────────────────────
    separador()
    print(f"  Ejecutando Newton-Raphson con x0={x0}, tol={tol}, maxIter={max_iter}")
    separador()

    xi        = x0
    converged = False
    filas     = []

    for i in range(1, max_iter + 1):
        try:
            fxi  = f(xi)
            fpxi = fp(xi)
        except Exception as e:
            print(f"\n  ✗ Error evaluando en la iteración {i}: {e}")
            break

        if abs(fpxi) < 1e-15:
            print(f"\n  ✗ DIVERGENCIA: f'({xi:.6f}) ≈ 0 en la iteración {i}.")
            print("    El método no puede continuar (división por cero).")
            break

        xi_new = xi - fxi / fpxi
        error  = abs(xi_new - xi)

        filas.append((
            i,
            formatear_numero(xi),
            formatear_numero(fxi),
            formatear_numero(fpxi),
            formatear_numero(xi_new),
            formatear_numero(error),
        ))

        xi = xi_new

        if error < tol:
            converged = True
            break

    # ── Mostrar tabla ─────────────────────────────────────────────
    print()
    anchos = [5, 18, 18, 18, 18, 18]
    mostrar_tabla_iteraciones(
        ["  n", "  x_n", "  f(x_n)", "  f'(x_n)", "  x_{n+1}", "  Error"],
        [(" " + str(f[0]), " " + f[1], " " + f[2], " " + f[3], " " + f[4], " " + f[5])
         for f in filas],
        anchos,
    )

    print()
    if converged:
        print(f"  ✓ CONVERGIÓ en {len(filas)} iteraciones.")
        print(f"  ✓ Raíz aproximada: x ≈ {formatear_numero(xi)}")
        print(f"  ✓ f(raíz) ≈ {formatear_numero(f(xi))}")
    else:
        print(f"  ✗ No convergió en {max_iter} iteraciones.")
        print(f"  → Última aproximación: x ≈ {formatear_numero(xi)}")

    pausar()


# ══════════════════════════════════════════════════════════════════
#  2. SECANTE
# ══════════════════════════════════════════════════════════════════

def secante():
    titulo("MÉTODO DE LA SECANTE")
    print("  Busca raíces de f(x) = 0 sin necesitar derivada:")
    print("  x_{n+1} = x_n - f(x_n) * (x_n - x_{n-1}) / (f(x_n) - f(x_{n-1}))")
    print()
    print("  Reglas de uso: mismas que Newton-Raphson.")
    separador()

    func_str, f_sym = pedir_funcion("  f(x) = ")
    x_sym = sp.Symbol("x")

    try:
        f = sp.lambdify(x_sym, f_sym, modules=["math"])
    except Exception as e:
        print(f"  ✗ Error: {e}"); pausar(); return

    print()
    x0       = pedir_float("  Primer valor inicial  x0 = ")
    x1       = pedir_float("  Segundo valor inicial x1 = ")
    tol      = pedir_float("  Tolerancia            tol = ")
    max_iter = pedir_int  ("  Máximo de iteraciones     = ")

    # ── Evaluar en puntos iniciales ───────────────────────────────
    try:
        fx0 = f(x0)
        fx1 = f(x1)
    except Exception as e:
        print(f"\n  ✗ Error evaluando f en los puntos iniciales: {e}")
        pausar(); return

    if abs(fx1 - fx0) < 1e-15:
        print(f"\n  ✗ DIVERGENCIA: f(x0)={fx0:.6f} ≈ f(x1)={fx1:.6f}.")
        print("    Elige valores iniciales con imágenes distintas.")
        pausar(); return

    # ── Iteraciones ───────────────────────────────────────────────
    separador()
    print(f"  Ejecutando Secante con x0={x0}, x1={x1}, tol={tol}, maxIter={max_iter}")
    separador()

    converged = False
    filas     = []

    for i in range(1, max_iter + 1):
        denom = fx1 - fx0

        if abs(denom) < 1e-15:
            print(f"\n  ✗ DIVERGENCIA: f(x{i-1}) ≈ f(x{i}) en la iteración {i}.")
            break

        x2    = x1 - fx1 * (x1 - x0) / denom
        error = abs(x2 - x1)

        filas.append((
            i,
            formatear_numero(x0),
            formatear_numero(x1),
            formatear_numero(fx0),
            formatear_numero(fx1),
            formatear_numero(x2),
            formatear_numero(error),
        ))

        x0, fx0 = x1, fx1
        x1 = x2
        try:
            fx1 = f(x1)
        except Exception as e:
            print(f"\n  ✗ Error evaluando f en la iteración {i}: {e}")
            break

        if error < tol:
            converged = True
            break

    # ── Mostrar tabla ─────────────────────────────────────────────
    print()
    anchos = [5, 16, 16, 16, 16, 16, 14]
    mostrar_tabla_iteraciones(
        ["  n", "  x_{n-1}", "  x_n", "  f(x_{n-1})", "  f(x_n)", "  x_{n+1}", "  Error"],
        [(" "+str(r[0]), " "+r[1], " "+r[2], " "+r[3], " "+r[4], " "+r[5], " "+r[6])
         for r in filas],
        anchos,
    )

    print()
    if converged:
        print(f"  ✓ CONVERGIÓ en {len(filas)} iteraciones.")
        print(f"  ✓ Raíz aproximada: x ≈ {formatear_numero(x1)}")
    else:
        print(f"  ✗ No convergió en {max_iter} iteraciones.")
        print(f"  → Última aproximación: x ≈ {formatear_numero(x1)}")

    pausar()


# ══════════════════════════════════════════════════════════════════
#  3. MÜLLER
# ══════════════════════════════════════════════════════════════════

def muller():
    titulo("MÉTODO DE MÜLLER")
    print("  Busca raíces usando parábolas — soporta raíces complejas.")
    print("  Requiere 3 puntos iniciales distintos.")
    print()
    print("  Reglas de uso: mismas que Newton-Raphson.")
    separador()

    func_str, f_sym = pedir_funcion("  f(x) = ")
    x_sym = sp.Symbol("x")

    # Lambdify con soporte complejo usando sympy como backend
    try:
        f_lam = sp.lambdify(x_sym, f_sym, modules="sympy")
    except Exception as e:
        print(f"  ✗ Error: {e}"); pausar(); return

    def eval_f(val):
        try:
            return complex(f_lam(val))
        except Exception as exc:
            raise ValueError(f"Error evaluando f({val}): {exc}") from exc

    print()
    x0       = complex(pedir_float("  Primer punto  x0 = "))
    x1       = complex(pedir_float("  Segundo punto x1 = "))
    x2       = complex(pedir_float("  Tercer punto  x2 = "))
    tol      = pedir_float("  Tolerancia       tol = ")
    max_iter = pedir_int  ("  Máximo de iteraciones = ")

    # ── Iteraciones ───────────────────────────────────────────────
    separador()
    print(f"  Ejecutando Müller con x0={x0.real}, x1={x1.real}, x2={x2.real}, "
          f"tol={tol}, maxIter={max_iter}")
    separador()

    converged = False
    filas     = []

    for i in range(1, max_iter + 1):
        try:
            fx0 = eval_f(x0)
            fx1 = eval_f(x1)
            fx2 = eval_f(x2)
        except ValueError as e:
            print(f"\n  ✗ Error: {e}"); break

        h1 = x1 - x0
        h2 = x2 - x1

        if abs(h1) < 1e-15 or abs(h2) < 1e-15:
            print(f"\n  ✗ Dos puntos son idénticos en la iteración {i}.")
            break

        delta1 = (fx1 - fx0) / h1
        delta2 = (fx2 - fx1) / h2
        a      = (delta2 - delta1) / (h2 + h1)
        b      = a * h2 + delta2
        c      = fx2

        discriminante = b**2 - 4 * a * c
        sqrt_disc     = cmath.sqrt(discriminante)

        # Elegir denominador con mayor módulo (estabilidad numérica)
        d_plus  = b + sqrt_disc
        d_minus = b - sqrt_disc
        denom   = d_plus if abs(d_plus) >= abs(d_minus) else d_minus

        if abs(denom) < 1e-15:
            print(f"\n  ✗ Denominador ≈ 0 en la iteración {i}. No puede continuar.")
            break

        x3    = x2 - (2 * c) / denom
        error = abs(x3 - x2)

        es_compleja = abs(x3.imag) > 1e-10
        filas.append((
            i,
            formatear_numero(x2),
            formatear_numero(fx2),
            formatear_numero(discriminante),
            formatear_numero(x3),
            f"{error.real:.2e}",
            "Sí" if es_compleja else "No",
        ))

        x0, x1, x2 = x1, x2, x3

        if error < tol:
            converged = True
            break

    # ── Mostrar tabla ─────────────────────────────────────────────
    print()
    anchos = [5, 22, 18, 18, 22, 12, 9]
    mostrar_tabla_iteraciones(
        ["  n", "  x_n", "  f(x_n)", "  Disc.", "  x_{n+1}", "  Error", "  Compl."],
        [(" "+str(r[0]), " "+r[1], " "+r[2], " "+r[3], " "+r[4], " "+r[5], " "+r[6])
         for r in filas],
        anchos,
    )

    print()
    if converged:
        print(f"  ✓ CONVERGIÓ en {len(filas)} iteraciones.")
        val = formatear_numero(x2)
        print(f"  ✓ Raíz aproximada: x ≈ {val}")
        if abs(x2.imag) > 1e-10:
            print("  ℹ La raíz es COMPLEJA (discriminante negativo en alguna iteración).")
    else:
        print(f"  ✗ No convergió en {max_iter} iteraciones.")
        print(f"  → Última aproximación: x ≈ {formatear_numero(x2)}")

    pausar()


# ══════════════════════════════════════════════════════════════════
#  HELPERS PARA MÉTODOS DE SISTEMAS LINEALES
# ══════════════════════════════════════════════════════════════════

def pedir_matriz_aumentada():
    """
    Guía al usuario para ingresar una matriz aumentada [A|b].
    Devuelve (n, M) donde M es lista de listas de floats.
    """
    print()
    print("  Formato de ingreso de la matriz aumentada [A|b]:")
    print("  • Ingresa los coeficientes de cada fila separados por comas.")
    print("  • La última columna es el vector b.")
    print("  • Ejemplo para sistema 3×3:")
    print("      Fila 1: 2, 1, -1, 8")
    print("      Fila 2: -3, -1, 2, -11")
    print("      Fila 3: -2, 1, 2, -3")
    print()

    n = pedir_int("  Número de ecuaciones (n) = ")
    M = []

    for i in range(n):
        while True:
            raw = input(f"  Fila {i+1} ({n+1} valores): ").strip()
            try:
                vals = [float(v.strip()) for v in raw.split(",")]
                if len(vals) != n + 1:
                    print(f"    ✗ Se esperaban {n+1} valores, se ingresaron {len(vals)}.")
                    continue
                M.append(vals)
                break
            except ValueError:
                print("    ✗ Valores inválidos. Usa números separados por comas.")

    return n, M


def mostrar_matriz(M, n, label="Matriz actual"):
    print(f"\n  [{label}]")
    for i, fila in enumerate(M):
        coef = "  | " + "  ".join(f"{v:10.4f}" for v in fila[:n])
        b    = f"  |  {fila[n]:10.4f} |"
        print(coef + b)
    print()


# ══════════════════════════════════════════════════════════════════
#  4. ELIMINACIÓN DE GAUSS
# ══════════════════════════════════════════════════════════════════

def gauss():
    titulo("ELIMINACIÓN DE GAUSS CON PIVOTEO PARCIAL")
    print("  Resuelve Ax = b transformando la matriz a forma triangular superior")
    print("  y luego aplica sustitución hacia atrás.")
    separador()

    n, M_orig = pedir_matriz_aumentada()
    A         = copy.deepcopy(M_orig)

    separador()
    print(f"  Ejecutando Gauss ({n}×{n}) con pivoteo parcial...")
    mostrar_matriz(A, n, "Matriz aumentada inicial")

    pasos = []
    paso  = 0

    # ── Eliminación hacia adelante ────────────────────────────────
    for col in range(n):
        # Pivoteo parcial
        max_fila = col
        for fila in range(col + 1, n):
            if abs(A[fila][col]) > abs(A[max_fila][col]):
                max_fila = fila

        if max_fila != col:
            A[col], A[max_fila] = A[max_fila], A[col]
            paso += 1
            snap = copy.deepcopy(A)
            pasos.append({
                "n": paso,
                "op": f"Intercambio F{col+1} ↔ F{max_fila+1}",
                "M":  snap,
            })
            print(f"  Paso {paso}: Intercambio F{col+1} ↔ F{max_fila+1}")

        pivot = A[col][col]
        if abs(pivot) < 1e-12:
            print(f"\n  ✗ MATRIZ SINGULAR: pivote ≈ 0 en columna {col+1}.")
            print("    El sistema no tiene solución única.")
            pausar(); return

        for fila in range(col + 1, n):
            factor = A[fila][col] / pivot
            for k in range(col, n + 1):
                A[fila][k] -= factor * A[col][k]
            paso += 1
            snap = copy.deepcopy(A)
            pasos.append({
                "n": paso,
                "op": f"F{fila+1} = F{fila+1} - ({factor:.4f}) * F{col+1}",
                "M":  snap,
            })
            print(f"  Paso {paso}: F{fila+1} = F{fila+1} - ({factor:.4f}) × F{col+1}")

    # ── Mostrar matrices por paso ─────────────────────────────────
    print()
    ver = input("  ¿Mostrar matrices de cada paso? (s/n): ").strip().lower()
    if ver == "s":
        for p in pasos:
            mostrar_matriz(p["M"], n, f"Paso {p['n']}: {p['op']}")

    mostrar_matriz(A, n, "Matriz triangular superior final")

    # ── Sustitución hacia atrás ───────────────────────────────────
    sol = [0.0] * n
    for i in range(n - 1, -1, -1):
        if abs(A[i][i]) < 1e-12:
            print(f"\n  ✗ Elemento diagonal ≈ 0 en la fila {i+1}. Sin solución única.")
            pausar(); return
        sol[i] = A[i][n]
        for j in range(i + 1, n):
            sol[i] -= A[i][j] * sol[j]
        sol[i] /= A[i][i]

    print()
    linea("─")
    print("  ✓ SOLUCIÓN:")
    linea("─")
    for i, val in enumerate(sol):
        print(f"    x{i+1} = {val:.8f}")
    linea("─")

    # Verificación
    print("\n  [Verificación: A · x = b]")
    for i in range(n):
        lhs = sum(M_orig[i][j] * sol[j] for j in range(n))
        rhs = M_orig[i][n]
        ok  = "✓" if abs(lhs - rhs) < 1e-6 else "✗"
        print(f"    Ecuación {i+1}: {lhs:.6f} ≈ {rhs:.6f}  {ok}")

    pausar()


# ══════════════════════════════════════════════════════════════════
#  5. GAUSS-SEIDEL
# ══════════════════════════════════════════════════════════════════

def gauss_seidel():
    titulo("MÉTODO DE GAUSS-SEIDEL")
    print("  Método iterativo para resolver Ax = b.")
    print("  Recomendado para matrices diagonalmente dominantes.")
    print("  x_i^(k+1) = (b_i - Σ_{j≠i} a_ij · x_j) / a_ii")
    separador()

    n, M = pedir_matriz_aumentada()

    # Separar A y b
    A = [[M[i][j] for j in range(n)] for i in range(n)]
    b = [M[i][n]  for i in range(n)]

    print()
    tol      = pedir_float("  Tolerancia (e.g. 0.0001)  = ")
    max_iter = pedir_int  ("  Máximo de iteraciones      = ")

    # ── Verificar diagonal ────────────────────────────────────────
    for i in range(n):
        if abs(A[i][i]) < 1e-12:
            print(f"\n  ✗ A[{i+1}][{i+1}] ≈ 0: diagonal con cero en la fila {i+1}.")
            print("    Gauss-Seidel no puede continuar. Reordena las ecuaciones.")
            pausar(); return

    # Advertencia de dominancia diagonal
    es_dd = True
    for i in range(n):
        suma_off = sum(abs(A[i][j]) for j in range(n) if j != i)
        if abs(A[i][i]) < suma_off:
            es_dd = False; break
    if not es_dd:
        print()
        print("  ⚠ La matriz NO es diagonalmente dominante.")
        print("    El método podría no converger.")

    # ── Iteraciones ───────────────────────────────────────────────
    separador()
    print(f"  Ejecutando Gauss-Seidel ({n}×{n}), tol={tol}, maxIter={max_iter}")
    separador()

    x         = [0.0] * n
    converged = False
    filas     = []

    for it in range(1, max_iter + 1):
        x_old    = x[:]
        max_err  = 0.0

        for i in range(n):
            sigma = sum(A[i][j] * x[j] for j in range(n) if j != i)
            x[i]  = (b[i] - sigma) / A[i][i]

        errores = [abs(x[i] - x_old[i]) for i in range(n)]
        max_err = max(errores)

        fila_vals = [str(it)] + [formatear_numero(v, 6) for v in x] + [f"{max_err:.2e}"]
        filas.append(fila_vals)

        if max_err < tol:
            converged = True
            break

    # ── Mostrar tabla ─────────────────────────────────────────────
    print()
    headers = ["  Iter"] + [f"  x{i+1}" for i in range(n)] + ["  Error máx."]
    anchos  = [7] + [14] * n + [14]
    mostrar_tabla_iteraciones(
        headers,
        [(" "+r[0],) + tuple(" "+v for v in r[1:]) for r in filas],
        anchos,
    )

    print()
    if converged:
        print(f"  ✓ CONVERGIÓ en {len(filas)} iteraciones.")
    else:
        print(f"  ✗ No convergió en {max_iter} iteraciones.")

    print()
    linea("─")
    print("  SOLUCIÓN:")
    linea("─")
    for i, val in enumerate(x):
        print(f"    x{i+1} = {val:.8f}")
    linea("─")

    # Verificación
    print("\n  [Verificación: A · x = b]")
    for i in range(n):
        lhs = sum(A[i][j] * x[j] for j in range(n))
        ok  = "✓" if abs(lhs - b[i]) < max(tol * 10, 1e-4) else "✗"
        print(f"    Ecuación {i+1}: {lhs:.6f} ≈ {b[i]:.6f}  {ok}")

    pausar()


# ══════════════════════════════════════════════════════════════════
#  6. GAUSS-JORDAN
# ══════════════════════════════════════════════════════════════════

def gauss_jordan():
    titulo("ELIMINACIÓN DE GAUSS-JORDAN")
    print("  Reduce la matriz aumentada a su forma escalonada reducida (RREF).")
    print("  La solución se lee directamente de la última columna.")
    separador()

    n, M_orig = pedir_matriz_aumentada()
    A         = copy.deepcopy(M_orig)

    separador()
    print(f"  Ejecutando Gauss-Jordan ({n}×{n})...")
    mostrar_matriz(A, n, "Matriz aumentada inicial")

    pasos = []
    paso  = 0

    # ── Reducción a RREF ──────────────────────────────────────────
    for col in range(n):
        # Pivoteo parcial
        max_fila = col
        for fila in range(col + 1, n):
            if abs(A[fila][col]) > abs(A[max_fila][col]):
                max_fila = fila

        if max_fila != col:
            A[col], A[max_fila] = A[max_fila], A[col]
            paso += 1
            pasos.append({
                "n":  paso,
                "op": f"Intercambio F{col+1} ↔ F{max_fila+1}",
                "M":  copy.deepcopy(A),
            })
            print(f"  Paso {paso}: Intercambio F{col+1} ↔ F{max_fila+1}")

        pivot = A[col][col]
        if abs(pivot) < 1e-12:
            print(f"\n  ✗ MATRIZ SINGULAR: pivote ≈ 0 en columna {col+1}.")
            print("    El sistema no tiene solución única.")
            pausar(); return

        # Normalizar fila pivote → A[col][col] = 1
        inv_p = 1.0 / pivot
        for k in range(n + 1):
            A[col][k] *= inv_p
        paso += 1
        pasos.append({
            "n":  paso,
            "op": f"F{col+1} = F{col+1} × (1/{pivot:.4f})",
            "M":  copy.deepcopy(A),
        })
        print(f"  Paso {paso}: F{col+1} = F{col+1} × (1/{pivot:.4f})")

        # Eliminar TODAS las demás filas (arriba y abajo)
        for fila in range(n):
            if fila == col:
                continue
            factor = A[fila][col]
            if abs(factor) < 1e-15:
                continue
            for k in range(n + 1):
                A[fila][k] -= factor * A[col][k]
            paso += 1
            pasos.append({
                "n":  paso,
                "op": f"F{fila+1} = F{fila+1} - ({factor:.4f}) × F{col+1}",
                "M":  copy.deepcopy(A),
            })
            print(f"  Paso {paso}: F{fila+1} = F{fila+1} - ({factor:.4f}) × F{col+1}")

    # ── Mostrar matrices por paso ─────────────────────────────────
    print()
    ver = input("  ¿Mostrar matrices de cada paso? (s/n): ").strip().lower()
    if ver == "s":
        for p in pasos:
            mostrar_matriz(p["M"], n, f"Paso {p['n']}: {p['op']}")

    mostrar_matriz(A, n, "Matriz en RREF (forma final)")

    # ── Leer solución ─────────────────────────────────────────────
    sol = [A[i][n] for i in range(n)]

    print()
    linea("─")
    print("  ✓ SOLUCIÓN (leída directamente de la columna aumentada):")
    linea("─")
    for i, val in enumerate(sol):
        print(f"    x{i+1} = {val:.8f}")
    linea("─")

    # Verificación
    print("\n  [Verificación: A · x = b]")
    for i in range(n):
        lhs = sum(M_orig[i][j] * sol[j] for j in range(n))
        rhs = M_orig[i][n]
        ok  = "✓" if abs(lhs - rhs) < 1e-6 else "✗"
        print(f"    Ecuación {i+1}: {lhs:.6f} ≈ {rhs:.6f}  {ok}")

    pausar()


# ══════════════════════════════════════════════════════════════════
#  MENÚ PRINCIPAL
# ══════════════════════════════════════════════════════════════════

METODOS = {
    "1": ("Newton-Raphson",                  newton_raphson),
    "2": ("Secante",                          secante),
    "3": ("Müller",                           muller),
    "4": ("Eliminación de Gauss",             gauss),
    "5": ("Gauss-Seidel",                     gauss_seidel),
    "6": ("Gauss-Jordan",                     gauss_jordan),
}


def menu_principal():
    while True:
        cls()
        linea()
        print("  PLATAFORMA DE MÉTODOS NUMÉRICOS")
        print("  Universidad Mariano Gálvez de Guatemala")
        print("  Curso 021 – Métodos Numéricos")
        linea()
        print()
        print("  ── BÚSQUEDA DE RAÍCES ──────────────────")
        print("   1. Newton-Raphson")
        print("   2. Secante")
        print("   3. Müller (soporta raíces complejas)")
        print()
        print("  ── SISTEMAS LINEALES (Ax = b) ──────────")
        print("   4. Eliminación de Gauss")
        print("   5. Gauss-Seidel")
        print("   6. Gauss-Jordan")
        print()
        print("   0. Salir")
        print()
        linea("─")

        opcion = input("  Selecciona un método [0-6]: ").strip()

        if opcion == "0":
            cls()
            print("\n  Hasta luego.\n")
            sys.exit(0)

        if opcion in METODOS:
            cls()
            METODOS[opcion][1]()
        else:
            print("  ✗ Opción inválida. Elige entre 0 y 6.")
            pausar()


# ══════════════════════════════════════════════════════════════════
#  ENTRY POINT
# ══════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    menu_principal()