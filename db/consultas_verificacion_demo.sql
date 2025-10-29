/* ============================================
   CONSULTAS DE VERIFICACIÓN PARA LA DEMO
   Sistema de Gestión de Residencias para NNA
   ============================================
   
   Consultas útiles para verificar datos de demostración
   y mostrar durante la presentación
*/

USE ResidenciaDB;
GO

PRINT ''
PRINT '================================================'
PRINT '  CONSULTAS DE VERIFICACIÓN - DATOS DE DEMO'
PRINT '================================================'
PRINT ''

-- ============================================
-- 1. RESUMEN GENERAL
-- ============================================
PRINT '📊 1. RESUMEN GENERAL DEL SISTEMA'
PRINT '=================================='
PRINT ''

SELECT 
    'Tutores' AS Entidad,
    COUNT(*) AS Total
FROM dbo.Tutor
UNION ALL
SELECT 
    'Niños/Adolescentes',
    COUNT(*)
FROM dbo.Nino
UNION ALL
SELECT 
    'Legajos Activos',
    COUNT(*)
FROM dbo.Legajo
WHERE EstadoId = (SELECT Id FROM dbo.Estado WHERE Nombre = 'Activo')
UNION ALL
SELECT 
    'Alertas Totales',
    COUNT(*)
FROM dbo.Alerta;

-- ============================================
-- 2. ALERTAS POR URGENCIA
-- ============================================
PRINT ''
PRINT '🔔 2. ALERTAS CLASIFICADAS POR URGENCIA'
PRINT '========================================'
PRINT ''

SELECT 
    CASE 
        WHEN FechaVencimiento < CAST(GETDATE() AS DATE) THEN '🔴 VENCIDAS (URGENTE)'
        WHEN FechaVencimiento = CAST(GETDATE() AS DATE) THEN '🟠 VENCEN HOY (MÁXIMA PRIORIDAD)'
        WHEN FechaVencimiento BETWEEN DATEADD(DAY, 1, CAST(GETDATE() AS DATE)) 
             AND DATEADD(DAY, 3, CAST(GETDATE() AS DATE)) THEN '🟡 PRÓXIMAS (1-3 días)'
        WHEN FechaVencimiento BETWEEN DATEADD(DAY, 4, CAST(GETDATE() AS DATE)) 
             AND DATEADD(DAY, 7, CAST(GETDATE() AS DATE)) THEN '🔵 FUTURAS (4-7 días)'
        ELSE '🟢 MÁS ADELANTE (>7 días)'
    END AS Urgencia,
    COUNT(*) AS Cantidad
FROM dbo.Alerta
WHERE EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente')
GROUP BY 
    CASE 
        WHEN FechaVencimiento < CAST(GETDATE() AS DATE) THEN 1
        WHEN FechaVencimiento = CAST(GETDATE() AS DATE) THEN 2
        WHEN FechaVencimiento BETWEEN DATEADD(DAY, 1, CAST(GETDATE() AS DATE)) 
             AND DATEADD(DAY, 3, CAST(GETDATE() AS DATE)) THEN 3
        WHEN FechaVencimiento BETWEEN DATEADD(DAY, 4, CAST(GETDATE() AS DATE)) 
             AND DATEADD(DAY, 7, CAST(GETDATE() AS DATE)) THEN 4
        ELSE 5
    END,
    CASE 
        WHEN FechaVencimiento < CAST(GETDATE() AS DATE) THEN '🔴 VENCIDAS (URGENTE)'
        WHEN FechaVencimiento = CAST(GETDATE() AS DATE) THEN '🟠 VENCEN HOY (MÁXIMA PRIORIDAD)'
        WHEN FechaVencimiento BETWEEN DATEADD(DAY, 1, CAST(GETDATE() AS DATE)) 
             AND DATEADD(DAY, 3, CAST(GETDATE() AS DATE)) THEN '🟡 PRÓXIMAS (1-3 días)'
        WHEN FechaVencimiento BETWEEN DATEADD(DAY, 4, CAST(GETDATE() AS DATE)) 
             AND DATEADD(DAY, 7, CAST(GETDATE() AS DATE)) THEN '🔵 FUTURAS (4-7 días)'
        ELSE '🟢 MÁS ADELANTE (>7 días)'
    END
ORDER BY 
    CASE 
        WHEN FechaVencimiento < CAST(GETDATE() AS DATE) THEN 1
        WHEN FechaVencimiento = CAST(GETDATE() AS DATE) THEN 2
        WHEN FechaVencimiento BETWEEN DATEADD(DAY, 1, CAST(GETDATE() AS DATE)) 
             AND DATEADD(DAY, 3, CAST(GETDATE() AS DATE)) THEN 3
        WHEN FechaVencimiento BETWEEN DATEADD(DAY, 4, CAST(GETDATE() AS DATE)) 
             AND DATEADD(DAY, 7, CAST(GETDATE() AS DATE)) THEN 4
        ELSE 5
    END;

-- ============================================
-- 3. ALERTAS VENCIDAS (MOSTRAR EN DEMO)
-- ============================================
PRINT ''
PRINT '🔴 3. ALERTAS VENCIDAS - REQUIEREN ATENCIÓN INMEDIATA'
PRINT '======================================================'
PRINT ''

SELECT 
    A.Id AS AlertaID,
    N.Nombre + ' ' + N.Apellido AS NiñoNNA,
    L.Id AS LegajoID,
    TA.Nombre AS TipoAlerta,
    P.Nombre AS Prioridad,
    A.Descripcion,
    A.FechaVencimiento,
    ABS(DATEDIFF(DAY, A.FechaVencimiento, GETDATE())) AS DíasVencida
FROM dbo.Alerta A
INNER JOIN dbo.Legajo L ON L.Id = A.LegajoId
INNER JOIN dbo.Nino N ON N.Id = L.NinoId
INNER JOIN dbo.TipoAlerta TA ON TA.Id = A.TipoId
INNER JOIN dbo.Prioridad P ON P.Id = A.PrioridadId
WHERE A.FechaVencimiento < CAST(GETDATE() AS DATE)
  AND A.EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente')
ORDER BY A.FechaVencimiento;

-- ============================================
-- 4. ALERTAS QUE VENCEN HOY
-- ============================================
PRINT ''
PRINT '🟠 4. ALERTAS QUE VENCEN HOY - MÁXIMA URGENCIA'
PRINT '=============================================='
PRINT ''

SELECT 
    A.Id AS AlertaID,
    N.Nombre + ' ' + N.Apellido AS NiñoNNA,
    L.Id AS LegajoID,
    TA.Nombre AS TipoAlerta,
    P.Nombre AS Prioridad,
    A.Descripcion,
    A.FechaVencimiento
FROM dbo.Alerta A
INNER JOIN dbo.Legajo L ON L.Id = A.LegajoId
INNER JOIN dbo.Nino N ON N.Id = L.NinoId
INNER JOIN dbo.TipoAlerta TA ON TA.Id = A.TipoId
INNER JOIN dbo.Prioridad P ON P.Id = A.PrioridadId
WHERE A.FechaVencimiento = CAST(GETDATE() AS DATE)
  AND A.EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente')
ORDER BY P.Orden, A.FechaVencimiento;

-- ============================================
-- 5. ALERTAS PRÓXIMAS (3 DÍAS)
-- ============================================
PRINT ''
PRINT '🟡 5. ALERTAS PRÓXIMAS - PRÓXIMOS 3 DÍAS'
PRINT '========================================'
PRINT ''

SELECT 
    A.Id AS AlertaID,
    N.Nombre + ' ' + N.Apellido AS NiñoNNA,
    L.Id AS LegajoID,
    TA.Nombre AS TipoAlerta,
    P.Nombre AS Prioridad,
    A.Descripcion,
    A.FechaVencimiento,
    DATEDIFF(DAY, GETDATE(), A.FechaVencimiento) AS DíasRestantes
FROM dbo.Alerta A
INNER JOIN dbo.Legajo L ON L.Id = A.LegajoId
INNER JOIN dbo.Nino N ON N.Id = L.NinoId
INNER JOIN dbo.TipoAlerta TA ON TA.Id = A.TipoId
INNER JOIN dbo.Prioridad P ON P.Id = A.PrioridadId
WHERE A.FechaVencimiento BETWEEN DATEADD(DAY, 1, CAST(GETDATE() AS DATE)) 
      AND DATEADD(DAY, 3, CAST(GETDATE() AS DATE))
  AND A.EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente')
ORDER BY A.FechaVencimiento, P.Orden;

-- ============================================
-- 6. DISTRIBUCIÓN DE ALERTAS POR ESTADO
-- ============================================
PRINT ''
PRINT '📊 6. DISTRIBUCIÓN DE ALERTAS POR ESTADO'
PRINT '========================================='
PRINT ''

SELECT 
    EA.Nombre AS Estado,
    COUNT(*) AS Total,
    CAST(ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM dbo.Alerta), 1) AS DECIMAL(5,1)) AS Porcentaje
FROM dbo.Alerta A
INNER JOIN dbo.EstadoAlerta EA ON EA.Id = A.EstadoId
GROUP BY EA.Nombre
ORDER BY COUNT(*) DESC;

-- ============================================
-- 7. DISTRIBUCIÓN DE ALERTAS POR PRIORIDAD
-- ============================================
PRINT ''
PRINT '📊 7. DISTRIBUCIÓN DE ALERTAS POR PRIORIDAD'
PRINT '============================================'
PRINT ''

SELECT 
    P.Nombre AS Prioridad,
    COUNT(*) AS Total,
    CAST(ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM dbo.Alerta), 1) AS DECIMAL(5,1)) AS Porcentaje
FROM dbo.Alerta A
INNER JOIN dbo.Prioridad P ON P.Id = A.PrioridadId
GROUP BY P.Nombre, P.Orden
ORDER BY P.Orden;

-- ============================================
-- 8. DISTRIBUCIÓN DE ALERTAS POR TIPO
-- ============================================
PRINT ''
PRINT '📊 8. DISTRIBUCIÓN DE ALERTAS POR TIPO'
PRINT '======================================'
PRINT ''

SELECT 
    TA.Nombre AS TipoAlerta,
    COUNT(*) AS Total,
    CAST(ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM dbo.Alerta), 1) AS DECIMAL(5,1)) AS Porcentaje
FROM dbo.Alerta A
INNER JOIN dbo.TipoAlerta TA ON TA.Id = A.TipoId
GROUP BY TA.Nombre
ORDER BY COUNT(*) DESC;

-- ============================================
-- 9. LEGAJOS CON MÁS ALERTAS PENDIENTES
-- ============================================
PRINT ''
PRINT '📁 9. LEGAJOS CON MÁS ALERTAS PENDIENTES'
PRINT '========================================='
PRINT ''

SELECT TOP 5
    L.Id AS LegajoID,
    N.Nombre + ' ' + N.Apellido AS NiñoNNA,
    N.Dni,
    E.Nombre AS EstadoLegajo,
    T.Nombre + ' ' + T.Apellido AS TutorAsignado,
    COUNT(*) AS AlertasPendientes
FROM dbo.Alerta A
INNER JOIN dbo.Legajo L ON L.Id = A.LegajoId
INNER JOIN dbo.Nino N ON N.Id = L.NinoId
INNER JOIN dbo.Estado E ON E.Id = L.EstadoId
LEFT JOIN dbo.Tutor T ON T.Id = L.TutorId
WHERE A.EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente')
GROUP BY L.Id, N.Nombre, N.Apellido, N.Dni, E.Nombre, T.Nombre, T.Apellido
ORDER BY COUNT(*) DESC;

-- ============================================
-- 10. VISTA COMPLETA DE LEGAJOS
-- ============================================
PRINT ''
PRINT '📋 10. VISTA COMPLETA DE LEGAJOS ACTIVOS'
PRINT '========================================'
PRINT ''

SELECT 
    L.Id AS LegajoID,
    N.Dni,
    N.Apellido + ', ' + N.Nombre AS NombreCompleto,
    DATEDIFF(YEAR, N.FechaNacimiento, GETDATE()) AS Edad,
    E.Nombre AS Estado,
    ISNULL(T.Nombre + ' ' + T.Apellido, 'Sin asignar') AS Tutor,
    L.FechaIngreso,
    DATEDIFF(DAY, L.FechaIngreso, GETDATE()) AS DíasEnResidencia,
    (SELECT COUNT(*) 
     FROM dbo.Alerta A 
     WHERE A.LegajoId = L.Id 
       AND A.EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente')) AS AlertasPendientes
FROM dbo.Legajo L
INNER JOIN dbo.Nino N ON N.Id = L.NinoId
INNER JOIN dbo.Estado E ON E.Id = L.EstadoId
LEFT JOIN dbo.Tutor T ON T.Id = L.TutorId
ORDER BY L.Id;

-- ============================================
-- 11. TUTORES Y SU CARGA DE TRABAJO
-- ============================================
PRINT ''
PRINT '👥 11. TUTORES Y SU CARGA DE TRABAJO'
PRINT '===================================='
PRINT ''

-- Obtener ID del estado pendiente
DECLARE @EstadoPendienteAlerta INT = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente');
DECLARE @EstadoActivoLegajo INT = (SELECT Id FROM dbo.Estado WHERE Nombre = 'Activo');

SELECT 
    T.Id AS TutorID,
    T.Nombre + ' ' + T.Apellido AS NombreCompleto,
    T.Telefono,
    T.Email,
    COUNT(DISTINCT L.Id) AS LegajosAsignados,
    SUM(CASE WHEN A.EstadoId = @EstadoPendienteAlerta THEN 1 ELSE 0 END) AS AlertasPendientes
FROM dbo.Tutor T
LEFT JOIN dbo.Legajo L ON L.TutorId = T.Id AND L.EstadoId = @EstadoActivoLegajo
LEFT JOIN dbo.Alerta A ON A.LegajoId = L.Id
GROUP BY T.Id, T.Nombre, T.Apellido, T.Telefono, T.Email
ORDER BY COUNT(DISTINCT L.Id) DESC;

-- ============================================
-- 12. TIMELINE DE ALERTAS (PRÓXIMOS 30 DÍAS)
-- ============================================
PRINT ''
PRINT '📅 12. TIMELINE DE ALERTAS - PRÓXIMOS 30 DÍAS'
PRINT '=============================================='
PRINT ''

-- Timeline agrupado por fecha
SELECT 
    A.FechaVencimiento,
    COUNT(*) AS CantidadAlertas,
    STUFF((
        SELECT ', ' + TA2.Nombre + ' (' + P2.Nombre + ')'
        FROM dbo.Alerta A2
        INNER JOIN dbo.TipoAlerta TA2 ON TA2.Id = A2.TipoId
        INNER JOIN dbo.Prioridad P2 ON P2.Id = A2.PrioridadId
        WHERE A2.FechaVencimiento = A.FechaVencimiento
          AND A2.EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente')
        FOR XML PATH(''), TYPE
    ).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS Alertas
FROM dbo.Alerta A
INNER JOIN dbo.TipoAlerta TA ON TA.Id = A.TipoId
INNER JOIN dbo.Prioridad P ON P.Id = A.PrioridadId
WHERE A.FechaVencimiento BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(DAY, 30, CAST(GETDATE() AS DATE))
  AND A.EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente')
GROUP BY A.FechaVencimiento
ORDER BY A.FechaVencimiento;

-- ============================================
-- 13. ALERTAS COMPLETADAS RECIENTEMENTE
-- ============================================
PRINT ''
PRINT '✅ 13. ALERTAS COMPLETADAS (ÚLTIMAS 10)'
PRINT '======================================='
PRINT ''

SELECT TOP 10
    A.Id AS AlertaID,
    N.Nombre + ' ' + N.Apellido AS NiñoNNA,
    TA.Nombre AS TipoAlerta,
    A.Descripcion,
    A.FechaVencimiento,
    A.FechaModificacion AS FechaCompletada,
    CASE 
        WHEN A.FechaModificacion <= A.FechaVencimiento THEN '✅ A TIEMPO'
        ELSE '⚠️ CON RETRASO'
    END AS Cumplimiento
FROM dbo.Alerta A
INNER JOIN dbo.Legajo L ON L.Id = A.LegajoId
INNER JOIN dbo.Nino N ON N.Id = L.NinoId
INNER JOIN dbo.TipoAlerta TA ON TA.Id = A.TipoId
WHERE A.EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Completada')
ORDER BY A.FechaModificacion DESC;

-- ============================================
-- 14. ESTADÍSTICAS DE NIÑOS POR EDAD
-- ============================================
PRINT ''
PRINT '👶 14. DISTRIBUCIÓN DE NIÑOS POR GRUPO ETARIO'
PRINT '=============================================='
PRINT ''

SELECT 
    CASE 
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 0 AND 5 THEN '0-5 años (Primera infancia)'
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 6 AND 10 THEN '6-10 años (Niñez temprana)'
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 11 AND 13 THEN '11-13 años (Pre-adolescencia)'
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 14 AND 17 THEN '14-17 años (Adolescencia)'
        ELSE '18+ años'
    END AS GrupoEtario,
    COUNT(*) AS Cantidad
FROM dbo.Nino
GROUP BY 
    CASE 
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 0 AND 5 THEN 1
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 6 AND 10 THEN 2
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 11 AND 13 THEN 3
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 14 AND 17 THEN 4
        ELSE 5
    END,
    CASE 
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 0 AND 5 THEN '0-5 años (Primera infancia)'
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 6 AND 10 THEN '6-10 años (Niñez temprana)'
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 11 AND 13 THEN '11-13 años (Pre-adolescencia)'
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 14 AND 17 THEN '14-17 años (Adolescencia)'
        ELSE '18+ años'
    END
ORDER BY 
    CASE 
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 0 AND 5 THEN 1
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 6 AND 10 THEN 2
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 11 AND 13 THEN 3
        WHEN DATEDIFF(YEAR, FechaNacimiento, GETDATE()) BETWEEN 14 AND 17 THEN 4
        ELSE 5
    END;

-- ============================================
-- 15. RESUMEN PARA DASHBOARD
-- ============================================
PRINT ''
PRINT '📊 15. RESUMEN PARA DASHBOARD (KPIs)'
PRINT '====================================='
PRINT ''

SELECT 
    'Total Legajos' AS Indicador,
    COUNT(*) AS Valor
FROM dbo.Legajo
WHERE EstadoId = (SELECT Id FROM dbo.Estado WHERE Nombre = 'Activo')
UNION ALL
SELECT 
    'Alertas Vencidas',
    COUNT(*)
FROM dbo.Alerta
WHERE FechaVencimiento < CAST(GETDATE() AS DATE)
  AND EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente')
UNION ALL
SELECT 
    'Alertas Próximas (≤3 días)',
    COUNT(*)
FROM dbo.Alerta
WHERE FechaVencimiento BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(DAY, 3, CAST(GETDATE() AS DATE))
  AND EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente')
UNION ALL
SELECT 
    'Alertas Completadas',
    COUNT(*)
FROM dbo.Alerta
WHERE EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Completada');

PRINT ''
PRINT '✅ CONSULTAS DE VERIFICACIÓN COMPLETADAS'
PRINT ''
GO

