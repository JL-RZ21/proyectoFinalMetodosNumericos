CREATE TABLE Jobs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Metodo NVARCHAR(50) NOT NULL,
    Expresion NVARCHAR(255) NOT NULL,
    Parametros NVARCHAR(MAX) NOT NULL,
    Estado NVARCHAR(20) NOT NULL DEFAULT 'PENDING',
    Resultado NVARCHAR(MAX) NULL,
    ErrorFinal FLOAT NULL,
    IteracionesTotal INT NULL,
    Converged BIT NULL,
    MensajeError NVARCHAR(500) NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    FechaInicio DATETIME NULL,
    FechaFinalizacion DATETIME NULL
);


CREATE TABLE Iteraciones (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    JobId INT NOT NULL,
    NumeroIteracion INT NOT NULL,
    ValorX NVARCHAR(MAX) NULL,
    Error FLOAT NULL,
    DatosAdicionales NVARCHAR(MAX) NULL,

    CONSTRAINT FK_Iteraciones_Jobs 
    FOREIGN KEY (JobId) REFERENCES Jobs(Id)
);


CREATE TABLE Logs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    JobId INT NULL,
    Mensaje NVARCHAR(255) NOT NULL,
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Logs_Jobs 
    FOREIGN KEY (JobId) REFERENCES Jobs(Id)
);


ALTER TABLE Jobs
ADD CONSTRAINT CK_Jobs_Estado
CHECK (Estado IN ('PENDING', 'RUNNING', 'DONE', 'FAILED'));


CREATE INDEX IX_Jobs_Estado ON Jobs(Estado);


CREATE INDEX IX_Iteraciones_JobId ON Iteraciones(JobId);


CREATE INDEX IX_Logs_JobId ON Logs(JobId);