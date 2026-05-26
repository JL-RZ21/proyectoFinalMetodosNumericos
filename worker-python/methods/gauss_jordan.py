import copy

def gauss_jordan(expresion, parametros):
    matrix_str = expresion

    matriz = parsear_matriz(matrix_str)
    n = len(matriz)
    iteraciones = []
    num_iter = 0

    for k in range(n):
        max_fila = max(range(k, n), key=lambda i: abs(matriz[i][k]))
        if abs(matriz[max_fila][k]) < 1e-12:
            raise Exception("Matriz singular detectada.")
        matriz[k], matriz[max_fila] = matriz[max_fila], matriz[k]

        pivote = matriz[k][k]
        for j in range(n + 1):
            matriz[k][j] /= pivote

        for i in range(n):
            if i != k:
                factor = matriz[i][k]
                for j in range(n + 1):
                    matriz[i][j] -= factor * matriz[k][j]

                num_iter += 1
                iteraciones.append({
                    "numero": num_iter,
                    "valorX": 0,
                    "error": 0,
                    "datos": {
                        "matrizActual": copy.deepcopy(matriz),
                        "paso": f"Eliminando columna {k+1}, fila {i+1}"
                    }
                })

    x = [matriz[i][n] for i in range(n)]
    return x, 0.0, num_iter, True, iteraciones


def parsear_matriz(matrix_str):
    filas = matrix_str.strip().split(";")
    return [list(map(float, fila.split(","))) for fila in filas]