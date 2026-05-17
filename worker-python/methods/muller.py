import sympy as sp


def muller(expresion, parametros):

    x = sp.Symbol("x")

    f_expr = sp.sympify(expresion)

    f = sp.lambdify(x, f_expr, "math")

    x0 = float(parametros["x0"])
    x1 = float(parametros["x1"])
    x2 = float(parametros["x2"])

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

        discriminante = b**2 - 4 * a * c

        if discriminante < 0:
            raise Exception("Raíz compleja detectada.")

        raiz_discriminante = discriminante ** 0.5

        if abs(b + raiz_discriminante) > abs(b - raiz_discriminante):
            denominador = b + raiz_discriminante
        else:
            denominador = b - raiz_discriminante

        if abs(denominador) < 1e-12:
            raise Exception("Denominador cercano a cero.")

        xr = x2 - (2 * c) / denominador

        if xr != 0:
            error = abs((xr - x2) / xr) * 100
        else:
            error = abs(xr - x2)

        iteraciones.append({
            "numero": i,
            "valorX": xr,
            "error": error,
            "datos": {
                "x0": x0,
                "x1": x1,
                "x2": x2,
                "fx0": fx0,
                "fx1": fx1,
                "fx2": fx2,
                "a": a,
                "b": b,
                "c": c,
                "xr": xr
            }
        })

        if error < tolerancia:
            return xr, error, i, True, iteraciones

        x0 = x1
        x1 = x2
        x2 = xr

    return x2, error, max_iteraciones, False, iteraciones