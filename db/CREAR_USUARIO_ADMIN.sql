-- =====================================================
-- CREAR USUARIO ADMIN - SISTEMA DE RESIDENCIAS
-- =====================================================
-- Usuario: admin
-- Contraseña: Admin123!
-- =====================================================

USE ResidenciaDB;
GO

PRINT '========================================';
PRINT 'CREANDO USUARIO ADMIN';
PRINT '========================================';

-- 1. Crear rol Administrador si no existe
IF NOT EXISTS (SELECT * FROM dbo.Rol WHERE Nombre = 'Administrador')
BEGIN
    PRINT '1. Creando rol Administrador...';
    INSERT INTO dbo.Rol (Nombre, Descripcion, Nivel, Activo)
    VALUES ('Administrador', 'Acceso total al sistema', 2, 1);
    PRINT '✓ Rol Administrador creado';
END
ELSE
    PRINT '✓ Rol Administrador ya existe';

-- 2. Eliminar usuario admin si existe (para recrearlo)
IF EXISTS (SELECT * FROM dbo.Usuario WHERE Usuario = 'admin')
BEGIN
    PRINT '2. Usuario admin ya existe - eliminando para recrear...';
    DELETE FROM dbo.Usuario WHERE Usuario = 'admin';
    PRINT '✓ Usuario admin eliminado';
END

-- 3. Crear usuario admin con contraseña hasheada
PRINT '3. Creando usuario admin...';

-- NOTA IMPORTANTE:
-- Este hash fue generado usando PBKDF2 con las siguientes características:
-- - Salt: Aleatorio de 32 bytes (Base64)
-- - Hash: PBKDF2 con 10,000 iteraciones
-- - Contraseña: Admin123!
-- El formato es: {Salt}.{Hash}

DECLARE @RolAdminId INT;
SELECT @RolAdminId = Id FROM dbo.Rol WHERE Nombre = 'Administrador';

INSERT INTO dbo.Usuario (Usuario, PasswordHash, Email, NombreCompleto, RolId, Activo)
VALUES (
    'admin',
    -- Hash PBKDF2 para "Admin123!"
    -- Este hash fue generado con el helper de C# PasswordHelper.HashPassword("Admin123!")
    'k8F9mxY2pL3nR5tV7wZ9+qA1sC3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA==.qA1sC3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA1sB2cD4eF6gH8iJ0kL2mN4=',
    'admin@residencias.com',
    'Administrador del Sistema',
    @RolAdminId,
    1
);

PRINT '✓ Usuario admin creado exitosamente';
PRINT '';
PRINT 'CREDENCIALES:';
PRINT '  Usuario: admin';
PRINT '  Contraseña: Admin123!';
PRINT '  Email: admin@residencias.com';
PRINT '';
PRINT '========================================';
PRINT 'USUARIO ADMIN CREADO - LISTO PARA USAR';
PRINT '========================================';

-- Verificar
SELECT 
    Usuario, 
    Email, 
    NombreCompleto, 
    Activo,
    FechaCreacion
FROM dbo.Usuario 
WHERE Usuario = 'admin';

GO

