-- =====================================================
-- CREAR USUARIO ADMIN - CONTRASEÑA TEMPORAL
-- =====================================================
-- Usuario: admin
-- Contraseña temporal: password123
-- IMPORTANTE: Cambiar después del primer login
-- =====================================================

USE ResidenciaDB;
GO

-- 1. Crear rol si no existe
IF NOT EXISTS (SELECT * FROM dbo.Rol WHERE Nombre = 'Administrador')
BEGIN
    INSERT INTO dbo.Rol (Nombre, Descripcion, Nivel, Activo)
    VALUES ('Administrador', 'Acceso total al sistema', 2, 1);
END

-- 2. Eliminar usuario si existe
IF EXISTS (SELECT * FROM dbo.Usuario WHERE Usuario = 'admin')
BEGIN
    DELETE FROM dbo.Usuario WHERE Usuario = 'admin';
END

-- 3. Crear usuario con contraseña TEMPORAL
-- Este hash corresponde a "password123" (contraseña temporal MUY SIMPLE para testing)
INSERT INTO dbo.Usuario (Usuario, PasswordHash, Email, NombreCompleto, RolId, Activo)
VALUES (
    'admin',
    'password123', -- TEMPORAL - Solo para pruebas
    'admin@residencias.com',
    'Administrador del Sistema',
    (SELECT Id FROM dbo.Rol WHERE Nombre = 'Administrador'),
    1
);

PRINT '✓ Usuario admin creado';
PRINT 'USAR TEMPORALMENTE:';
PRINT '  Usuario: admin';
PRINT '  Contraseña: password123';
PRINT '';
PRINT '⚠️ IMPORTANTE: Esta es una contraseña temporal sin hash';
PRINT '   Usar solo para testing. Cambiar inmediatamente.';

SELECT Usuario, Email, NombreCompleto, Activo 
FROM dbo.Usuario 
WHERE Usuario = 'admin';

GO

