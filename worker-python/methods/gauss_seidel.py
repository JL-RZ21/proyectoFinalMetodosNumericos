import copy

def gauss_seidel(expresion, parametros):
    matrix_str = expresion
    tolerancia = float(parametros["tolerancia"])
    max_iteraciones = int(parametros["maxIteraciones"])

    matriz = parsear_matriz(matrix_str)
    n = len(matriz)

    A = [[matriz[i][j] for j in range(n)] for i in range(n)]
    b = [matriz[i][n] for i in range(n)]

    for i in range(n):
        if abs(A[i][i]) < 1e-12:
            raise Exception("Diagonal con ceros, el método no puede continuar.")

    x = [0.0] * n
    iteraciones = []
    error = None

    for it in range(1, max_iteraciones + 1):
        x_anterior = copy.copy(x)

        for i in range(n):
            suma = b[i]
            for j in range(n):
                if j != i:
                    suma -= A[i][j] * x[j]
            x[i] = suma / A[i][i]

        error = max(abs(x[i] - x_anterior[i]) for i in range(n))

        iteraciones.append({
            "numero": it,
            "valorX": copy.copy(x),
            "error": error,
            "datos": {
                "xAnterior": x_anterior,
                "xActual": copy.copy(x)
            }
        })

        if error < tolerancia:
            return x, error, it, True, iteraciones

    return x, error, max_iteraciones, False, iteraciones


def parsear_matriz(matrix_str):
    filas = matrix_str.strip().split(";")
    return [list(map(float, fila.split(","))) for fila in filas]