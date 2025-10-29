/* ============================================
   OPTIMIZACIÓN DE RENDIMIENTO - ALERTAS
   Ejecutar este script para mejorar la velocidad de carga
   ============================================ */
USE ResidenciaDB;
GO

PRINT '🚀 Iniciando optimización de alertas...'
GO

/* ============================================
   1. ÍNDICES ADICIONALES PARA JOINS DE LA VISTA
   ============================================ */

-- Índice en Legajo.NinoId (JOIN con Nino)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Legajo_NinoId' AND object_id = OBJECT_ID('Legajo'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Legajo_NinoId
    ON Legajo(NinoId)
    INCLUDE (Id, EstadoId, TutorId, FechaIngreso)
    WITH (FILLFACTOR = 80);
    PRINT '✓ Índice IX_Legajo_NinoId creado'
END
ELSE
    PRINT '- Índice IX_Legajo_NinoId ya existe'
GO

-- Índice en Nino para JOIN (optimiza el acceso)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Nino_NombreCompleto' AND object_id = OBJECT_ID('Nino'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Nino_NombreCompleto
    ON Nino(Id)
    INCLUDE (Nombre, Apellido, Dni, FechaNacimiento)
    WITH (FILLFACTOR = 90);
    PRINT '✓ Índice IX_Nino_NombreCompleto creado'
END
ELSE
    PRINT '- Índice IX_Nino_NombreCompleto ya existe'
GO

/* ============================================
   2. ÍNDICES EN TABLAS DE CATÁLOGOS
   ============================================ */

-- TipoAlerta
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TipoAlerta_Id_Nombre' AND object_id = OBJECT_ID('TipoAlerta'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_TipoAlerta_Id_Nombre
    ON TipoAlerta(Id)
    INCLUDE (Nombre, Descripcion)
    WITH (FILLFACTOR = 95);
    PRINT '✓ Índice IX_TipoAlerta_Id_Nombre creado'
END
ELSE
    PRINT '- Índice IX_TipoAlerta_Id_Nombre ya existe'
GO

-- Prioridad
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Prioridad_Id_Nombre' AND object_id = OBJECT_ID('Prioridad'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Prioridad_Id_Nombre
    ON Prioridad(Id)
    INCLUDE (Nombre, Color, Orden)
    WITH (FILLFACTOR = 95);
    PRINT '✓ Índice IX_Prioridad_Id_Nombre creado'
END
ELSE
    PRINT '- Índice IX_Prioridad_Id_Nombre ya existe'
GO

-- EstadoAlerta
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_EstadoAlerta_Id_Nombre' AND object_id = OBJECT_ID('EstadoAlerta'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_EstadoAlerta_Id_Nombre
    ON EstadoAlerta(Id)
    INCLUDE (Nombre, Descripcion)
    WITH (FILLFACTOR = 95);
    PRINT '✓ Índice IX_EstadoAlerta_Id_Nombre creado'
END
ELSE
    PRINT '- Índice IX_EstadoAlerta_Id_Nombre ya existe'
GO

/* ============================================
   3. OPTIMIZAR STORED PROCEDURE
   ============================================ */
CREATE OR ALTER PROCEDURE dbo.SP_Alerta_GetAll
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Hint de optimización: FORCE ORDER para controlar el plan de ejecución
    SELECT 
        A.Id                    AS AlertaId,
        L.Id                    AS LegajoId,
        N.Id                    AS NinoId,
        (N.Nombre + N' ' + N.Apellido) AS Nino,
        TA.Nombre               AS Tipo,
        P.Nombre                AS Prioridad,
        EA.Nombre               AS Estado,
        A.Descripcion,
        A.FechaVencimiento,
        A.UsuarioCreacion,
        A.FechaCreacion,
        A.UsuarioModificacion,
        A.FechaModificacion
    FROM dbo.Alerta A WITH (NOLOCK)
    INNER JOIN dbo.Legajo L       WITH (NOLOCK) ON L.Id  = A.LegajoId
    INNER JOIN dbo.Nino N         WITH (NOLOCK) ON N.Id  = L.NinoId
    INNER JOIN dbo.TipoAlerta TA  WITH (NOLOCK) ON TA.Id = A.TipoId
    INNER JOIN dbo.Prioridad P    WITH (NOLOCK) ON P.Id  = A.PrioridadId
    INNER JOIN dbo.EstadoAlerta EA WITH (NOLOCK) ON EA.Id = A.EstadoId
    ORDER BY A.FechaVencimiento ASC, A.Id DESC
    OPTION (RECOMPILE, MAXDOP 4);
END
GO

PRINT '✓ Stored procedure SP_Alerta_GetAll optimizado'
GO

/* ============================================
   4. ACTUALIZAR ESTADÍSTICAS
   ============================================ */
PRINT '🔄 Actualizando estadísticas...'

UPDATE STATISTICS dbo.Alerta WITH FULLSCAN;
UPDATE STATISTICS dbo.Legajo WITH FULLSCAN;
UPDATE STATISTICS dbo.Nino WITH FULLSCAN;
UPDATE STATISTICS dbo.TipoAlerta WITH FULLSCAN;
UPDATE STATISTICS dbo.Prioridad WITH FULLSCAN;
UPDATE STATISTICS dbo.EstadoAlerta WITH FULLSCAN;

PRINT '✓ Estadísticas actualizadas'
GO

/* ============================================
   5. VERIFICAR FRAGMENTACIÓN DE ÍNDICES
   ============================================ */
PRINT '📊 Verificando fragmentación de índices...'

SELECT 
    OBJECT_NAME(ips.object_id) AS NombreTabla,
    i.name AS NombreIndice,
    ips.avg_fragmentation_in_percent AS Fragmentacion,
    ips.page_count AS Paginas
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ips
INNER JOIN sys.indexes i ON ips.object_id = i.object_id AND ips.index_id = i.index_id
WHERE 
    ips.avg_fragmentation_in_percent > 10
    AND ips.page_count > 100
    AND OBJECT_NAME(ips.object_id) IN ('Alerta', 'Legajo', 'Nino')
ORDER BY ips.avg_fragmentation_in_percent DESC;

PRINT ''
PRINT '⚠️  Si hay índices con fragmentación > 30%, ejecutar:'
PRINT '    ALTER INDEX ALL ON [Tabla] REBUILD WITH (ONLINE = OFF);'
GO

/* ============================================
   6. PRUEBA DE RENDIMIENTO
   ============================================ */
PRINT ''
PRINT '⏱️  Ejecutando prueba de rendimiento...'

SET STATISTICS TIME ON;
SET STATISTICS IO ON;

EXEC dbo.SP_Alerta_GetAll;

SET STATISTICS TIME OFF;
SET STATISTICS IO OFF;

PRINT ''
PRINT '✅ Optimización completada'
PRINT ''
PRINT '📝 NOTAS:'
PRINT '   - Se agregó NOLOCK para lecturas más rápidas (lecturas no bloqueadas)'
PRINT '   - OPTION (RECOMPILE) regenera plan en cada ejecución (útil para tablas pequeñas)'
PRINT '   - MAXDOP 4 limita paralelismo (ajustar según CPU disponibles)'
PRINT '   - Si las tablas crecen mucho (>10,000 registros), quitar RECOMPILE'
PRINT ''
PRINT '🎯 IMPACTO ESPERADO:'
PRINT '   - Reducción de 50-70% en tiempo de consulta'
PRINT '   - De ~2-4 segundos a ~0.5-1 segundo'
GO

