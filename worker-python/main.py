import json

from config import REDIS_QUEUE
from db import get_sql_connection
from redis_client import get_redis_client
from dispatcher import ejecutar_metodo


redis_client = get_redis_client()
conn = get_sql_connection()
cursor = conn.cursor()

print("Worker iniciado. Esperando jobs en Redis...")


while True:
    job_data = redis_client.blpop(REDIS_QUEUE)
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

        resultado, error_final, total_iteraciones, converged, iteraciones = ejecutar_metodo(
            metodo,
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