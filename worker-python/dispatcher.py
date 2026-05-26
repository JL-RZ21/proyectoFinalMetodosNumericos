from methods.newton_raphson import newton_raphson
from methods.secante import secante
from methods.muller import muller
from methods.gauss import gauss
from methods.gauss_seidel import gauss_seidel
from methods.gauss_jordan import gauss_jordan


def ejecutar_metodo(metodo, expresion, parametros):
    if metodo == "Newton-Raphson":
        return newton_raphson(expresion, parametros)

    elif metodo == "Secante":
        return secante(expresion, parametros)

    elif metodo == "Muller":
        return muller(expresion, parametros)

    elif metodo == "Gauss":
        return gauss(expresion, parametros)

    elif metodo == "Gauss-Seidel":
        return gauss_seidel(expresion, parametros)

    elif metodo == "Gauss-Jordan":
        return gauss_jordan(expresion, parametros)

    else:
        raise Exception(f"Método no soportado: {metodo}")