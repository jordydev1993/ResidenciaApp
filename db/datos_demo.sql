/* ============================================
   SCRIPT DE DATOS DE DEMOSTRACIÓN
   Sistema de Gestión de Residencias para NNA
   ============================================
   
   Este script inserta datos realistas para demostración:
   - 10 Niños/Adolescentes
   - 5 Tutores
   - 10 Legajos
   - 20 Alertas (con diferentes estados, prioridades y fechas)
   
   NOTA: Ejecutar DESPUÉS de crear la base de datos con bd.sql
*/

USE ResidenciaDB;
GO

-- Limpiar datos existentes (si los hay)
PRINT '🗑️ Limpiando datos existentes...'
DELETE FROM dbo.Alerta;
DELETE FROM dbo.Legajo;
DELETE FROM dbo.Nino;
DELETE FROM dbo.Tutor;

-- Reiniciar contadores de identidad
DBCC CHECKIDENT ('dbo.Alerta', RESEED, 0);
DBCC CHECKIDENT ('dbo.Legajo', RESEED, 0);
DBCC CHECKIDENT ('dbo.Nino', RESEED, 0);
DBCC CHECKIDENT ('dbo.Tutor', RESEED, 0);
GO

/* ============================================
   1. INSERTAR TUTORES
   ============================================ */
PRINT ''
PRINT '👥 Insertando tutores...'

INSERT INTO dbo.Tutor (Nombre, Apellido, Telefono, Email, UsuarioCreacion) VALUES
('María Soledad', 'González', '11-4555-1234', 'mgonzalez@residencia.gob.ar', 'admin'),
('Carlos Alberto', 'Rodríguez', '11-4555-5678', 'crodriguez@residencia.gob.ar', 'admin'),
('Ana Patricia', 'Fernández', '11-4555-9012', 'afernandez@residencia.gob.ar', 'admin'),
('Roberto Daniel', 'Martínez', '11-4555-3456', 'rmartinez@residencia.gob.ar', 'admin'),
('Laura Beatriz', 'López', '11-4555-7890', 'llopez@residencia.gob.ar', 'admin');

PRINT '   ✓ ' + CAST(@@ROWCOUNT AS VARCHAR) + ' tutores insertados'
GO

/* ============================================
   2. INSERTAR NIÑOS/ADOLESCENTES
   ============================================ */
PRINT ''
PRINT '👶 Insertando niños y adolescentes...'

INSERT INTO dbo.Nino (Dni, Apellido, Nombre, FechaNacimiento, UsuarioCreacion) VALUES
-- Grupo 1: Niños pequeños (6-10 años)
('45123456', 'Pérez', 'Juancito', '2018-03-15', 'admin'),
('45234567', 'García', 'Sofía', '2017-07-22', 'admin'),
('45345678', 'Romero', 'Mateo', '2019-01-10', 'admin'),

-- Grupo 2: Pre-adolescentes (11-13 años)
('44123789', 'Díaz', 'Valentina', '2013-05-18', 'admin'),
('44234890', 'Morales', 'Thiago', '2014-09-30', 'admin'),
('44345901', 'Suárez', 'Catalina', '2012-11-25', 'admin'),

-- Grupo 3: Adolescentes (14-17 años)
('43123012', 'Torres', 'Santiago', '2010-02-14', 'admin'),
('43234123', 'Ramírez', 'Martina', '2009-06-08', 'admin'),
('43345234', 'Flores', 'Nicolás', '2008-12-20', 'admin'),
('43456345', 'Castro', 'Lucía', '2007-04-03', 'admin');

PRINT '   ✓ ' + CAST(@@ROWCOUNT AS VARCHAR) + ' niños/adolescentes insertados'
GO

/* ============================================
   3. INSERTAR LEGAJOS
   ============================================ */
PRINT ''
PRINT '📁 Insertando legajos...'

DECLARE @EstadoActivo INT = (SELECT Id FROM dbo.Estado WHERE Nombre = 'Activo');
DECLARE @EstadoSeguimiento INT = (SELECT Id FROM dbo.Estado WHERE Nombre = 'Seguimiento');

INSERT INTO dbo.Legajo (NinoId, TutorId, EstadoId, FechaIngreso, FechaEgreso, Observaciones, UsuarioCreacion) VALUES
-- Legajos con diferentes tutores y estados
(1, 1, @EstadoActivo, '2023-01-15', NULL, 'Ingreso por situación familiar compleja. Requiere seguimiento psicológico.', 'admin'),
(2, 1, @EstadoActivo, '2023-03-20', NULL, 'Niña con buen comportamiento. Asiste regularmente a la escuela.', 'admin'),
(3, 2, @EstadoActivo, '2023-05-10', NULL, 'Requiere atención médica especializada. Control mensual programado.', 'admin'),
(4, 2, @EstadoActivo, '2023-02-28', NULL, 'Adolescente en proceso de revinculación familiar.', 'admin'),
(5, 3, @EstadoActivo, '2023-04-05', NULL, 'Buen desempeño académico. Participa en actividades deportivas.', 'admin'),
(6, 3, @EstadoSeguimiento, '2022-11-15', NULL, 'Proceso judicial en curso. Audiencias mensuales.', 'admin'),
(7, 4, @EstadoActivo, '2023-06-01', NULL, 'Adolescente mayor. Próximo a egreso. Preparación para vida independiente.', 'admin'),
(8, 4, @EstadoActivo, '2023-01-30', NULL, 'Excelente integración al grupo. Participación activa.', 'admin'),
(9, 5, @EstadoActivo, '2022-09-20', NULL, 'Seguimiento por situación escolar. Apoyo pedagógico.', 'admin'),
(10, 5, @EstadoSeguimiento, '2022-08-10', NULL, 'Proceso de reunificación familiar avanzado. Visitas semanales.', 'admin');

PRINT '   ✓ ' + CAST(@@ROWCOUNT AS VARCHAR) + ' legajos insertados'
GO

/* ============================================
   4. INSERTAR ALERTAS
   ============================================ */
PRINT ''
PRINT '🔔 Insertando alertas...'

-- Obtener IDs de catálogos
DECLARE @TipoMedica INT = (SELECT Id FROM dbo.TipoAlerta WHERE Nombre = 'Médica');
DECLARE @TipoJudicial INT = (SELECT Id FROM dbo.TipoAlerta WHERE Nombre = 'Judicial');
DECLARE @TipoEducativa INT = (SELECT Id FROM dbo.TipoAlerta WHERE Nombre = 'Educativa');
DECLARE @TipoGeneral INT = (SELECT Id FROM dbo.TipoAlerta WHERE Nombre = 'General');

DECLARE @PrioridadAlta INT = (SELECT Id FROM dbo.Prioridad WHERE Nombre = 'Alta');
DECLARE @PrioridadMedia INT = (SELECT Id FROM dbo.Prioridad WHERE Nombre = 'Media');
DECLARE @PrioridadBaja INT = (SELECT Id FROM dbo.Prioridad WHERE Nombre = 'Baja');

DECLARE @EstadoPendiente INT = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente');
DECLARE @EstadoCompletada INT = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Completada');

-- ALERTAS VENCIDAS (para mostrar urgencia)
INSERT INTO dbo.Alerta (TipoId, PrioridadId, EstadoId, LegajoId, Descripcion, FechaVencimiento, UsuarioCreacion) VALUES
(@TipoMedica, @PrioridadAlta, @EstadoPendiente, 1, 
 'Control pediátrico trimestral - Vacunación pendiente contra HPV', 
 DATEADD(DAY, -5, CAST(GETDATE() AS DATE)), 'admin'),

(@TipoJudicial, @PrioridadAlta, @EstadoPendiente, 6, 
 'Audiencia judicial con Defensoría de Menores - Presentar informe actualizado del caso', 
 DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'admin'),

(@TipoEducativa, @PrioridadMedia, @EstadoPendiente, 9, 
 'Reunión con docente por bajo rendimiento académico - Coordinar apoyo escolar', 
 DATEADD(DAY, -3, CAST(GETDATE() AS DATE)), 'admin');

-- ALERTAS QUE VENCEN HOY (máxima urgencia)
INSERT INTO dbo.Alerta (TipoId, PrioridadId, EstadoId, LegajoId, Descripcion, FechaVencimiento, UsuarioCreacion) VALUES
(@TipoMedica, @PrioridadAlta, @EstadoPendiente, 3, 
 '¡URGENTE! Toma de medicación programada - Control neurológico a las 10:00 hs', 
 CAST(GETDATE() AS DATE), 'admin'),

(@TipoGeneral, @PrioridadAlta, @EstadoPendiente, 7, 
 'Renovación de DNI - Turno en Registro Civil 14:00 hs (llevar documentación)', 
 CAST(GETDATE() AS DATE), 'admin');

-- ALERTAS PRÓXIMAS (1-3 días)
INSERT INTO dbo.Alerta (TipoId, PrioridadId, EstadoId, LegajoId, Descripcion, FechaVencimiento, UsuarioCreacion) VALUES
(@TipoJudicial, @PrioridadAlta, @EstadoPendiente, 4, 
 'Visita programada de familiar - Preparar espacio y supervisión', 
 DATEADD(DAY, 1, CAST(GETDATE() AS DATE)), 'admin'),

(@TipoMedica, @PrioridadMedia, @EstadoPendiente, 5, 
 'Control odontológico semestral - Hospital Garrahan turno confirmado', 
 DATEADD(DAY, 2, CAST(GETDATE() AS DATE)), 'admin'),

(@TipoEducativa, @PrioridadMedia, @EstadoPendiente, 2, 
 'Acto escolar - Confirmar asistencia y preparar autorización', 
 DATEADD(DAY, 3, CAST(GETDATE() AS DATE)), 'admin'),

(@TipoGeneral, @PrioridadBaja, @EstadoPendiente, 8, 
 'Cumpleaños - Organizar festejo con el grupo', 
 DATEADD(DAY, 3, CAST(GETDATE() AS DATE)), 'admin');

-- ALERTAS PRÓXIMAS (4-7 días)
INSERT INTO dbo.Alerta (TipoId, PrioridadId, EstadoId, LegajoId, Descripcion, FechaVencimiento, UsuarioCreacion) VALUES
(@TipoJudicial, @PrioridadMedia, @EstadoPendiente, 10, 
 'Evaluación de revinculación familiar - Reunión con equipo técnico', 
 DATEADD(DAY, 5, CAST(GETDATE() AS DATE)), 'admin'),

(@TipoEducativa, @PrioridadBaja, @EstadoPendiente, 1, 
 'Entrega de boletín escolar - Coordinar entrevista con docente', 
 DATEADD(DAY, 6, CAST(GETDATE() AS DATE)), 'admin'),

(@TipoMedica, @PrioridadMedia, @EstadoPendiente, 9, 
 'Control oftalmológico anual - Renovación de anteojos recetados', 
 DATEADD(DAY, 7, CAST(GETDATE() AS DATE)), 'admin');

-- ALERTAS FUTURAS (más de 1 semana)
INSERT INTO dbo.Alerta (TipoId, PrioridadId, EstadoId, LegajoId, Descripcion, FechaVencimiento, UsuarioCreacion) VALUES
(@TipoMedica, @PrioridadBaja, @EstadoPendiente, 6, 
 'Control pediátrico de rutina - Chequeo general de salud', 
 DATEADD(DAY, 15, CAST(GETDATE() AS DATE)), 'admin'),

(@TipoGeneral, @PrioridadBaja, @EstadoPendiente, 4, 
 'Actualización de fotografía para expediente - Foto carnet reciente', 
 DATEADD(DAY, 20, CAST(GETDATE() AS DATE)), 'admin'),

(@TipoEducativa, @PrioridadMedia, @EstadoPendiente, 7, 
 'Inscripción a taller de arte - Confirmar cupo disponible', 
 DATEADD(DAY, 25, CAST(GETDATE() AS DATE)), 'admin');

-- ALERTAS COMPLETADAS (para mostrar historial)
INSERT INTO dbo.Alerta (TipoId, PrioridadId, EstadoId, LegajoId, Descripcion, FechaVencimiento, UsuarioCreacion) VALUES
(@TipoMedica, @PrioridadAlta, @EstadoCompletada, 2, 
 'Vacunación COVID-19 - Segunda dosis aplicada correctamente', 
 DATEADD(DAY, -10, CAST(GETDATE() AS DATE)), 'admin'),

(@TipoJudicial, @PrioridadMedia, @EstadoCompletada, 8, 
 'Presentación de informe mensual al juzgado - Enviado dentro del plazo', 
 DATEADD(DAY, -15, CAST(GETDATE() AS DATE)), 'admin'),

(@TipoEducativa, @PrioridadBaja, @EstadoCompletada, 5, 
 'Reunión de padres en escuela - Asistió tutor asignado', 
 DATEADD(DAY, -7, CAST(GETDATE() AS DATE)), 'admin'),

(@TipoGeneral, @PrioridadMedia, @EstadoCompletada, 10, 
 'Compra de útiles escolares - Material entregado completo', 
 DATEADD(DAY, -12, CAST(GETDATE() AS DATE)), 'admin'),

(@TipoMedica, @PrioridadBaja, @EstadoCompletada, 3, 
 'Análisis clínicos de rutina - Resultados dentro de parámetros normales', 
 DATEADD(DAY, -20, CAST(GETDATE() AS DATE)), 'admin');

PRINT '   ✓ ' + CAST(@@ROWCOUNT AS VARCHAR) + ' alertas insertadas'
GO

/* ============================================
   5. VERIFICACIÓN DE DATOS
   ============================================ */
PRINT ''
PRINT '📊 RESUMEN DE DATOS INSERTADOS:'
PRINT '================================'

DECLARE @CantTutores INT = (SELECT COUNT(*) FROM dbo.Tutor);
DECLARE @CantNinos INT = (SELECT COUNT(*) FROM dbo.Nino);
DECLARE @CantLegajos INT = (SELECT COUNT(*) FROM dbo.Legajo);
DECLARE @CantAlertas INT = (SELECT COUNT(*) FROM dbo.Alerta);
DECLARE @CantAlertasVencidas INT = (SELECT COUNT(*) FROM dbo.Alerta WHERE FechaVencimiento < CAST(GETDATE() AS DATE) AND EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente'));
DECLARE @CantAlertasProximas INT = (SELECT COUNT(*) FROM dbo.Alerta WHERE FechaVencimiento BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(DAY, 3, CAST(GETDATE() AS DATE)) AND EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente'));
DECLARE @CantAlertasCompletadas INT = (SELECT COUNT(*) FROM dbo.Alerta WHERE EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Completada'));

PRINT '   👥 Tutores:              ' + CAST(@CantTutores AS VARCHAR);
PRINT '   👶 Niños/Adolescentes:   ' + CAST(@CantNinos AS VARCHAR);
PRINT '   📁 Legajos:              ' + CAST(@CantLegajos AS VARCHAR);
PRINT '   🔔 Alertas totales:      ' + CAST(@CantAlertas AS VARCHAR);
PRINT ''
PRINT '   🔴 Alertas vencidas:     ' + CAST(@CantAlertasVencidas AS VARCHAR);
PRINT '   🟡 Alertas próximas:     ' + CAST(@CantAlertasProximas AS VARCHAR);
PRINT '   🟢 Alertas completadas:  ' + CAST(@CantAlertasCompletadas AS VARCHAR);
PRINT ''

/* ============================================
   6. CONSULTAS DE VERIFICACIÓN
   ============================================ */
PRINT ''
PRINT '🔍 EJEMPLOS DE CONSULTAS DE VERIFICACIÓN:'
PRINT '=========================================='
PRINT ''
PRINT '-- Ver legajos con datos completos:'
PRINT 'SELECT * FROM dbo.VW_LegajoDetalle ORDER BY LegajoId;'
PRINT ''
PRINT '-- Ver alertas urgentes:'
PRINT 'SELECT * FROM dbo.VW_AlertasDetalle WHERE FechaVencimiento <= DATEADD(DAY, 3, GETDATE()) ORDER BY FechaVencimiento;'
PRINT ''
PRINT '-- Dashboard de alertas:'
PRINT 'SELECT Estado, COUNT(*) AS Total FROM dbo.VW_AlertasDetalle GROUP BY Estado;'
PRINT 'SELECT Prioridad, COUNT(*) AS Total FROM dbo.VW_AlertasDetalle GROUP BY Prioridad;'
PRINT ''

/* ============================================
   7. DATOS ADICIONALES ÚTILES
   ============================================ */
PRINT ''
PRINT '💡 INFORMACIÓN PARA LA DEMO:'
PRINT '============================'
PRINT ''
PRINT '   📅 FECHAS IMPORTANTES HOY:'
SELECT 
    '   🔴 VENCIDA hace ' + CAST(ABS(DATEDIFF(DAY, FechaVencimiento, GETDATE())) AS VARCHAR) + ' día(s): ' + 
    LEFT(Descripcion, 60) + '...' AS AlertaUrgente
FROM dbo.Alerta
WHERE FechaVencimiento < CAST(GETDATE() AS DATE)
  AND EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente')
ORDER BY FechaVencimiento;

PRINT ''
SELECT 
    '   🟡 VENCE EN ' + CAST(DATEDIFF(DAY, GETDATE(), FechaVencimiento) AS VARCHAR) + ' día(s): ' + 
    LEFT(Descripcion, 60) + '...' AS AlertaProxima
FROM dbo.Alerta
WHERE FechaVencimiento BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(DAY, 3, CAST(GETDATE() AS DATE))
  AND EstadoId = (SELECT Id FROM dbo.EstadoAlerta WHERE Nombre = 'Pendiente')
ORDER BY FechaVencimiento;

PRINT ''
PRINT '✅ ¡DATOS DE DEMOSTRACIÓN CARGADOS EXITOSAMENTE!'
PRINT ''
PRINT '🎯 PRÓXIMOS PASOS:'
PRINT '   1. Verificar que el backend esté corriendo (F5 en Visual Studio)'
PRINT '   2. Hacer login con: admin / Admin123!'
PRINT '   3. Navegar al Dashboard para ver estadísticas'
PRINT '   4. Ir a Alertas para ver las notificaciones visuales'
PRINT '   5. Ir a Legajos para ver los expedientes'
PRINT ''
PRINT '🎤 ¡LISTO PARA LA PRESENTACIÓN!'
GO

