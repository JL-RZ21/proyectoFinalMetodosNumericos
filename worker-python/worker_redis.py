import json
import redis
import pyodbc
import sympy as sp
import time

# Redis
redis_client = redis.Redis(host='redis', port=6379, db=0)

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
    except Exception as e:
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
            "error": error
        })

        if error < tolerancia:
            return x_nuevo, error, i, True, iteraciones

        x_actual = x_nuevo

    return x_actual, error, max_iteraciones, False, iteraciones


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

        if metodo != "Newton-Raphson":
            raise Exception(f"Método no soportado todavía: {metodo}")

        resultado, error_final, total_iteraciones, converged, iteraciones = newton_raphson(
            expresion,
            parametros
        )

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
                None
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