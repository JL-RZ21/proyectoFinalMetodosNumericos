# config.py

REDIS_HOST = "redis"
REDIS_PORT = 6379
REDIS_DB = 0
REDIS_QUEUE = "queue:jobs"

SQL_CONNECTION_STRING = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=sqlserver,1433;"
    "DATABASE=MetodosNumericos;"
    "UID=sa;"
    "PWD=Password123!;"
    "TrustServerCertificate=yes;"
)