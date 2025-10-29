/* ================================================================
   INSTALACIÓN COMPLETA CON DATOS DE DEMOSTRACIÓN
   Sistema de Gestión de Residencias para NNA
   ================================================================
   
   Este script crea e inicializa TODO el sistema listo para usar:
   
   ✅ Base de datos completa
   ✅ Todas las tablas (Niño, Tutor, Legajo, Alerta, Usuario, etc.)
   ✅ Vistas optimizadas
   ✅ Stored Procedures
   ✅ Índices para rendimiento
   ✅ Catálogos con datos iniciales
   ✅ Usuario administrador (admin / Admin123!)
   ✅ Datos de demostración (5 tutores, 10 niños, 10 legajos, 20 alertas)
   
   EJECUTAR ESTE SCRIPT UNA SOLA VEZ
   
   Fecha: Octubre 2025
   Versión: 1.0
   ================================================================ */

USE master;
GO

-- Configurar para mostrar mensajes informativos
SET NOCOUNT OFF;
GO

PRINT ''
PRINT '================================================================'
PRINT '  🚀 INSTALACIÓN COMPLETA - SISTEMA RESIDENCIAS NNA'
PRINT '================================================================'
PRINT ''
PRINT '📅 Fecha de ejecución: ' + CONVERT(VARCHAR, GETDATE(), 120)
PRINT ''
PRINT '⏱️ Tiempo estimado: 30-60 segundos'
PRINT ''

/*================================================================
  PASO 1: RECREAR BASE DE DATOS
  ================================================================*/
PRINT ''
PRINT '───────────────────────────────────────────────────────────────'
PRINT '  PASO 1/7: CREANDO BASE DE DATOS'
PRINT '───────────────────────────────────────────────────────────────'
PRINT ''

IF DB_ID('ResidenciaDB') IS NOT NULL
BEGIN
    PRINT '🗑️ Eliminando base de datos existente...'
    ALTER DATABASE ResidenciaDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ResidenciaDB;
    PRINT '   ✓ Base de datos anterior eliminada'
END

PRINT '🆕 Creando nueva base de datos...'
CREATE DATABASE ResidenciaDB;
PRINT '   ✓ ResidenciaDB creada exitosamente'
PRINT ''
GO

USE ResidenciaDB;
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

/*================================================================
  PASO 2: CREAR TABLAS PRINCIPALES
  ================================================================*/
PRINT ''
PRINT '───────────────────────────────────────────────────────────────'
PRINT '  PASO 2/7: CREANDO TABLAS PRINCIPALES'
PRINT '───────────────────────────────────────────────────────────────'
PRINT ''

-- Tabla Nino
CREATE TABLE dbo.Nino (
  Id                INT IDENTITY(1,1) PRIMARY KEY,
  Dni               VARCHAR(20) NOT NULL,
  Apellido          NVARCHAR(100) NOT NULL,
  Nombre            NVARCHAR(100) NOT NULL,
  FechaNacimiento   DATE NOT NULL,
  FechaCreacion     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
  FechaModificacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
  UsuarioCreacion   NVARCHAR(100) NULL,
  UsuarioModificacion NVARCHAR(100) NULL,
  CONSTRAINT UQ_Nino_Dni UNIQUE (Dni)
);
PRINT '   ✅ Tabla Nino'

-- Tabla Tutor
CREATE TABLE dbo.Tutor (
  Id                INT IDENTITY(1,1) PRIMARY KEY,
  Nombre            NVARCHAR(100) NOT NULL,
  Apellido          NVARCHAR(100) NULL,
  Telefono          NVARCHAR(50) NULL,
  Email             NVARCHAR(100) NULL,
  FechaCreacion     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
  FechaModificacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
  UsuarioCreacion   NVARCHAR(100) NULL,
  UsuarioModificacion NVARCHAR(100) NULL
);
PRINT '   ✅ Tabla Tutor'

-- Tabla Estado
CREATE TABLE dbo.Estado (
  Id          INT IDENTITY(1,1) PRIMARY KEY,
  Nombre      NVARCHAR(50) NOT NULL,
  Descripcion NVARCHAR(200) NULL
);
PRINT '   ✅ Tabla Estado'

-- Tabla TipoAlerta
CREATE TABLE dbo.TipoAlerta (
  Id          INT IDENTITY(1,1) PRIMARY KEY,
  Nombre      NVARCHAR(50) NOT NULL,
  Descripcion NVARCHAR(100) NULL
);
PRINT '   ✅ Tabla TipoAlerta'

-- Tabla Prioridad
CREATE TABLE dbo.Prioridad (
  Id     INT IDENTITY(1,1) PRIMARY KEY,
  Nombre NVARCHAR(50) NOT NULL,
  Color  VARCHAR(7) NULL,
  Orden  INT NULL
);
PRINT '   ✅ Tabla Prioridad'

-- Tabla EstadoAlerta
CREATE TABLE dbo.EstadoAlerta (
  Id          INT IDENTITY(1,1) PRIMARY KEY,
  Nombre      NVARCHAR(50) NOT NULL,
  Descripcion NVARCHAR(100) NULL
);
PRINT '   ✅ Tabla EstadoAlerta'

-- Tabla Legajo
CREATE TABLE dbo.Legajo (
  Id                INT IDENTITY(1,1) PRIMARY KEY,
  NinoId            INT NOT NULL,
  TutorId           INT NULL,
  EstadoId          INT NOT NULL,
  FechaIngreso      DATE NOT NULL,
  FechaEgreso       DATE NULL,
  Observaciones     NVARCHAR(500) NULL,
  FechaCreacion     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
  FechaModificacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
  UsuarioCreacion   NVARCHAR(100) NULL,
  UsuarioModificacion NVARCHAR(100) NULL,
  CONSTRAINT FK_Legajo_Nino   FOREIGN KEY (NinoId) REFERENCES dbo.Nino(Id),
  CONSTRAINT FK_Legajo_Tutor  FOREIGN KEY (TutorId) REFERENCES dbo.Tutor(Id),
  CONSTRAINT FK_Legajo_Estado FOREIGN KEY (EstadoId) REFERENCES dbo.Estado(Id)
);
PRINT '   ✅ Tabla Legajo'

-- Tabla Alerta
CREATE TABLE dbo.Alerta (
  Id                INT IDENTITY(1,1) PRIMARY KEY,
  TipoId            INT NOT NULL,
  PrioridadId       INT NOT NULL,
  EstadoId          INT NOT NULL,
  LegajoId          INT NOT NULL,
  Descripcion       NVARCHAR(500) NOT NULL,
  FechaVencimiento  DATETIME2 NOT NULL,
  FechaCreacion     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
  FechaModificacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
  UsuarioCreacion   NVARCHAR(100) NULL,
  UsuarioModificacion NVARCHAR(100) NULL,
  CONSTRAINT FK_Alerta_Tipo       FOREIGN KEY (TipoId) REFERENCES dbo.TipoAlerta(Id),
  CONSTRAINT FK_Alerta_Prioridad  FOREIGN KEY (PrioridadId) REFERENCES dbo.Prioridad(Id),
  CONSTRAINT FK_Alerta_Estado     FOREIGN KEY (EstadoId) REFERENCES dbo.EstadoAlerta(Id),
  CONSTRAINT FK_Alerta_Legajo     FOREIGN KEY (LegajoId) REFERENCES dbo.Legajo(Id)
);
PRINT '   ✅ Tabla Alerta'

-- Tablas de Autenticación
CREATE TABLE dbo.Rol (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL UNIQUE,
    Descripcion NVARCHAR(200) NULL,
    Nivel INT NOT NULL DEFAULT 3,
    FechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
PRINT '   ✅ Tabla Rol'

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
PRINT '   ✅ Tabla Usuario'

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
PRINT '   ✅ Tabla Sesion'

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
PRINT '   ✅ Tabla AuditoriaLog'
PRINT ''
GO

/*================================================================
  PASO 3: CREAR VISTAS Y STORED PROCEDURES
  ================================================================*/
PRINT ''
PRINT '───────────────────────────────────────────────────────────────'
PRINT '  PASO 3/7: CREANDO VISTAS Y STORED PROCEDURES'
PRINT '───────────────────────────────────────────────────────────────'
PRINT ''

-- Vista de Legajos con Detalle
CREATE OR ALTER VIEW dbo.VW_LegajoDetalle AS
SELECT
  L.Id AS LegajoId,
  N.Id AS NinoId,
  N.Dni,
  N.Apellido AS NinoApellido,
  N.Nombre AS NinoNombre,
  E.Id AS EstadoId,
  E.Nombre AS Estado,
  T.Id AS TutorId,
  T.Nombre + ' ' + ISNULL(T.Apellido, '') AS Tutor,
  L.FechaIngreso,
  L.FechaEgreso,
  L.Observaciones,
  L.UsuarioCreacion,
  L.FechaCreacion,
  L.UsuarioModificacion,
  L.FechaModificacion
FROM dbo.Legajo L
JOIN dbo.Nino N ON N.Id = L.NinoId
JOIN dbo.Estado E ON E.Id = L.EstadoId
LEFT JOIN dbo.Tutor T ON T.Id = L.TutorId;
GO
PRINT '   ✅ Vista VW_LegajoDetalle'

-- Vista de Alertas con Detalle
CREATE OR ALTER VIEW dbo.VW_AlertasDetalle AS
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
FROM dbo.Alerta A
JOIN dbo.Legajo L ON L.Id = A.LegajoId
JOIN dbo.Nino N ON N.Id = L.NinoId
JOIN dbo.TipoAlerta TA ON TA.Id = A.TipoId
JOIN dbo.Prioridad P ON P.Id = A.PrioridadId
JOIN dbo.EstadoAlerta EA ON EA.Id = A.EstadoId;
GO
PRINT '   ✅ Vista VW_AlertasDetalle'

-- SP: Listar Alertas (Optimizado)
CREATE OR ALTER PROCEDURE dbo.SP_Alerta_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM dbo.VW_AlertasDetalle WITH (NOLOCK)
    ORDER BY FechaVencimiento ASC;
END
GO
PRINT '   ✅ SP_Alerta_GetAll'

-- SP: Autenticar Usuario
CREATE OR ALTER PROCEDURE dbo.SP_Usuario_Autenticar
    @Usuario NVARCHAR(50),
    @PasswordHash NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @UsuarioId INT, @IntentosLogin INT, @Activo BIT;
    
    SELECT @UsuarioId = Id, @IntentosLogin = IntentosLogin, @Activo = Activo
    FROM dbo.Usuario WHERE Usuario = @Usuario;
    
    IF @UsuarioId IS NULL
    BEGIN
        SELECT 'error' AS Estado, 'Usuario o contraseña incorrectos' AS Mensaje;
        RETURN;
    END
    
    IF @IntentosLogin >= 3 AND @Activo = 0
    BEGIN
        SELECT 'bloqueado' AS Estado, 'Usuario bloqueado' AS Mensaje;
        RETURN;
    END
    
    DECLARE @PasswordAlmacenado NVARCHAR(500);
    SELECT @PasswordAlmacenado = PasswordHash FROM dbo.Usuario WHERE Id = @UsuarioId;
    
    IF @PasswordHash = @PasswordAlmacenado
    BEGIN
        UPDATE dbo.Usuario SET IntentosLogin = 0, UltimoAcceso = SYSDATETIME(), Activo = 1 WHERE Id = @UsuarioId;
        SELECT u.Id, u.Usuario, u.Email, u.NombreCompleto, u.RolId, r.Nombre AS Rol, r.Nivel AS RolNivel, 'success' AS Estado
        FROM dbo.Usuario u INNER JOIN dbo.Rol r ON r.Id = u.RolId WHERE u.Id = @UsuarioId;
    END
    ELSE
    BEGIN
        UPDATE dbo.Usuario SET IntentosLogin = IntentosLogin + 1, UltimoIntento = SYSDATETIME(),
               Activo = CASE WHEN IntentosLogin + 1 >= 3 THEN 0 ELSE 1 END
        WHERE Id = @UsuarioId;
        SELECT 'error' AS Estado, 'Usuario o contraseña incorrectos' AS Mensaje;
    END
END
GO
PRINT '   ✅ SP_Usuario_Autenticar'

-- SP: Crear Sesión
CREATE OR ALTER PROCEDURE dbo.SP_Sesion_Crear
    @UsuarioId INT, @Token NVARCHAR(500), @DuracionMinutos INT = 30, @IpAddress NVARCHAR(50) = NULL, @UserAgent NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.Sesion SET Activa = 0 WHERE UsuarioId = @UsuarioId AND Activa = 1;
    INSERT INTO dbo.Sesion (UsuarioId, Token, FechaExpiracion, IpAddress, UserAgent)
    VALUES (@UsuarioId, @Token, DATEADD(MINUTE, @DuracionMinutos, SYSDATETIME()), @IpAddress, @UserAgent);
    SELECT 'success' AS Estado;
END
GO
PRINT '   ✅ SP_Sesion_Crear'

-- SP: Validar Sesión
CREATE OR ALTER PROCEDURE dbo.SP_Sesion_Validar
    @Token NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @SesionId INT, @UsuarioId INT, @FechaExpiracion DATETIME2, @Activa BIT;
    
    SELECT @SesionId = Id, @UsuarioId = UsuarioId, @FechaExpiracion = FechaExpiracion, @Activa = Activa
    FROM dbo.Sesion WHERE Token = @Token;
    
    IF @SesionId IS NULL OR @FechaExpiracion < SYSDATETIME() OR @Activa = 0
    BEGIN
        IF @SesionId IS NOT NULL UPDATE dbo.Sesion SET Activa = 0 WHERE Id = @SesionId;
        SELECT 'invalid' AS Estado;
        RETURN;
    END
    
    SELECT u.Id, u.Usuario, u.Email, u.NombreCompleto, u.RolId, r.Nombre AS Rol, r.Nivel AS RolNivel, 'valid' AS Estado
    FROM dbo.Usuario u INNER JOIN dbo.Rol r ON r.Id = u.RolId WHERE u.Id = @UsuarioId;
    
    UPDATE dbo.Sesion SET FechaExpiracion = DATEADD(MINUTE, 30, SYSDATETIME()) WHERE Id = @SesionId;
END
GO
PRINT '   ✅ SP_Sesion_Validar'

-- SP: Cerrar Sesión
CREATE OR ALTER PROCEDURE dbo.SP_Sesion_Cerrar
    @Token NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.Sesion SET Activa = 0 WHERE Token = @Token;
    SELECT 'success' AS Estado;
END
GO
PRINT '   ✅ SP_Sesion_Cerrar'
PRINT ''
GO

/*================================================================
  PASO 4: CREAR ÍNDICES OPTIMIZADOS
  ================================================================*/
PRINT ''
PRINT '───────────────────────────────────────────────────────────────'
PRINT '  PASO 4/7: CREANDO ÍNDICES PARA RENDIMIENTO'
PRINT '───────────────────────────────────────────────────────────────'
PRINT ''

-- Índices básicos
CREATE INDEX IX_Legajo_Nino_Estado ON dbo.Legajo (NinoId, EstadoId);
CREATE INDEX IX_Alerta_Legajo_Venc ON dbo.Alerta (LegajoId, FechaVencimiento);
CREATE INDEX IX_Alerta_Estado ON dbo.Alerta (EstadoId);
PRINT '   ✅ Índices básicos creados'

-- Índices optimizados
CREATE NONCLUSTERED INDEX IX_Nino_Dni ON Nino(Dni) INCLUDE (Nombre, Apellido, FechaNacimiento);
CREATE NONCLUSTERED INDEX IX_Tutor_Apellido_Nombre ON Tutor(Apellido, Nombre);
CREATE NONCLUSTERED INDEX IX_Legajo_NinoId ON Legajo(NinoId) INCLUDE (EstadoId, TutorId, FechaIngreso);
CREATE NONCLUSTERED INDEX IX_Legajo_EstadoId_FechaIngreso ON Legajo(EstadoId, FechaIngreso DESC);
CREATE NONCLUSTERED INDEX IX_Alerta_LegajoId ON Alerta(LegajoId) INCLUDE (TipoId, PrioridadId, EstadoId, FechaVencimiento);
CREATE NONCLUSTERED INDEX IX_Alerta_EstadoId_FechaVencimiento ON Alerta(EstadoId, FechaVencimiento);
CREATE NONCLUSTERED INDEX IX_Usuario_Email ON Usuario(Email);
CREATE NONCLUSTERED INDEX IX_Sesion_Token_Activa ON Sesion(Token, Activa);
PRINT '   ✅ Índices optimizados creados'
PRINT ''
GO

/*================================================================
  PASO 5: INSERTAR DATOS INICIALES
  ================================================================*/
PRINT ''
PRINT '───────────────────────────────────────────────────────────────'
PRINT '  PASO 5/7: INSERTANDO DATOS INICIALES'
PRINT '───────────────────────────────────────────────────────────────'
PRINT ''

-- Catálogos
INSERT INTO dbo.Estado (Nombre, Descripcion) VALUES
('Activo', 'Niño alojado actualmente'),
('Egresado', 'Niño dado de alta'),
('Seguimiento', 'Caso en seguimiento');
PRINT '   ✅ 3 estados de legajo'

INSERT INTO dbo.TipoAlerta (Nombre, Descripcion) VALUES
('Médica', 'Control médico o tratamiento'),
('Judicial', 'Trámite o audiencia judicial'),
('Educativa', 'Situación o reunión escolar'),
('General', 'Otras alertas administrativas');
PRINT '   ✅ 4 tipos de alerta'

INSERT INTO dbo.Prioridad (Nombre, Color, Orden) VALUES
('Alta', '#dc3545', 1),
('Media', '#ffc107', 2),
('Baja', '#198754', 3);
PRINT '   ✅ 3 prioridades'

INSERT INTO dbo.EstadoAlerta (Nombre, Descripcion) VALUES
('Pendiente', 'En espera de resolución'),
('En Proceso', 'En atención'),
('Completada', 'Resuelta'),
('Cancelada', 'Cancelada');
PRINT '   ✅ 4 estados de alerta'

-- Roles
INSERT INTO dbo.Rol (Nombre, Descripcion, Nivel) VALUES
('Administrador', 'Acceso completo al sistema', 1),
('Operador', 'Puede crear y modificar registros', 2),
('Consultor', 'Solo lectura', 3);
PRINT '   ✅ 3 roles de usuario'

-- Usuario Administrador
DECLARE @AdminRolId INT = (SELECT Id FROM dbo.Rol WHERE Nombre = 'Administrador');
INSERT INTO dbo.Usuario (Usuario, PasswordHash, Salt, Email, NombreCompleto, RolId, Activo) VALUES
('admin', '1000:EQPFhZ7kGHBJq6dN8Q/Xtw==:wNLmFvKQG3YVyY6pCGt3xMR9YzUjQVPm', 'EQPFhZ7kGHBJq6dN8Q/Xtw==', 
 'admin@residencia.gob.ar', 'Administrador del Sistema', @AdminRolId, 1);
PRINT '   ✅ Usuario administrador creado'
PRINT ''
GO

/*================================================================
  PASO 6: INSERTAR DATOS DE DEMOSTRACIÓN
  ================================================================*/
PRINT ''
PRINT '───────────────────────────────────────────────────────────────'
PRINT '  PASO 6/7: INSERTANDO DATOS DE DEMOSTRACIÓN'
PRINT '───────────────────────────────────────────────────────────────'
PRINT ''

-- Tutores
INSERT INTO dbo.Tutor (Nombre, Apellido, Telefono, Email, UsuarioCreacion) VALUES
('María Soledad', 'González', '11-4555-1234', 'mgonzalez@residencia.gob.ar', 'admin'),
('Carlos Alberto', 'Rodríguez', '11-4555-5678', 'crodriguez@residencia.gob.ar', 'admin'),
('Ana Patricia', 'Fernández', '11-4555-9012', 'afernandez@residencia.gob.ar', 'admin'),
('Roberto Daniel', 'Martínez', '11-4555-3456', 'rmartinez@residencia.gob.ar', 'admin'),
('Laura Beatriz', 'López', '11-4555-7890', 'llopez@residencia.gob.ar', 'admin');
PRINT '   ✅ 5 tutores'

-- Niños
INSERT INTO dbo.Nino (Dni, Apellido, Nombre, FechaNacimiento, UsuarioCreacion) VALUES
('45123456', 'Pérez', 'Juancito', '2018-03-15', 'admin'),
('45234567', 'García', 'Sofía', '2017-07-22', 'admin'),
('45345678', 'Romero', 'Mateo', '2019-01-10', 'admin'),
('44123789', 'Díaz', 'Valentina', '2013-05-18', 'admin'),
('44234890', 'Morales', 'Thiago', '2014-09-30', 'admin'),
('44345901', 'Suárez', 'Catalina', '2012-11-25', 'admin'),
('43123012', 'Torres', 'Santiago', '2010-02-14', 'admin'),
('43234123', 'Ramírez', 'Martina', '2009-06-08', 'admin'),
('43345234', 'Flores', 'Nicolás', '2008-12-20', 'admin'),
('43456345', 'Castro', 'Lucía', '2007-04-03', 'admin');
PRINT '   ✅ 10 niños/adolescentes'

-- Legajos
DECLARE @EstadoActivo INT = (SELECT Id FROM dbo.Estado WHERE Nombre = 'Activo');
DECLARE @EstadoSeguimiento INT = (SELECT Id FROM dbo.Estado WHERE Nombre = 'Seguimiento');

INSERT INTO dbo.Legajo (NinoId, TutorId, EstadoId, FechaIngreso, Observaciones, UsuarioCreacion) VALUES
(1, 1, @EstadoActivo, '2023-01-15', 'Ingreso por situación familiar compleja. Requiere seguimiento psicológico.', 'admin'),
(2, 1, @EstadoActivo, '2023-03-20', 'Niña con buen comportamiento. Asiste regularmente a la escuela.', 'admin'),
(3, 2, @EstadoActivo, '2023-05-10', 'Requiere atención médica especializada. Control mensual programado.', 'admin'),
(4, 2, @EstadoActivo, '2023-02-28', 'Adolescente en proceso de revinculación familiar.', 'admin'),
(5, 3, @EstadoActivo, '2023-04-05', 'Buen desempeño académico. Participa en actividades deportivas.', 'admin'),
(6, 3, @EstadoSeguimiento, '2022-11-15', 'Proceso judicial en curso. Audiencias mensuales.', 'admin'),
(7, 4, @EstadoActivo, '2023-06-01', 'Adolescente mayor. Próximo a egreso. Preparación para vida independiente.', 'admin'),
(8, 4, @EstadoActivo, '2023-01-30', 'Excelente integración al grupo. Participación activa.', 'admin'),
(9, 5, @EstadoActivo, '2022-09-20', 'Seguimiento por situación escolar. Apoyo pedagógico.', 'admin'),
(10, 5, @EstadoSeguimiento, '2022-08-10', 'Proceso de reunificación familiar avanzado. Visitas semanales.', 'admin');
PRINT '   ✅ 10 legajos'

-- Alertas
DECLARE @TipoMedica INT = (SELECT Id FROM dbo.TipoAlerta WHERE Nombre = 'Médica');
DECLARE @TipoJudicial INT = (SELECT Id FROM dbo.TipoAlerta WHERE Nombre = 'Judicial');
DECLARE @TipoEducativa INT = (SELECT Id FROM dbo.TipoAlerta WHERE Nombre = 'Educativa');
DECLARE @TipoGeneral INT = (SELECT Id FROM dbo.TipoAlerta WHERE Nombre = 'General');
DECLARE @PrioridadAlta INT = (SELECT Id FROM dbo.Prioridad WHERE Nombre = 'Alta');
DECLARE @PrioridadMedia INT = (SELECT Id FROM dbo.Prioridad WHERE Nombre = 'Media');
DECLARE @PrioridadBaja INT = (SELECT Id FROM dbo.Prioridad WHERE Nombre = 'Baja');
DECLARE @EstadoPendiente INT = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente');
DECLARE @EstadoCompletada INT = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Completada');

-- Alertas vencidas
INSERT INTO dbo.Alerta (TipoId, PrioridadId, EstadoId, LegajoId, Descripcion, FechaVencimiento, UsuarioCreacion) VALUES
(@TipoMedica, @PrioridadAlta, @EstadoPendiente, 1, 'Control pediátrico trimestral - Vacunación pendiente contra HPV', DATEADD(DAY, -5, CAST(GETDATE() AS DATE)), 'admin'),
(@TipoJudicial, @PrioridadAlta, @EstadoPendiente, 6, 'Audiencia judicial con Defensoría de Menores - Presentar informe actualizado del caso', DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'admin'),
(@TipoEducativa, @PrioridadMedia, @EstadoPendiente, 9, 'Reunión con docente por bajo rendimiento académico - Coordinar apoyo escolar', DATEADD(DAY, -3, CAST(GETDATE() AS DATE)), 'admin');

-- Alertas que vencen hoy
INSERT INTO dbo.Alerta (TipoId, PrioridadId, EstadoId, LegajoId, Descripcion, FechaVencimiento, UsuarioCreacion) VALUES
(@TipoMedica, @PrioridadAlta, @EstadoPendiente, 3, '¡URGENTE! Toma de medicación programada - Control neurológico a las 10:00 hs', CAST(GETDATE() AS DATE), 'admin'),
(@TipoGeneral, @PrioridadAlta, @EstadoPendiente, 7, 'Renovación de DNI - Turno en Registro Civil 14:00 hs (llevar documentación)', CAST(GETDATE() AS DATE), 'admin');

-- Alertas próximas (1-3 días)
INSERT INTO dbo.Alerta (TipoId, PrioridadId, EstadoId, LegajoId, Descripcion, FechaVencimiento, UsuarioCreacion) VALUES
(@TipoJudicial, @PrioridadAlta, @EstadoPendiente, 4, 'Visita programada de familiar - Preparar espacio y supervisión', DATEADD(DAY, 1, GETDATE()), 'admin'),
(@TipoMedica, @PrioridadMedia, @EstadoPendiente, 5, 'Control odontológico semestral - Hospital Garrahan turno confirmado', DATEADD(DAY, 2, GETDATE()), 'admin'),
(@TipoEducativa, @PrioridadMedia, @EstadoPendiente, 2, 'Acto escolar - Confirmar asistencia y preparar autorización', DATEADD(DAY, 3, GETDATE()), 'admin'),
(@TipoGeneral, @PrioridadBaja, @EstadoPendiente, 8, 'Cumpleaños - Organizar festejo con el grupo', DATEADD(DAY, 3, GETDATE()), 'admin');

-- Alertas futuras (4-7 días)
INSERT INTO dbo.Alerta (TipoId, PrioridadId, EstadoId, LegajoId, Descripcion, FechaVencimiento, UsuarioCreacion) VALUES
(@TipoJudicial, @PrioridadMedia, @EstadoPendiente, 10, 'Evaluación de revinculación familiar - Reunión con equipo técnico', DATEADD(DAY, 5, GETDATE()), 'admin'),
(@TipoEducativa, @PrioridadBaja, @EstadoPendiente, 1, 'Entrega de boletín escolar - Coordinar entrevista con docente', DATEADD(DAY, 6, GETDATE()), 'admin'),
(@TipoMedica, @PrioridadMedia, @EstadoPendiente, 9, 'Control oftalmológico anual - Renovación de anteojos recetados', DATEADD(DAY, 7, GETDATE()), 'admin');

-- Alertas más adelante (>1 semana)
INSERT INTO dbo.Alerta (TipoId, PrioridadId, EstadoId, LegajoId, Descripcion, FechaVencimiento, UsuarioCreacion) VALUES
(@TipoMedica, @PrioridadBaja, @EstadoPendiente, 6, 'Control pediátrico de rutina - Chequeo general de salud', DATEADD(DAY, 15, GETDATE()), 'admin'),
(@TipoGeneral, @PrioridadBaja, @EstadoPendiente, 4, 'Actualización de fotografía para expediente - Foto carnet reciente', DATEADD(DAY, 20, GETDATE()), 'admin'),
(@TipoEducativa, @PrioridadMedia, @EstadoPendiente, 7, 'Inscripción a taller de arte - Confirmar cupo disponible', DATEADD(DAY, 25, GETDATE()), 'admin');

-- Alertas completadas
INSERT INTO dbo.Alerta (TipoId, PrioridadId, EstadoId, LegajoId, Descripcion, FechaVencimiento, UsuarioCreacion) VALUES
(@TipoMedica, @PrioridadAlta, @EstadoCompletada, 2, 'Vacunación COVID-19 - Segunda dosis aplicada correctamente', DATEADD(DAY, -10, GETDATE()), 'admin'),
(@TipoJudicial, @PrioridadMedia, @EstadoCompletada, 8, 'Presentación de informe mensual al juzgado - Enviado dentro del plazo', DATEADD(DAY, -15, GETDATE()), 'admin'),
(@TipoEducativa, @PrioridadBaja, @EstadoCompletada, 5, 'Reunión de padres en escuela - Asistió tutor asignado', DATEADD(DAY, -7, GETDATE()), 'admin'),
(@TipoGeneral, @PrioridadMedia, @EstadoCompletada, 10, 'Compra de útiles escolares - Material entregado completo', DATEADD(DAY, -12, GETDATE()), 'admin'),
(@TipoMedica, @PrioridadBaja, @EstadoCompletada, 3, 'Análisis clínicos de rutina - Resultados dentro de parámetros normales', DATEADD(DAY, -20, GETDATE()), 'admin');
PRINT '   ✅ 20 alertas'
PRINT ''
GO

/*================================================================
  PASO 7: RESUMEN Y VERIFICACIÓN FINAL
  ================================================================*/
PRINT ''
PRINT '───────────────────────────────────────────────────────────────'
PRINT '  PASO 7/7: RESUMEN Y VERIFICACIÓN'
PRINT '───────────────────────────────────────────────────────────────'
PRINT ''

PRINT '📊 ESTADÍSTICAS DE LA BASE DE DATOS:'
PRINT ''
PRINT '   👥 Tutores:              ' + CAST((SELECT COUNT(*) FROM dbo.Tutor) AS VARCHAR)
PRINT '   👶 Niños/Adolescentes:   ' + CAST((SELECT COUNT(*) FROM dbo.Nino) AS VARCHAR)
PRINT '   📁 Legajos:              ' + CAST((SELECT COUNT(*) FROM dbo.Legajo) AS VARCHAR)
PRINT '   🔔 Alertas totales:      ' + CAST((SELECT COUNT(*) FROM dbo.Alerta) AS VARCHAR)
PRINT '   👤 Usuarios:             ' + CAST((SELECT COUNT(*) FROM dbo.Usuario) AS VARCHAR)
PRINT ''

DECLARE @Vencidas INT = (SELECT COUNT(*) FROM dbo.Alerta WHERE FechaVencimiento < CAST(GETDATE() AS DATE) AND EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente'));
DECLARE @Proximas INT = (SELECT COUNT(*) FROM dbo.Alerta WHERE FechaVencimiento BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(DAY, 3, GETDATE()) AND EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente'));
DECLARE @Completadas INT = (SELECT COUNT(*) FROM dbo.Alerta WHERE EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Completada'));

PRINT '   🔴 Alertas vencidas:     ' + CAST(@Vencidas AS VARCHAR)
PRINT '   🟡 Alertas próximas:     ' + CAST(@Proximas AS VARCHAR)
PRINT '   ✅ Alertas completadas:  ' + CAST(@Completadas AS VARCHAR)
PRINT ''

PRINT '================================================================'
PRINT '  ✅ INSTALACIÓN COMPLETADA EXITOSAMENTE'
PRINT '================================================================'
PRINT ''
PRINT '🎯 SISTEMA LISTO PARA USAR'
PRINT ''
PRINT '📚 CREDENCIALES DE ACCESO:'
PRINT '   Usuario: admin'
PRINT '   Contraseña: Admin123!'
PRINT '   Rol: Administrador'
PRINT ''
PRINT '🚀 PRÓXIMOS PASOS:'
PRINT '   1. Compilar y ejecutar el backend (WebApi) en Visual Studio (F5)'
PRINT '   2. Abrir el frontend con Live Server en VS Code'
PRINT '   3. Login en: http://localhost:5500/frontend/auth.html'
PRINT '   4. Navegar al Dashboard y verificar estadísticas'
PRINT ''
PRINT '📊 ESTADÍSTICAS ESPERADAS EN EL DASHBOARD:'
PRINT '   Total Legajos: 10'
PRINT '   Alertas Vencidas: ~3'
PRINT '   Alertas Próximas: ~4-6'
PRINT '   Alertas Completadas: 5'
PRINT ''
PRINT '🎉 ¡TODO LISTO PARA LA DEMOSTRACIÓN!'
PRINT ''
GO

