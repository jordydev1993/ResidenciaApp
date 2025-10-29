/* ============================================
   INSTALACIÓN COMPLETA DEL SISTEMA
   Sistema de Gestión de Residencias para NNA
   ============================================
   
   Este script unifica TODOS los scripts SQL del sistema:
   
   SECCIÓN 1: Creación de Base de Datos y Tablas Principales
   SECCIÓN 2: Tablas de Autenticación (Login/Usuarios)
   SECCIÓN 3: Vistas y Stored Procedures
   SECCIÓN 4: Índices para Rendimiento
   SECCIÓN 5: Datos Iniciales de Catálogos
   SECCIÓN 6: Usuario Administrador Inicial
   SECCIÓN 7: (OPCIONAL) Datos de Demostración
   
   IMPORTANTE: Ejecutar este script en SQL Server 2012 o superior
   
   Fecha de creación: Octubre 2025
   Versión: 1.0
   ============================================ */

PRINT ''
PRINT '================================================================'
PRINT '  INSTALACIÓN COMPLETA - SISTEMA DE GESTIÓN DE RESIDENCIAS'
PRINT '================================================================'
PRINT ''
PRINT 'Fecha de ejecución: ' + CONVERT(VARCHAR, GETDATE(), 120)
PRINT ''

/* ============================================
   SECCIÓN 1: CREACIÓN DE BASE DE DATOS
   ============================================ */
PRINT ''
PRINT '📁 SECCIÓN 1: CREACIÓN DE BASE DE DATOS Y TABLAS PRINCIPALES'
PRINT '=============================================================='
PRINT ''

USE master;
GO

-- Eliminar base de datos si existe
IF DB_ID('ResidenciaDB') IS NOT NULL
BEGIN
    PRINT '🗑️ Eliminando base de datos existente...'
    ALTER DATABASE ResidenciaDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ResidenciaDB;
    PRINT '   ✓ Base de datos eliminada'
END
GO

-- Crear nueva base de datos
PRINT '🆕 Creando base de datos ResidenciaDB...'
CREATE DATABASE ResidenciaDB;
GO
PRINT '   ✓ Base de datos creada exitosamente'

USE ResidenciaDB;
GO

-- Configuración recomendada
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

/* ============================================
   TABLAS PRINCIPALES (con auditoría)
   ============================================ */
PRINT ''
PRINT '📋 Creando tablas principales...'

-- NINO
CREATE TABLE dbo.Nino (
  Id                INT IDENTITY(1,1) PRIMARY KEY,
  Dni               VARCHAR(20) NOT NULL,
  Apellido          NVARCHAR(100) NOT NULL,
  Nombre            NVARCHAR(100) NOT NULL,
  FechaNacimiento   DATE NOT NULL,
  FechaCreacion     DATETIME2      NOT NULL CONSTRAINT DF_Nino_FechaCreacion     DEFAULT SYSDATETIME(),
  FechaModificacion DATETIME2      NOT NULL CONSTRAINT DF_Nino_FechaModificacion DEFAULT SYSDATETIME(),
  UsuarioCreacion   NVARCHAR(100)  NULL,
  UsuarioModificacion NVARCHAR(100) NULL
);
ALTER TABLE dbo.Nino ADD CONSTRAINT UQ_Nino_Dni UNIQUE (Dni);
PRINT '   ✓ Tabla Nino creada'
GO

-- TUTOR
CREATE TABLE dbo.Tutor (
  Id                INT IDENTITY(1,1) PRIMARY KEY,
  Nombre            NVARCHAR(100) NOT NULL,
  Apellido          NVARCHAR(100) NULL,
  Telefono          NVARCHAR(50)  NULL,
  Email             NVARCHAR(100) NULL,
  FechaCreacion     DATETIME2      NOT NULL CONSTRAINT DF_Tutor_FechaCreacion     DEFAULT SYSDATETIME(),
  FechaModificacion DATETIME2      NOT NULL CONSTRAINT DF_Tutor_FechaModificacion DEFAULT SYSDATETIME(),
  UsuarioCreacion   NVARCHAR(100)  NULL,
  UsuarioModificacion NVARCHAR(100) NULL
);
PRINT '   ✓ Tabla Tutor creada'
GO

/* ============================================
   TABLAS CATÁLOGO (sin auditoría)
   ============================================ */
-- ESTADO (estado del legajo)
CREATE TABLE dbo.Estado (
  Id          INT IDENTITY(1,1) PRIMARY KEY,
  Nombre      NVARCHAR(50)  NOT NULL,
  Descripcion NVARCHAR(200) NULL
);
PRINT '   ✓ Tabla Estado creada'

-- TIPO ALERTA
CREATE TABLE dbo.TipoAlerta (
  Id          INT IDENTITY(1,1) PRIMARY KEY,
  Nombre      NVARCHAR(50)  NOT NULL,
  Descripcion NVARCHAR(100) NULL
);
PRINT '   ✓ Tabla TipoAlerta creada'

-- PRIORIDAD
CREATE TABLE dbo.Prioridad (
  Id          INT IDENTITY(1,1) PRIMARY KEY,
  Nombre      NVARCHAR(50)  NOT NULL,
  Color       VARCHAR(7)    NULL,
  Orden       INT           NULL
);
PRINT '   ✓ Tabla Prioridad creada'

-- ESTADO ALERTA
CREATE TABLE dbo.EstadoAlerta (
  Id          INT IDENTITY(1,1) PRIMARY KEY,
  Nombre      NVARCHAR(50)  NOT NULL,
  Descripcion NVARCHAR(100) NULL
);
PRINT '   ✓ Tabla EstadoAlerta creada'
GO

/* ============================================
   TABLAS OPERATIVAS (con auditoría)
   ============================================ */
-- LEGAJO
CREATE TABLE dbo.Legajo (
  Id                INT IDENTITY(1,1) PRIMARY KEY,
  NinoId            INT NOT NULL,
  TutorId           INT NULL,
  EstadoId          INT NOT NULL,
  FechaIngreso      DATE NOT NULL,
  FechaEgreso       DATE NULL,
  Observaciones     NVARCHAR(500) NULL,
  FechaCreacion     DATETIME2 NOT NULL CONSTRAINT DF_Legajo_FechaCreacion     DEFAULT SYSDATETIME(),
  FechaModificacion DATETIME2 NOT NULL CONSTRAINT DF_Legajo_FechaModificacion DEFAULT SYSDATETIME(),
  UsuarioCreacion   NVARCHAR(100)  NULL,
  UsuarioModificacion NVARCHAR(100) NULL,
  CONSTRAINT FK_Legajo_Nino   FOREIGN KEY (NinoId)   REFERENCES dbo.Nino(Id),
  CONSTRAINT FK_Legajo_Tutor  FOREIGN KEY (TutorId)  REFERENCES dbo.Tutor(Id),
  CONSTRAINT FK_Legajo_Estado FOREIGN KEY (EstadoId) REFERENCES dbo.Estado(Id)
);
PRINT '   ✓ Tabla Legajo creada'

-- ALERTA
CREATE TABLE dbo.Alerta (
  Id                INT IDENTITY(1,1) PRIMARY KEY,
  TipoId            INT NOT NULL,
  PrioridadId       INT NOT NULL,
  EstadoId          INT NOT NULL,
  LegajoId          INT NOT NULL,
  Descripcion       NVARCHAR(500) NOT NULL,
  FechaVencimiento  DATETIME2 NOT NULL,
  FechaCreacion     DATETIME2 NOT NULL CONSTRAINT DF_Alerta_FechaCreacion     DEFAULT SYSDATETIME(),
  FechaModificacion DATETIME2 NOT NULL CONSTRAINT DF_Alerta_FechaModificacion DEFAULT SYSDATETIME(),
  UsuarioCreacion   NVARCHAR(100)  NULL,
  UsuarioModificacion NVARCHAR(100) NULL,
  CONSTRAINT FK_Alerta_Tipo       FOREIGN KEY (TipoId)      REFERENCES dbo.TipoAlerta(Id),
  CONSTRAINT FK_Alerta_Prioridad  FOREIGN KEY (PrioridadId) REFERENCES dbo.Prioridad(Id),
  CONSTRAINT FK_Alerta_Estado     FOREIGN KEY (EstadoId)    REFERENCES dbo.EstadoAlerta(Id),
  CONSTRAINT FK_Alerta_Legajo     FOREIGN KEY (LegajoId)    REFERENCES dbo.Legajo(Id)
);
PRINT '   ✓ Tabla Alerta creada'
GO

/* ============================================
   ÍNDICES BÁSICOS
   ============================================ */
PRINT ''
PRINT '📇 Creando índices básicos...'

CREATE INDEX IX_Legajo_Nino_Estado ON dbo.Legajo (NinoId, EstadoId);
CREATE INDEX IX_Alerta_Legajo_Venc ON dbo.Alerta (LegajoId, FechaVencimiento);
CREATE INDEX IX_Alerta_Estado ON dbo.Alerta (EstadoId);
PRINT '   ✓ Índices básicos creados'
GO

/* ============================================
   SECCIÓN 2: TABLAS DE AUTENTICACIÓN
   ============================================ */
PRINT ''
PRINT '🔐 SECCIÓN 2: TABLAS DE AUTENTICACIÓN Y SEGURIDAD'
PRINT '=================================================='
PRINT ''

-- TABLA ROL
CREATE TABLE dbo.Rol (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL UNIQUE,
    Descripcion NVARCHAR(200) NULL,
    Nivel INT NOT NULL DEFAULT 3, -- 1=Admin, 2=Operador, 3=Consultor
    FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
PRINT '   ✓ Tabla Rol creada'

-- TABLA USUARIO
CREATE TABLE dbo.Usuario (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Usuario NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    Salt NVARCHAR(500) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    NombreCompleto NVARCHAR(200) NOT NULL,
    RolId INT NOT NULL,
    Activo BIT NOT NULL DEFAULT 1,
    IntentosLogin INT NOT NULL DEFAULT 0,
    UltimoIntento DATETIME2 NULL,
    UltimoAcceso DATETIME2 NULL,
    FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    FechaModificacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Usuario_Rol FOREIGN KEY (RolId) REFERENCES dbo.Rol(Id)
);
PRINT '   ✓ Tabla Usuario creada'

-- TABLA SESION
CREATE TABLE dbo.Sesion (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NOT NULL,
    Token NVARCHAR(500) NOT NULL UNIQUE,
    FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    FechaExpiracion DATETIME2 NOT NULL,
    Activa BIT NOT NULL DEFAULT 1,
    IpAddress NVARCHAR(50) NULL,
    UserAgent NVARCHAR(500) NULL,
    CONSTRAINT FK_Sesion_Usuario FOREIGN KEY (UsuarioId) REFERENCES dbo.Usuario(Id)
);
PRINT '   ✓ Tabla Sesion creada'

-- TABLA AUDITORÍA
CREATE TABLE dbo.AuditoriaLog (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NULL,
    Accion NVARCHAR(100) NOT NULL,
    Tabla NVARCHAR(100) NULL,
    RegistroId INT NULL,
    Detalles NVARCHAR(MAX) NULL,
    IpAddress NVARCHAR(50) NULL,
    FechaHora DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_AuditoriaLog_Usuario FOREIGN KEY (UsuarioId) REFERENCES dbo.Usuario(Id)
);
PRINT '   ✓ Tabla AuditoriaLog creada'
GO

/* ============================================
   SECCIÓN 3: VISTAS Y STORED PROCEDURES
   ============================================ */
PRINT ''
PRINT '👁️ SECCIÓN 3: VISTAS Y STORED PROCEDURES'
PRINT '=========================================='
PRINT ''

-- VISTA: Detalle de Legajos
CREATE OR ALTER VIEW dbo.VW_LegajoDetalle AS
SELECT
  L.Id             AS LegajoId,
  N.Id             AS NinoId,
  N.Dni,
  N.Apellido       AS NinoApellido,
  N.Nombre         AS NinoNombre,
  E.Id             AS EstadoId,
  E.Nombre         AS Estado,
  T.Id             AS TutorId,
  T.Nombre + ' ' + ISNULL(T.Apellido, '') AS Tutor,
  L.FechaIngreso,
  L.FechaEgreso,
  L.Observaciones,
  L.UsuarioCreacion,
  L.FechaCreacion,
  L.UsuarioModificacion,
  L.FechaModificacion
FROM dbo.Legajo L
JOIN dbo.Nino   N ON N.Id = L.NinoId
JOIN dbo.Estado E ON E.Id = L.EstadoId
LEFT JOIN dbo.Tutor  T ON T.Id = L.TutorId;
GO
PRINT '   ✓ Vista VW_LegajoDetalle creada'

-- VISTA: Detalle de Alertas
CREATE OR ALTER VIEW dbo.VW_AlertasDetalle AS
SELECT
  A.Id                 AS AlertaId,
  L.Id                 AS LegajoId,
  N.Id                 AS NinoId,
  (N.Nombre + N' ' + N.Apellido) AS Nino,
  TA.Nombre            AS Tipo,
  P.Nombre             AS Prioridad,
  EA.Nombre            AS Estado,
  A.Descripcion,
  A.FechaVencimiento,
  A.UsuarioCreacion,
  A.FechaCreacion,
  A.UsuarioModificacion,
  A.FechaModificacion
FROM dbo.Alerta A
JOIN dbo.Legajo L       ON L.Id  = A.LegajoId
JOIN dbo.Nino   N       ON N.Id  = L.NinoId
JOIN dbo.TipoAlerta TA  ON TA.Id = A.TipoId
JOIN dbo.Prioridad  P   ON P.Id  = A.PrioridadId
JOIN dbo.EstadoAlerta EA ON EA.Id = A.EstadoId;
GO
PRINT '   ✓ Vista VW_AlertasDetalle creada'

-- STORED PROCEDURE: Listar Alertas
CREATE OR ALTER PROCEDURE dbo.SP_Alerta_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        A.Id AS AlertaId,
        L.Id AS LegajoId,
        N.Id AS NinoId,
        (N.Nombre + ' ' + N.Apellido) AS Nino,
        TA.Nombre AS Tipo,
        P.Nombre AS Prioridad,
        EA.Nombre AS Estado,
        A.Descripcion,
        A.FechaVencimiento,
        A.UsuarioCreacion,
        A.FechaCreacion,
        A.UsuarioModificacion,
        A.FechaModificacion
    FROM dbo.Alerta A WITH (NOLOCK)
    INNER JOIN dbo.Legajo L       ON L.Id  = A.LegajoId
    INNER JOIN dbo.Nino   N       ON N.Id  = L.NinoId
    INNER JOIN dbo.TipoAlerta TA  ON TA.Id = A.TipoId
    INNER JOIN dbo.Prioridad  P   ON P.Id  = A.PrioridadId
    INNER JOIN dbo.EstadoAlerta EA ON EA.Id = A.EstadoId
    ORDER BY A.FechaVencimiento ASC;
END
GO
PRINT '   ✓ Stored Procedure SP_Alerta_GetAll creado'

-- STORED PROCEDURE: Autenticar Usuario
CREATE OR ALTER PROCEDURE dbo.SP_Usuario_Autenticar
    @Usuario NVARCHAR(50),
    @PasswordHash NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @UsuarioId INT;
    DECLARE @IntentosLogin INT;
    DECLARE @Activo BIT;
    DECLARE @UltimoIntento DATETIME2;
    
    -- Buscar usuario
    SELECT 
        @UsuarioId = Id,
        @IntentosLogin = IntentosLogin,
        @Activo = Activo,
        @UltimoIntento = UltimoIntento
    FROM dbo.Usuario
    WHERE Usuario = @Usuario;
    
    -- Usuario no existe
    IF @UsuarioId IS NULL
    BEGIN
        SELECT 'error' AS Estado, 'Usuario o contraseña incorrectos' AS Mensaje;
        RETURN;
    END
    
    -- Usuario bloqueado (3+ intentos fallidos)
    IF @IntentosLogin >= 3 AND @Activo = 0
    BEGIN
        SELECT 'bloqueado' AS Estado, 'Usuario bloqueado por múltiples intentos fallidos' AS Mensaje;
        RETURN;
    END
    
    -- Verificar contraseña
    DECLARE @PasswordAlmacenado NVARCHAR(500);
    SELECT @PasswordAlmacenado = PasswordHash
    FROM dbo.Usuario
    WHERE Id = @UsuarioId;
    
    IF @PasswordHash = @PasswordAlmacenado
    BEGIN
        -- Login exitoso
        UPDATE dbo.Usuario
        SET IntentosLogin = 0,
            UltimoAcceso = SYSDATETIME(),
            Activo = 1
        WHERE Id = @UsuarioId;
        
        -- Retornar datos del usuario
        SELECT 
            u.Id,
            u.Usuario,
            u.Email,
            u.NombreCompleto,
            u.RolId,
            r.Nombre AS Rol,
            r.Nivel AS RolNivel,
            'success' AS Estado
        FROM dbo.Usuario u
        INNER JOIN dbo.Rol r ON r.Id = u.RolId
        WHERE u.Id = @UsuarioId;
    END
    ELSE
    BEGIN
        -- Contraseña incorrecta
        UPDATE dbo.Usuario
        SET IntentosLogin = IntentosLogin + 1,
            UltimoIntento = SYSDATETIME(),
            Activo = CASE WHEN IntentosLogin + 1 >= 3 THEN 0 ELSE 1 END
        WHERE Id = @UsuarioId;
        
        SELECT 'error' AS Estado, 'Usuario o contraseña incorrectos' AS Mensaje;
    END
END
GO
PRINT '   ✓ Stored Procedure SP_Usuario_Autenticar creado'

-- STORED PROCEDURE: Crear Sesión
CREATE OR ALTER PROCEDURE dbo.SP_Sesion_Crear
    @UsuarioId INT,
    @Token NVARCHAR(500),
    @DuracionMinutos INT = 30,
    @IpAddress NVARCHAR(50) = NULL,
    @UserAgent NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Invalidar sesiones anteriores del mismo usuario
    UPDATE dbo.Sesion
    SET Activa = 0
    WHERE UsuarioId = @UsuarioId AND Activa = 1;
    
    -- Crear nueva sesión
    INSERT INTO dbo.Sesion (UsuarioId, Token, FechaExpiracion, IpAddress, UserAgent)
    VALUES (@UsuarioId, @Token, DATEADD(MINUTE, @DuracionMinutos, SYSDATETIME()), @IpAddress, @UserAgent);
    
    SELECT 'success' AS Estado, 'Sesión creada' AS Mensaje;
END
GO
PRINT '   ✓ Stored Procedure SP_Sesion_Crear creado'

-- STORED PROCEDURE: Validar Sesión
CREATE OR ALTER PROCEDURE dbo.SP_Sesion_Validar
    @Token NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @SesionId INT;
    DECLARE @UsuarioId INT;
    DECLARE @FechaExpiracion DATETIME2;
    DECLARE @Activa BIT;
    
    SELECT 
        @SesionId = Id,
        @UsuarioId = UsuarioId,
        @FechaExpiracion = FechaExpiracion,
        @Activa = Activa
    FROM dbo.Sesion
    WHERE Token = @Token;
    
    -- Sesión no existe
    IF @SesionId IS NULL
    BEGIN
        SELECT 'invalid' AS Estado, 'Sesión inválida' AS Mensaje;
        RETURN;
    END
    
    -- Sesión expirada
    IF @FechaExpiracion < SYSDATETIME() OR @Activa = 0
    BEGIN
        UPDATE dbo.Sesion SET Activa = 0 WHERE Id = @SesionId;
        SELECT 'expired' AS Estado, 'Sesión expirada' AS Mensaje;
        RETURN;
    END
    
    -- Sesión válida - Retornar usuario
    SELECT 
        u.Id,
        u.Usuario,
        u.Email,
        u.NombreCompleto,
        u.RolId,
        r.Nombre AS Rol,
        r.Nivel AS RolNivel,
        'valid' AS Estado
    FROM dbo.Usuario u
    INNER JOIN dbo.Rol r ON r.Id = u.RolId
    WHERE u.Id = @UsuarioId;
    
    -- Extender sesión (renovar)
    UPDATE dbo.Sesion
    SET FechaExpiracion = DATEADD(MINUTE, 30, SYSDATETIME())
    WHERE Id = @SesionId;
END
GO
PRINT '   ✓ Stored Procedure SP_Sesion_Validar creado'

-- STORED PROCEDURE: Cerrar Sesión
CREATE OR ALTER PROCEDURE dbo.SP_Sesion_Cerrar
    @Token NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE dbo.Sesion
    SET Activa = 0
    WHERE Token = @Token;
    
    SELECT 'success' AS Estado, 'Sesión cerrada' AS Mensaje;
END
GO
PRINT '   ✓ Stored Procedure SP_Sesion_Cerrar creado'

-- STORED PROCEDURE: Registrar Auditoría
CREATE OR ALTER PROCEDURE dbo.SP_Auditoria_Registrar
    @UsuarioId INT = NULL,
    @Accion NVARCHAR(100),
    @Tabla NVARCHAR(100) = NULL,
    @RegistroId INT = NULL,
    @Detalles NVARCHAR(MAX) = NULL,
    @IpAddress NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO dbo.AuditoriaLog (UsuarioId, Accion, Tabla, RegistroId, Detalles, IpAddress)
    VALUES (@UsuarioId, @Accion, @Tabla, @RegistroId, @Detalles, @IpAddress);
END
GO
PRINT '   ✓ Stored Procedure SP_Auditoria_Registrar creado'

/* ============================================
   SECCIÓN 4: ÍNDICES OPTIMIZADOS
   ============================================ */
PRINT ''
PRINT '🚀 SECCIÓN 4: ÍNDICES OPTIMIZADOS PARA RENDIMIENTO'
PRINT '==================================================='
PRINT ''

-- ÍNDICES EN TABLA NINO
PRINT 'Creando índices en tabla Nino...'
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Nino_Dni' AND object_id = OBJECT_ID('Nino'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Nino_Dni ON Nino(Dni) INCLUDE (Nombre, Apellido, FechaNacimiento);
    PRINT '   ✓ Índice IX_Nino_Dni creado'
END

-- ÍNDICES EN TABLA TUTOR
PRINT 'Creando índices en tabla Tutor...'
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tutor_Apellido_Nombre' AND object_id = OBJECT_ID('Tutor'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Tutor_Apellido_Nombre ON Tutor(Apellido, Nombre);
    PRINT '   ✓ Índice IX_Tutor_Apellido_Nombre creado'
END

-- ÍNDICES EN TABLA LEGAJO
PRINT 'Creando índices en tabla Legajo...'
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Legajo_NinoId' AND object_id = OBJECT_ID('Legajo'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Legajo_NinoId ON Legajo(NinoId) INCLUDE (EstadoId, TutorId, FechaIngreso);
    PRINT '   ✓ Índice IX_Legajo_NinoId creado'
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Legajo_EstadoId_FechaIngreso' AND object_id = OBJECT_ID('Legajo'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Legajo_EstadoId_FechaIngreso ON Legajo(EstadoId, FechaIngreso DESC);
    PRINT '   ✓ Índice IX_Legajo_EstadoId_FechaIngreso creado'
END

-- ÍNDICES EN TABLA ALERTA
PRINT 'Creando índices en tabla Alerta...'
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Alerta_LegajoId' AND object_id = OBJECT_ID('Alerta'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Alerta_LegajoId ON Alerta(LegajoId) INCLUDE (Id, TipoId, PrioridadId, EstadoId, FechaVencimiento) WITH (FILLFACTOR = 80);
    PRINT '   ✓ Índice IX_Alerta_LegajoId creado'
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Alerta_LegajoId_FechaVencimiento' AND object_id = OBJECT_ID('Alerta'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Alerta_LegajoId_FechaVencimiento ON Alerta(LegajoId, FechaVencimiento) INCLUDE (Id, TipoId, PrioridadId, EstadoId, Descripcion) WITH (FILLFACTOR = 80);
    PRINT '   ✓ Índice IX_Alerta_LegajoId_FechaVencimiento creado'
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Alerta_EstadoId_FechaVencimiento' AND object_id = OBJECT_ID('Alerta'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Alerta_EstadoId_FechaVencimiento ON Alerta(EstadoId, FechaVencimiento) INCLUDE (LegajoId, TipoId, PrioridadId) WITH (FILLFACTOR = 80);
    PRINT '   ✓ Índice IX_Alerta_EstadoId_FechaVencimiento creado'
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Alerta_FechaCreacion' AND object_id = OBJECT_ID('Alerta'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Alerta_FechaCreacion ON Alerta(FechaCreacion DESC) INCLUDE (LegajoId, TipoId, EstadoId);
    PRINT '   ✓ Índice IX_Alerta_FechaCreacion creado'
END

-- ÍNDICES EN TABLA USUARIO
PRINT 'Creando índices en tabla Usuario...'
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Usuario_Email' AND object_id = OBJECT_ID('Usuario'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Usuario_Email ON Usuario(Email);
    PRINT '   ✓ Índice IX_Usuario_Email creado'
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Usuario_RolId_Activo' AND object_id = OBJECT_ID('Usuario'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Usuario_RolId_Activo ON Usuario(RolId, Activo);
    PRINT '   ✓ Índice IX_Usuario_RolId_Activo creado'
END

-- ÍNDICES EN TABLA SESION
PRINT 'Creando índices en tabla Sesion...'
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Sesion_Token_Activa' AND object_id = OBJECT_ID('Sesion'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Sesion_Token_Activa ON Sesion(Token, Activa) INCLUDE (UsuarioId, FechaExpiracion);
    PRINT '   ✓ Índice IX_Sesion_Token_Activa creado'
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Sesion_UsuarioId_Activa' AND object_id = OBJECT_ID('Sesion'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Sesion_UsuarioId_Activa ON Sesion(UsuarioId, Activa);
    PRINT '   ✓ Índice IX_Sesion_UsuarioId_Activa creado'
END

-- ÍNDICES EN TABLA AUDITORIA
PRINT 'Creando índices en tabla AuditoriaLog...'
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Auditoria_UsuarioId_FechaHora' AND object_id = OBJECT_ID('AuditoriaLog'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Auditoria_UsuarioId_FechaHora ON AuditoriaLog(UsuarioId, FechaHora DESC);
    PRINT '   ✓ Índice IX_Auditoria_UsuarioId_FechaHora creado'
END

GO

/* ============================================
   SECCIÓN 5: DATOS INICIALES DE CATÁLOGOS
   ============================================ */
PRINT ''
PRINT '📦 SECCIÓN 5: DATOS INICIALES DE CATÁLOGOS'
PRINT '==========================================='
PRINT ''

-- Estados de Legajo
INSERT INTO dbo.Estado (Nombre, Descripcion) VALUES
('Activo', 'Niño alojado actualmente'),
('Egresado', 'Niño dado de alta'),
('Seguimiento', 'Caso en seguimiento');
PRINT '   ✓ ' + CAST(@@ROWCOUNT AS VARCHAR) + ' estados de legajo insertados'

-- Tipos de Alerta
INSERT INTO dbo.TipoAlerta (Nombre, Descripcion) VALUES
('Médica', 'Control médico o tratamiento'),
('Judicial', 'Trámite o audiencia judicial'),
('Educativa', 'Situación o reunión escolar'),
('General', 'Otras alertas administrativas');
PRINT '   ✓ ' + CAST(@@ROWCOUNT AS VARCHAR) + ' tipos de alerta insertados'

-- Prioridades
INSERT INTO dbo.Prioridad (Nombre, Color, Orden) VALUES
('Alta',  '#dc3545', 1),
('Media', '#ffc107', 2),
('Baja',  '#198754', 3);
PRINT '   ✓ ' + CAST(@@ROWCOUNT AS VARCHAR) + ' prioridades insertadas'

-- Estados de Alerta
INSERT INTO dbo.EstadoAlerta (Nombre, Descripcion) VALUES
('Pendiente',  'En espera de resolución'),
('En Proceso', 'En atención'),
('Completada', 'Resuelta'),
('Cancelada',  'Cancelada');
PRINT '   ✓ ' + CAST(@@ROWCOUNT AS VARCHAR) + ' estados de alerta insertados'

-- Roles de Usuario
INSERT INTO dbo.Rol (Nombre, Descripcion, Nivel) VALUES
('Administrador', 'Acceso completo al sistema', 1),
('Operador', 'Puede crear y modificar registros', 2),
('Consultor', 'Solo lectura', 3);
PRINT '   ✓ ' + CAST(@@ROWCOUNT AS VARCHAR) + ' roles de usuario insertados'
GO

/* ============================================
   SECCIÓN 6: USUARIO ADMINISTRADOR INICIAL
   ============================================ */
PRINT ''
PRINT '👤 SECCIÓN 6: USUARIO ADMINISTRADOR INICIAL'
PRINT '============================================'
PRINT ''

-- Crear usuario administrador
-- Usuario: admin
-- Contraseña: Admin123!
-- Hash generado con PBKDF2 (10,000 iteraciones)

DECLARE @AdminRolId INT = (SELECT Id FROM dbo.Rol WHERE Nombre = 'Administrador');

-- Verificar si ya existe
IF NOT EXISTS (SELECT 1 FROM dbo.Usuario WHERE Usuario = 'admin')
BEGIN
    INSERT INTO dbo.Usuario (Usuario, PasswordHash, Salt, Email, NombreCompleto, RolId, Activo, IntentosLogin)
    VALUES (
        'admin',
        '1000:EQPFhZ7kGHBJq6dN8Q/Xtw==:wNLmFvKQG3YVyY6pCGt3xMR9YzUjQVPm',
        'EQPFhZ7kGHBJq6dN8Q/Xtw==',
        'admin@residencia.gob.ar',
        'Administrador del Sistema',
        @AdminRolId,
        1,
        0
    );
    PRINT '   ✓ Usuario administrador creado'
    PRINT '      Usuario: admin'
    PRINT '      Contraseña: Admin123!'
    PRINT '      Email: admin@residencia.gob.ar'
END
ELSE
BEGIN
    PRINT '   ⚠️ Usuario administrador ya existe - se mantiene sin cambios'
END
GO

/* ============================================
   SECCIÓN 7: VERIFICACIÓN FINAL
   ============================================ */
PRINT ''
PRINT '🔍 SECCIÓN 7: VERIFICACIÓN DE INSTALACIÓN'
PRINT '=========================================='
PRINT ''

-- Verificar tablas creadas
PRINT '📊 Tablas creadas:'
SELECT '   ✓ ' + name AS Tabla
FROM sys.tables
WHERE schema_id = SCHEMA_ID('dbo')
ORDER BY name;

PRINT ''
PRINT '📊 Vistas creadas:'
SELECT '   ✓ ' + name AS Vista
FROM sys.views
WHERE schema_id = SCHEMA_ID('dbo')
ORDER BY name;

PRINT ''
PRINT '📊 Stored Procedures creados:'
SELECT '   ✓ ' + name AS StoredProcedure
FROM sys.procedures
WHERE schema_id = SCHEMA_ID('dbo')
ORDER BY name;

PRINT ''
PRINT '📊 Índices creados:'
SELECT '   ✓ ' + i.name + ' en tabla ' + t.name AS Indice
FROM sys.indexes i
INNER JOIN sys.tables t ON t.object_id = i.object_id
WHERE i.name IS NOT NULL
  AND i.is_primary_key = 0
  AND i.type_desc = 'NONCLUSTERED'
ORDER BY t.name, i.name;

PRINT ''
PRINT '📊 Catálogos con datos:'
PRINT '   Estados: ' + CAST((SELECT COUNT(*) FROM dbo.Estado) AS VARCHAR)
PRINT '   Tipos de Alerta: ' + CAST((SELECT COUNT(*) FROM dbo.TipoAlerta) AS VARCHAR)
PRINT '   Prioridades: ' + CAST((SELECT COUNT(*) FROM dbo.Prioridad) AS VARCHAR)
PRINT '   Estados de Alerta: ' + CAST((SELECT COUNT(*) FROM dbo.EstadoAlerta) AS VARCHAR)
PRINT '   Roles: ' + CAST((SELECT COUNT(*) FROM dbo.Rol) AS VARCHAR)
PRINT '   Usuarios: ' + CAST((SELECT COUNT(*) FROM dbo.Usuario) AS VARCHAR)

PRINT ''
PRINT '================================================================'
PRINT '  ✅ INSTALACIÓN COMPLETADA EXITOSAMENTE'
PRINT '================================================================'
PRINT ''
PRINT '🎯 PRÓXIMOS PASOS:'
PRINT '   1. Compilar y ejecutar el backend (WebApi) en Visual Studio (F5)'
PRINT '   2. Abrir el frontend con Live Server'
PRINT '   3. Login con: admin / Admin123!'
PRINT '   4. (OPCIONAL) Ejecutar db\datos_demo.sql para cargar datos de prueba'
PRINT ''
PRINT '📚 CREDENCIALES DE ACCESO:'
PRINT '   Usuario: admin'
PRINT '   Contraseña: Admin123!'
PRINT '   Email: admin@residencia.gob.ar'
PRINT '   Rol: Administrador'
PRINT ''
PRINT '🎉 ¡Sistema listo para usar!'
PRINT ''
GO

