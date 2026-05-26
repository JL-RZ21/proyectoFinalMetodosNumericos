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
<<<<<<< HEAD
    error_porcentual = None
=======
    error = None
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9

    for i in range(1, max_iteraciones + 1):

        fx = f(x_actual)
        dfx = df(x_actual)

        if abs(dfx) < 1e-12:
            raise Exception("Derivada cercana a cero.")

        x_nuevo = x_actual - fx / dfx

<<<<<<< HEAD
        diferencia = abs(x_nuevo - x_actual)
        if abs(x_nuevo) > 1e-12:
            error_relativo = diferencia / abs(x_nuevo)
        else:
            error_relativo = diferencia

        error_porcentual = error_relativo * 100
=======
        error = abs(x_nuevo - x_actual)
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9

        iteraciones.append({
            "numero": i,
            "valorX": x_nuevo,
<<<<<<< HEAD
            "error": error_porcentual,
            "datos": {
                "xAnterior": x_actual,
                "xNuevo": x_nuevo,
                "errorRelativo": error_relativo,
                "errorPorcentual": error_porcentual,
=======
            "error": error,
            "datos": {
                "xAnterior": x_actual,
                "xNuevo": x_nuevo,
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
                "fx": fx,
                "dfx": dfx
            }
        })

<<<<<<< HEAD
        if error_porcentual < tolerancia:
            return x_nuevo, error_porcentual, i, True, iteraciones

        x_actual = x_nuevo

    return x_actual, error_porcentual, max_iteraciones, False, iteraciones
=======
        if error < tolerancia:
            return x_nuevo, error, i, True, iteraciones

        x_actual = x_nuevo

    return x_actual, error, max_iteraciones, False, iteraciones
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
