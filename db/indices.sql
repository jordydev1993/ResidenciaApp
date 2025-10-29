-- ========================================
-- SCRIPT DE ÍNDICES CRÍTICOS
-- Sistema de Gestión de Residencias
-- ========================================
-- 
-- Este script crea índices para optimizar las consultas más frecuentes
-- Ejecutar después de crear la base de datos con bd.sql
--
-- Fecha: Octubre 2025
-- Versión: 1.0
-- ========================================

USE ResidenciaDB;
GO

PRINT '======================================'
PRINT 'Creando índices críticos...'
PRINT '======================================'
PRINT ''

-- ========================================
-- TABLA: Nino
-- ========================================
PRINT 'Creando índices en tabla Nino...'

-- Índice único en DNI (búsqueda y validación de duplicados)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Nino_DNI' AND object_id = OBJECT_ID('Nino'))
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX IX_Nino_DNI
    ON Nino(DNI)
    INCLUDE (Id, Nombre, Apellido)
    WITH (FILLFACTOR = 90);
    PRINT '✓ Índice IX_Nino_DNI creado'
END
ELSE
    PRINT '- Índice IX_Nino_DNI ya existe'

-- Índice compuesto para búsquedas por nombre
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Nino_Apellido_Nombre' AND object_id = OBJECT_ID('Nino'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Nino_Apellido_Nombre
    ON Nino(Apellido, Nombre)
    INCLUDE (DNI, FechaNacimiento)
    WITH (FILLFACTOR = 90);
    PRINT '✓ Índice IX_Nino_Apellido_Nombre creado'
END
ELSE
    PRINT '- Índice IX_Nino_Apellido_Nombre ya existe'

-- Índice para auditoría
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Nino_FechaCreacion' AND object_id = OBJECT_ID('Nino'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Nino_FechaCreacion
    ON Nino(FechaCreacion DESC)
    INCLUDE (Id, DNI, Nombre, Apellido);
    PRINT '✓ Índice IX_Nino_FechaCreacion creado'
END
ELSE
    PRINT '- Índice IX_Nino_FechaCreacion ya existe'

PRINT ''

-- ========================================
-- TABLA: Legajo
-- ========================================
PRINT 'Creando índices en tabla Legajo...'

-- Índice en NinoId (FK muy utilizado)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Legajo_NinoId' AND object_id = OBJECT_ID('Legajo'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Legajo_NinoId
    ON Legajo(NinoId)
    INCLUDE (Id, EstadoId, FechaIngreso, TutorId)
    WITH (FILLFACTOR = 85);
    PRINT '✓ Índice IX_Legajo_NinoId creado'
END
ELSE
    PRINT '- Índice IX_Legajo_NinoId ya existe'

-- Índice en EstadoId (para filtros por estado)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Legajo_EstadoId' AND object_id = OBJECT_ID('Legajo'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Legajo_EstadoId
    ON Legajo(EstadoId)
    INCLUDE (Id, NinoId, FechaIngreso)
    WITH (FILLFACTOR = 90);
    PRINT '✓ Índice IX_Legajo_EstadoId creado'
END
ELSE
    PRINT '- Índice IX_Legajo_EstadoId ya existe'

-- Índice compuesto para queries del dashboard
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Legajo_EstadoId_FechaIngreso' AND object_id = OBJECT_ID('Legajo'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Legajo_EstadoId_FechaIngreso
    ON Legajo(EstadoId, FechaIngreso DESC)
    INCLUDE (NinoId, TutorId);
    PRINT '✓ Índice IX_Legajo_EstadoId_FechaIngreso creado'
END
ELSE
    PRINT '- Índice IX_Legajo_EstadoId_FechaIngreso ya existe'

PRINT ''

-- ========================================
-- TABLA: Alerta
-- ========================================
PRINT 'Creando índices en tabla Alerta...'

-- Índice en LegajoId (FK crítico)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Alerta_LegajoId' AND object_id = OBJECT_ID('Alerta'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Alerta_LegajoId
    ON Alerta(LegajoId)
    INCLUDE (Id, TipoId, PrioridadId, EstadoId, FechaVencimiento)
    WITH (FILLFACTOR = 80);
    PRINT '✓ Índice IX_Alerta_LegajoId creado'
END
ELSE
    PRINT '- Índice IX_Alerta_LegajoId ya existe'

-- Índice crítico: LegajoId + FechaVencimiento (alertas por vencer)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Alerta_LegajoId_FechaVencimiento' AND object_id = OBJECT_ID('Alerta'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Alerta_LegajoId_FechaVencimiento
    ON Alerta(LegajoId, FechaVencimiento)
    INCLUDE (Id, TipoId, PrioridadId, EstadoId, Descripcion)
    WITH (FILLFACTOR = 80);
    PRINT '✓ Índice IX_Alerta_LegajoId_FechaVencimiento creado'
END
ELSE
    PRINT '- Índice IX_Alerta_LegajoId_FechaVencimiento ya existe'

-- Índice para dashboard de alertas
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Alerta_EstadoId_FechaVencimiento' AND object_id = OBJECT_ID('Alerta'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Alerta_EstadoId_FechaVencimiento
    ON Alerta(EstadoId, FechaVencimiento)
    INCLUDE (LegajoId, TipoId, PrioridadId)
    WITH (FILLFACTOR = 80);
    PRINT '✓ Índice IX_Alerta_EstadoId_FechaVencimiento creado'
END
ELSE
    PRINT '- Índice IX_Alerta_EstadoId_FechaVencimiento ya existe'

-- Índice para auditoría
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Alerta_FechaCreacion' AND object_id = OBJECT_ID('Alerta'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Alerta_FechaCreacion
    ON Alerta(FechaCreacion DESC)
    INCLUDE (LegajoId, TipoId, EstadoId);
    PRINT '✓ Índice IX_Alerta_FechaCreacion creado'
END
ELSE
    PRINT '- Índice IX_Alerta_FechaCreacion ya existe'

PRINT ''

-- ========================================
-- TABLA: Tutor
-- ========================================
PRINT 'Creando índices en tabla Tutor...'

-- Índice en Apellido (búsquedas frecuentes)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tutor_Apellido_Nombre' AND object_id = OBJECT_ID('Tutor'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Tutor_Apellido_Nombre
    ON Tutor(Apellido, Nombre)
    INCLUDE (Id, Telefono, Email)
    WITH (FILLFACTOR = 95);
    PRINT '✓ Índice IX_Tutor_Apellido_Nombre creado'
END
ELSE
    PRINT '- Índice IX_Tutor_Apellido_Nombre ya existe'

PRINT ''

-- ========================================
-- TABLAS DE CATÁLOGO
-- ========================================
PRINT 'Creando índices en tablas de catálogo...'

-- Estado
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Estado_Nombre' AND object_id = OBJECT_ID('Estado'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Estado_Nombre
    ON Estado(Nombre)
    WITH (FILLFACTOR = 100);
    PRINT '✓ Índice IX_Estado_Nombre creado'
END
ELSE
    PRINT '- Índice IX_Estado_Nombre ya existe'

-- TipoAlerta
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TipoAlerta_Nombre' AND object_id = OBJECT_ID('TipoAlerta'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_TipoAlerta_Nombre
    ON TipoAlerta(Nombre)
    WITH (FILLFACTOR = 100);
    PRINT '✓ Índice IX_TipoAlerta_Nombre creado'
END
ELSE
    PRINT '- Índice IX_TipoAlerta_Nombre ya existe'

-- Prioridad
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Prioridad_Orden' AND object_id = OBJECT_ID('Prioridad'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Prioridad_Orden
    ON Prioridad(Orden)
    INCLUDE (Nombre, Color)
    WITH (FILLFACTOR = 100);
    PRINT '✓ Índice IX_Prioridad_Orden creado'
END
ELSE
    PRINT '- Índice IX_Prioridad_Orden ya existe'

PRINT ''

-- ========================================
-- ESTADÍSTICAS
-- ========================================
PRINT '======================================'
PRINT 'Actualizando estadísticas...'
PRINT '======================================'

UPDATE STATISTICS Nino WITH FULLSCAN;
PRINT '✓ Estadísticas de Nino actualizadas'

UPDATE STATISTICS Legajo WITH FULLSCAN;
PRINT '✓ Estadísticas de Legajo actualizadas'

UPDATE STATISTICS Alerta WITH FULLSCAN;
PRINT '✓ Estadísticas de Alerta actualizadas'

UPDATE STATISTICS Tutor WITH FULLSCAN;
PRINT '✓ Estadísticas de Tutor actualizadas'

PRINT ''
PRINT '======================================'
PRINT 'Script completado exitosamente!'
PRINT '======================================'
PRINT ''
PRINT 'Índices creados para optimización de queries'
PRINT 'Se recomienda monitorear el rendimiento y ajustar según sea necesario'
PRINT ''

GO

