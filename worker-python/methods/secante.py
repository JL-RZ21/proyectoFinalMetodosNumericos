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

<<<<<<< HEAD
    error_porcentual = None
=======
<<<<<<< HEAD
    error_porcentual = None
=======
    error = None
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
>>>>>>> origin/main

    for i in range(1, max_iteraciones + 1):

        fx0 = f(x0)
        fx1 = f(x1)

        if abs(fx1 - fx0) < 1e-12:
            raise Exception("División entre cero.")

        x2 = x1 - (fx1 * (x1 - x0)) / (fx1 - fx0)

<<<<<<< HEAD
        diferencia = abs(x2 - x1)
        if abs(x2) > 1e-12:
            error_relativo = diferencia / abs(x2)
        else:
            error_relativo = diferencia

        error_porcentual = error_relativo * 100
=======
<<<<<<< HEAD
        diferencia = abs(x2 - x1)
        if abs(x2) > 1e-12:
            error_relativo = diferencia / abs(x2)
        else:
            error_relativo = diferencia

        error_porcentual = error_relativo * 100
=======
        if x2 != 0:
            error = abs((x2 - x1) / x2) * 100
        else:
            error = abs(x2 - x1)
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
>>>>>>> origin/main

        iteraciones.append({
            "numero": i,
            "valorX": x2,
<<<<<<< HEAD
            "error": error_porcentual,
=======
<<<<<<< HEAD
            "error": error_porcentual,
            "datos": {
                "xAnterior": x1,
                "xNuevo": x2,
                "x0": x0,
                "x1": x1,
                "fxAnterior": fx0,
                "fxActual": fx1,
                "fxNuevo": f(x2),
                "errorRelativo": error_relativo,
                "errorPorcentual": error_porcentual
            }
        })

        if error_porcentual < tolerancia:
            return x2, error_porcentual, i, True, iteraciones
=======
            "error": error,
>>>>>>> origin/main
            "datos": {
                "xAnterior": x1,
                "xNuevo": x2,
                "x0": x0,
                "x1": x1,
                "fxAnterior": fx0,
                "fxActual": fx1,
                "fxNuevo": f(x2),
                "errorRelativo": error_relativo,
                "errorPorcentual": error_porcentual
            }
        })

<<<<<<< HEAD
        if error_porcentual < tolerancia:
            return x2, error_porcentual, i, True, iteraciones
=======
        if error < tolerancia:
            return x2, error, i, True, iteraciones
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
>>>>>>> origin/main

        x0 = x1
        x1 = x2

<<<<<<< HEAD
    return x2, error_porcentual, max_iteraciones, False, iteraciones
=======
<<<<<<< HEAD
    return x2, error_porcentual, max_iteraciones, False, iteraciones
=======
    return x2, error, max_iteraciones, False, iteraciones
>>>>>>> 6cbefc402c3995a8b2cba5f69a41aafbaae739f9
>>>>>>> origin/main
