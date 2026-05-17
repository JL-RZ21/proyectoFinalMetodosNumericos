import sympy as sp


def newton_raphson(expresion, parametros):
    x = sp.Symbol("x")

    f_expr = sp.sympify(expresion)
    df_expr = sp.diff(f_expr, x)

    f = sp.lambdify(x, f_expr, "math")
    df = sp.lambdify(x, df_expr, "math")

    x_actual = float(parametros["x0"])
    tolerancia = float(parametros["tolerancia"])
    max_iteraciones = int(parametros["maxIteraciones"])

    iteraciones = []
    error = None

    for i in range(1, max_iteraciones + 1):

        fx = f(x_actual)
        dfx = df(x_actual)

        if abs(dfx) < 1e-12:
            raise Exception("Derivada cercana a cero.")

        x_nuevo = x_actual - fx / dfx

        error = abs(x_nuevo - x_actual)

        iteraciones.append({
            "numero": i,
            "valorX": x_nuevo,
            "error": error,
            "datos": {
                "xAnterior": x_actual,
                "xNuevo": x_nuevo,
                "fx": fx,
                "dfx": dfx
            }
        })

        if error < tolerancia:
            return x_nuevo, error, i, True, iteraciones

        x_actual = x_nuevo

    return x_actual, error, max_iteraciones, False, iteraciones