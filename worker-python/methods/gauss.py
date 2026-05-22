import copy

def gauss(expresion, parametros):
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

        for i in range(k + 1, n):
            if abs(matriz[k][k]) < 1e-12:
                raise Exception("Matriz singular detectada.")
            factor = matriz[i][k] / matriz[k][k]
            for j in range(k, n + 1):
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

    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        x[i] = matriz[i][n]
        for j in range(i + 1, n):
            x[i] -= matriz[i][j] * x[j]
        x[i] /= matriz[i][i]

    return x, 0.0, num_iter, True, iteraciones


def parsear_matriz(matrix_str):
    filas = matrix_str.strip().split(";")
    return [list(map(float, fila.split(","))) for fila in filas]