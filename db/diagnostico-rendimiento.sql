/* ============================================
   DIAGNÓSTICO DE RENDIMIENTO - SISTEMA ALERTAS
   Ejecutar para identificar cuellos de botella
   ============================================ */
USE ResidenciaDB;
GO

PRINT '🔍 DIAGNÓSTICO DE RENDIMIENTO'
PRINT '============================================'
PRINT ''

/* ============================================
   1. CANTIDAD DE DATOS
   ============================================ */
PRINT '📊 1. CANTIDAD DE REGISTROS:'
PRINT '   --------------------------------------------'

SELECT 'Alertas' AS Tabla, COUNT(*) AS Registros FROM dbo.Alerta
UNION ALL
SELECT 'Legajos', COUNT(*) FROM dbo.Legajo
UNION ALL
SELECT 'Niños', COUNT(*) FROM dbo.Nino
UNION ALL
SELECT 'Tutores', COUNT(*) FROM dbo.Tutor
UNION ALL
SELECT 'Tipo Alerta', COUNT(*) FROM dbo.TipoAlerta
UNION ALL
SELECT 'Prioridades', COUNT(*) FROM dbo.Prioridad
UNION ALL
SELECT 'Estados Alerta', COUNT(*) FROM dbo.EstadoAlerta;

PRINT ''

/* ============================================
   2. ÍNDICES EXISTENTES
   ============================================ */
PRINT '🗂️  2. ÍNDICES EN TABLA ALERTA:'
PRINT '   --------------------------------------------'

SELECT 
    i.name AS NombreIndice,
    i.type_desc AS TipoIndice,
    STUFF((SELECT ', ' + c.name
           FROM sys.index_columns ic
           INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
           WHERE ic.object_id = i.object_id AND ic.index_id = i.index_id
           FOR XML PATH('')), 1, 2, '') AS Columnas
FROM sys.indexes i
WHERE i.object_id = OBJECT_ID('Alerta')
    AND i.name IS NOT NULL
ORDER BY i.name;

PRINT ''

/* ============================================
   3. FRAGMENTACIÓN DE ÍNDICES
   ============================================ */
PRINT '💥 3. FRAGMENTACIÓN DE ÍNDICES:'
PRINT '   --------------------------------------------'

SELECT 
    OBJECT_NAME(ips.object_id) AS Tabla,
    i.name AS Indice,
    CAST(ips.avg_fragmentation_in_percent AS DECIMAL(5,2)) AS Fragmentacion_Pct,
    ips.page_count AS Paginas,
    CASE 
        WHEN ips.avg_fragmentation_in_percent > 30 THEN '🔴 CRÍTICO - Requiere REBUILD'
        WHEN ips.avg_fragmentation_in_percent > 10 THEN '🟡 MEDIO - Considerar REORGANIZE'
        ELSE '🟢 OK'
    END AS Estado
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ips
INNER JOIN sys.indexes i ON ips.object_id = i.object_id AND ips.index_id = i.index_id
WHERE 
    ips.page_count > 50
    AND OBJECT_NAME(ips.object_id) IN ('Alerta', 'Legajo', 'Nino', 'Tutor')
ORDER BY ips.avg_fragmentation_in_percent DESC;

PRINT ''

/* ============================================
   4. PRUEBA DE VELOCIDAD - SP_Alerta_GetAll
   ============================================ */
PRINT '⏱️  4. PRUEBA DE VELOCIDAD:'
PRINT '   --------------------------------------------'
PRINT '   Ejecutando SP_Alerta_GetAll...'

DECLARE @StartTime DATETIME2 = SYSDATETIME();

EXEC dbo.SP_Alerta_GetAll;

DECLARE @EndTime DATETIME2 = SYSDATETIME();
DECLARE @Duration INT = DATEDIFF(MILLISECOND, @StartTime, @EndTime);

PRINT ''
PRINT '   📈 RESULTADO:'
PRINT '   - Tiempo de ejecución: ' + CAST(@Duration AS VARCHAR(10)) + ' ms'
PRINT ''

IF @Duration > 2000
    PRINT '   ❌ MUY LENTO (>2 segundos) - Requiere optimización urgente'
ELSE IF @Duration > 1000
    PRINT '   ⚠️  LENTO (1-2 segundos) - Se recomienda optimización'
ELSE IF @Duration > 500
    PRINT '   🟡 ACEPTABLE (0.5-1 segundo) - Funcionaría mejor con caché'
ELSE
    PRINT '   ✅ RÁPIDO (<0.5 segundos) - Rendimiento óptimo'

PRINT ''

/* ============================================
   5. ESTADÍSTICAS OBSOLETAS
   ============================================ */
PRINT '📊 5. ESTADÍSTICAS DE TABLAS:'
PRINT '   --------------------------------------------'

SELECT 
    OBJECT_NAME(s.object_id) AS Tabla,
    s.name AS Estadistica,
    sp.last_updated AS UltimaActualizacion,
    sp.rows AS FilasTotal,
    sp.rows_sampled AS FilasMuestreadas,
    CAST(sp.modification_counter AS BIGINT) AS Modificaciones,
    CASE 
        WHEN sp.last_updated < DATEADD(DAY, -7, GETDATE()) THEN '🔴 Obsoleta (>7 días)'
        WHEN sp.last_updated < DATEADD(DAY, -1, GETDATE()) THEN '🟡 Vieja (>1 día)'
        ELSE '🟢 Actual'
    END AS Estado
FROM sys.stats s
CROSS APPLY sys.dm_db_stats_properties(s.object_id, s.stats_id) sp
WHERE OBJECT_NAME(s.object_id) IN ('Alerta', 'Legajo', 'Nino')
ORDER BY sp.last_updated ASC;

PRINT ''

/* ============================================
   6. PLAN DE EJECUCIÓN ACTUAL
   ============================================ */
PRINT '🗺️  6. ANÁLISIS DEL PLAN DE EJECUCIÓN:'
PRINT '   --------------------------------------------'

SET STATISTICS TIME ON;
SET STATISTICS IO ON;

PRINT '   Analizando I/O y tiempo...'
EXEC dbo.SP_Alerta_GetAll;

SET STATISTICS TIME OFF;
SET STATISTICS IO OFF;

PRINT ''
PRINT '   📝 Interpretar resultados anteriores:'
PRINT '   - CPU time: Tiempo de procesamiento'
PRINT '   - Elapsed time: Tiempo total percibido'
PRINT '   - Logical reads: Accesos a memoria (>1000 = problema)'
PRINT '   - Physical reads: Accesos a disco (>0 = problema)'
PRINT ''

/* ============================================
   7. ÍNDICES FALTANTES SUGERIDOS
   ============================================ */
PRINT '💡 7. ÍNDICES FALTANTES SUGERIDOS POR SQL SERVER:'
PRINT '   --------------------------------------------'

SELECT TOP 5
    OBJECT_NAME(d.object_id) AS Tabla,
    d.equality_columns AS Columnas_Igualdad,
    d.inequality_columns AS Columnas_Desigualdad,
    d.included_columns AS Columnas_Incluidas,
    CAST(s.avg_user_impact AS DECIMAL(5,2)) AS Impacto_Promedio,
    s.user_seeks + s.user_scans AS Busquedas_Totales
FROM sys.dm_db_missing_index_details d
INNER JOIN sys.dm_db_missing_index_groups g ON d.index_handle = g.index_handle
INNER JOIN sys.dm_db_missing_index_group_stats s ON g.index_group_handle = s.group_handle
WHERE OBJECT_NAME(d.object_id) IN ('Alerta', 'Legajo', 'Nino', 'Tutor')
ORDER BY s.avg_user_impact DESC;

IF @@ROWCOUNT = 0
    PRINT '   ✅ No hay índices faltantes críticos'

PRINT ''

/* ============================================
   8. CONEXIONES Y BLOQUEOS
   ============================================ */
PRINT '🔒 8. CONEXIONES Y BLOQUEOS ACTIVOS:'
PRINT '   --------------------------------------------'

SELECT 
    s.session_id AS SessionID,
    s.login_name AS Usuario,
    s.host_name AS Host,
    s.program_name AS Programa,
    r.status AS Estado,
    r.wait_type AS TipoEspera,
    r.wait_time AS TiempoEspera_ms,
    SUBSTRING(t.text, (r.statement_start_offset/2)+1,
        ((CASE r.statement_end_offset
            WHEN -1 THEN DATALENGTH(t.text)
            ELSE r.statement_end_offset
        END - r.statement_start_offset)/2) + 1) AS Consulta
FROM sys.dm_exec_sessions s
LEFT JOIN sys.dm_exec_requests r ON s.session_id = r.session_id
OUTER APPLY sys.dm_exec_sql_text(r.sql_handle) t
WHERE s.database_id = DB_ID()
    AND s.session_id <> @@SPID
ORDER BY r.wait_time DESC;

IF @@ROWCOUNT = 0
    PRINT '   ✅ No hay bloqueos activos'

PRINT ''
PRINT ''
PRINT '============================================'
PRINT '📋 RESUMEN Y RECOMENDACIONES'
PRINT '============================================'
PRINT ''
PRINT '✅ Para optimizar, ejecutar en orden:'
PRINT '   1. db/indices.sql (si no se ejecutó)'
PRINT '   2. db/optimizacion-alertas.sql'
PRINT '   3. Si hay fragmentación >30%, ejecutar:'
PRINT '      ALTER INDEX ALL ON Alerta REBUILD;'
PRINT '      ALTER INDEX ALL ON Legajo REBUILD;'
PRINT ''
PRINT '🔧 Si el problema persiste:'
PRINT '   - Verificar conexión de red (ping al servidor)'
PRINT '   - Revisar logs de IIS / API'
PRINT '   - Revisar consola del navegador (F12)'
PRINT ''
GO

