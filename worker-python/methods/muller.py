import sympy as sp
import cmath


def muller(expresion, parametros):

    x = sp.Symbol("x")
    f_expr = sp.sympify(expresion)
    f = sp.lambdify(x, f_expr, "complex")

    x0 = complex(float(parametros["x0"]))
    x1 = complex(float(parametros["x1"]))
    x2 = complex(float(parametros["x2"]))

    tolerancia = float(parametros["tolerancia"])
    max_iteraciones = int(parametros["maxIteraciones"])

    iteraciones = []
    error = None

    for i in range(1, max_iteraciones + 1):

        fx0 = f(x0)
        fx1 = f(x1)
        fx2 = f(x2)

        h0 = x1 - x0
        h1 = x2 - x1

        if abs(h0) < 1e-12 or abs(h1) < 1e-12:
            raise Exception("Valores iniciales inválidos.")

        d0 = (fx1 - fx0) / h0
        d1 = (fx2 - fx1) / h1

        a = (d1 - d0) / (h1 + h0)
        b = a * h1 + d1
        c = fx2

        # Manejo correcto de raíces complejas con cmath
        discriminante = b**2 - 4 * a * c
        raiz_discriminante = cmath.sqrt(discriminante)

        if abs(b + raiz_discriminante) > abs(b - raiz_discriminante):
            denominador = b + raiz_discriminante
        else:
            denominador = b - raiz_discriminante

        if abs(denominador) < 1e-12:
            raise Exception("Denominador cercano a cero.")

        xr = x2 - (2 * c) / denominador

        if abs(xr) > 1e-12:
            error = abs((xr - x2) / xr) * 100
        else:
            error = abs(xr - x2)

        iteraciones.append({
            "numero": i,
            "valorX": str(xr),
            "error": abs(error),
            "datos": {
                "x0": str(x0),
                "x1": str(x1),
                "x2": str(x2),
                "fx0": str(fx0),
                "fx1": str(fx1),
                "fx2": str(fx2),
                "a": str(a),
                "b": str(b),
                "c": str(c),
                "xr": str(xr)
            }
        })

        if abs(error) < tolerancia:
            return str(xr), abs(error), i, True, iteraciones

        x0 = x1
        x1 = x2
        x2 = xr

    return str(x2), abs(error), max_iteraciones, False, iteraciones