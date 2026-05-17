from methods.newton_raphson import newton_raphson
from methods.secante import secante
from methods.muller import muller


def ejecutar_metodo(metodo, expresion, parametros):
    if metodo == "Newton-Raphson":
        return newton_raphson(expresion, parametros)

    elif metodo == "Secante":
        return secante(expresion, parametros)

    elif metodo == "Muller":
        return muller(expresion, parametros)

    else:
        raise Exception(f"Método no soportado: {metodo}")