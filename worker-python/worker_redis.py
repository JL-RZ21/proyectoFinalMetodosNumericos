import json
import redis
import pyodbc
import sympy as sp
import time

# Redis
redis_client = redis.Redis(host="redis", port=6379, db=0)

# SQL Server
conn = None

for intento in range(1, 31):
    try:
        conn = pyodbc.connect(
            "DRIVER={ODBC Driver 18 for SQL Server};"
            "SERVER=sqlserver,1433;"
            "DATABASE=MetodosNumericos;"
            "UID=sa;"
            "PWD=Password123!;"
            "TrustServerCertificate=yes;"
        )
        print("Conectado a SQL Server")
        break
    except Exception:
        print(f"Intento {intento}: SQL Server no listo. Esperando...")
        time.sleep(5)

if conn is None:
    raise Exception("No se pudo conectar a SQL Server después de varios intentos.")

cursor = conn.cursor()


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
            raise Exception("Derivada cercana a cero. División por cero.")

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
            raise Exception("División entre cero en el método de la secante.")

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
            raise Exception("Valores iniciales inválidos en el método de Müller.")

        d0 = (fx1 - fx0) / h0
        d1 = (fx2 - fx1) / h1

        a = (d1 - d0) / (h1 + h0)
        b = a * h1 + d1
        c = fx2

        discriminante = b**2 - 4 * a * c

        if discriminante < 0:
            raise Exception("El método de Müller generó raíz compleja. Este worker solo acepta resultados reales.")

        raiz_discriminante = discriminante ** 0.5

        if abs(b + raiz_discriminante) > abs(b - raiz_discriminante):
            denominador = b + raiz_discriminante
        else:
            denominador = b - raiz_discriminante

        if abs(denominador) < 1e-12:
            raise Exception("Denominador cercano a cero en el método de Müller.")

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
                "h0": h0,
                "h1": h1,
                "d0": d0,
                "d1": d1,
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

print("Worker iniciado. Esperando jobs en Redis...")

while True:
    job_data = redis_client.blpop("queue:jobs")
    job_id = int(job_data[1].decode("utf-8"))

    print(f"Procesando Job ID: {job_id}")

    try:
        cursor.execute(
            "UPDATE Jobs SET Estado = 'RUNNING', FechaInicio = GETDATE() WHERE Id = ?",
            job_id
        )
        conn.commit()

        cursor.execute(
            "SELECT Metodo, Expresion, Parametros FROM Jobs WHERE Id = ?",
            job_id
        )
        job = cursor.fetchone()

        if not job:
            raise Exception("Job no encontrado en la base de datos.")

        metodo = job.Metodo
        expresion = job.Expresion
        parametros = json.loads(job.Parametros)

        if metodo == "Newton-Raphson":
            resultado, error_final, total_iteraciones, converged, iteraciones = newton_raphson(
                expresion,
                parametros
            )

        elif metodo == "Secante":
            resultado, error_final, total_iteraciones, converged, iteraciones = secante(
                expresion,
                parametros
            )
        elif metodo == "Muller":
            resultado, error_final, total_iteraciones, converged, iteraciones = muller(
                expresion,
                parametros
            )

        else:
            raise Exception(f"Método no soportado: {metodo}")

        for item in iteraciones:
            cursor.execute(
                """
                INSERT INTO Iteraciones (JobId, NumeroIteracion, ValorX, Error, DatosAdicionales)
                VALUES (?, ?, ?, ?, ?)
                """,
                job_id,
                item["numero"],
                str(item["valorX"]),
                item["error"],
                json.dumps(item.get("datos", {}))
            )

        cursor.execute(
            """
            UPDATE Jobs
            SET Estado = 'DONE',
                Resultado = ?,
                ErrorFinal = ?,
                IteracionesTotal = ?,
                Converged = ?,
                FechaFinalizacion = GETDATE()
            WHERE Id = ?
            """,
            str(resultado),
            error_final,
            total_iteraciones,
            1 if converged else 0,
            job_id
        )

        conn.commit()
        print(f"Job {job_id} finalizado correctamente.")

    except Exception as e:
        cursor.execute(
            """
            UPDATE Jobs
            SET Estado = 'FAILED',
                MensajeError = ?,
                FechaFinalizacion = GETDATE()
            WHERE Id = ?
            """,
            str(e),
            job_id
        )
        conn.commit()
        print(f"Job {job_id} falló: {e}")