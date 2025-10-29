-- =====================================================
-- RESETEAR Y ACTUALIZAR USUARIO ADMIN
-- =====================================================
-- Este script:
-- 1. Resetea los intentos fallidos
-- 2. Desbloquea el usuario
-- 3. Actualiza la contraseña a "Admin123!"
-- =====================================================

USE ResidenciaDB;
GO

PRINT '========================================';
PRINT 'RESETEANDO USUARIO ADMIN';
PRINT '========================================';

-- 1. Resetear intentos fallidos y desbloquear
UPDATE dbo.Usuario
SET 
    IntentosLoginFallidos = 0,
    Activo = 1,
    FechaModificacion = GETDATE()
WHERE Usuario = 'admin';

PRINT '✓ Usuario desbloqueado e intentos reseteados';

-- 2. Actualizar contraseña con un hash válido
-- IMPORTANTE: Este script requiere que ejecutes el backend
-- El backend tiene el método correcto para hashear contraseñas

PRINT '';
PRINT '========================================';
PRINT 'OPCIÓN 1: USAR CONTRASEÑA TEMPORAL';
PRINT '========================================';
PRINT 'Ejecuta este código para establecer una contraseña temporal:';
PRINT '';
PRINT '-- Contraseña temporal: "temp123"';
PRINT 'UPDATE dbo.Usuario';
PRINT 'SET PasswordHash = ''temp123''';
PRINT 'WHERE Usuario = ''admin'';';
PRINT '';
PRINT 'Luego usa: Usuario: admin, Contraseña: temp123';
PRINT '';

-- Verificar estado actual
SELECT 
    Usuario,
    Email,
    NombreCompleto,
    Activo,
    IntentosLoginFallidos,
    FechaCreacion,
    FechaModificacion
FROM dbo.Usuario
WHERE Usuario = 'admin';

GO

