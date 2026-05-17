import sympy as sp


def secante(expresion, parametros):

    x = sp.Symbol("x")

    f_expr = sp.sympify(expresion)

    f = sp.lambdify(x, f_expr, "math")

    x0 = float(parametros["x0"])
    x1 = float(parametros["x1"])

    tolerancia = float(parametros["tolerancia"])
    max_iteraciones = int(parametros["maxIteraciones"])

    iteraciones = []

    error = None

    for i in range(1, max_iteraciones + 1):

        fx0 = f(x0)
        fx1 = f(x1)

        if abs(fx1 - fx0) < 1e-12:
            raise Exception("División entre cero.")

        x2 = x1 - (fx1 * (x1 - x0)) / (fx1 - fx0)

        if x2 != 0:
            error = abs((x2 - x1) / x2) * 100
        else:
            error = abs(x2 - x1)

        iteraciones.append({
            "numero": i,
            "valorX": x2,
            "error": error,
            "datos": {
                "xAnterior": x0,
                "xActual": x1,
                "xNuevo": x2,
                "fxAnterior": fx0,
                "fxActual": fx1,
                "fxNuevo": f(x2)
            }
        })

        if error < tolerancia:
            return x2, error, i, True, iteraciones

        x0 = x1
        x1 = x2

    return x2, error, max_iteraciones, False, iteraciones