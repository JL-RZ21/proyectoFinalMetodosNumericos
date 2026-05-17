# db.py

import time
import pyodbc
from config import SQL_CONNECTION_STRING


def get_sql_connection():
    conn = None

    for intento in range(1, 31):
        try:
            conn = pyodbc.connect(SQL_CONNECTION_STRING)
            print("Conectado a SQL Server")
            return conn

        except Exception:
            print(f"Intento {intento}: SQL Server no listo. Esperando...")
            time.sleep(5)

    raise Exception("No se pudo conectar a SQL Server después de varios intentos.")