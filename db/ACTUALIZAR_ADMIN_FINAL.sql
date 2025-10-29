-- =====================================================
-- ACTUALIZAR CONTRASEÑA DEL ADMIN - FINAL
-- =====================================================
-- Este script actualiza la contraseña a "Admin123!"
-- con el hash correcto generado por el backend
-- =====================================================

USE ResidenciaDB;
GO

PRINT '========================================';
PRINT 'ACTUALIZANDO USUARIO ADMIN';
PRINT '========================================';

-- 1. Resetear intentos fallidos y desbloquear usuario
UPDATE dbo.Usuario 
SET 
    IntentosLoginFallidos = 0,
    Activo = 1,
    FechaModificacion = GETDATE()
WHERE Usuario = 'admin';

PRINT '✓ Usuario desbloqueado e intentos reseteados';

-- 2. Actualizar contraseña con el hash generado por el backend
UPDATE dbo.Usuario 
SET PasswordHash = 'cgxK3MjKbHFrRPFWIv6e3Uig8AmBh3LakRDANxfcsOw=.phjaP19q2q+EHvrOQNW+iuHgYzKdU6t76NW0MlCI4Rs='
WHERE Usuario = 'admin';

PRINT '✓ Contraseña actualizada correctamente';
PRINT '';
PRINT '========================================';
PRINT 'CREDENCIALES ACTUALIZADAS:';
PRINT '========================================';
PRINT 'Usuario: admin';
PRINT 'Contraseña: Admin123!';
PRINT 'Email: admin@residencias.com';
PRINT '';
PRINT '✅ LISTO PARA USAR';
PRINT '========================================';

-- Verificar resultado
SELECT 
    Usuario,
    Email,
    NombreCompleto,
    Activo,
    IntentosLoginFallidos,
    LEFT(PasswordHash, 20) + '...' AS PasswordHash_Preview,
    FechaModificacion
FROM dbo.Usuario
WHERE Usuario = 'admin';

GO

