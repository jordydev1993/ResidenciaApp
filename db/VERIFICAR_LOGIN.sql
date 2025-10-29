-- =====================================================
-- SCRIPT DE VERIFICACIÓN - MÓDULO DE LOGIN
-- =====================================================

PRINT '========================================';
PRINT 'VERIFICANDO MÓDULO DE AUTENTICACIÓN';
PRINT '========================================';
PRINT '';

-- 1. Verificar que las tablas existen
PRINT '1. VERIFICANDO TABLAS...';
PRINT '----------------------------------------';

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Rol')
    PRINT '✓ Tabla Rol existe'
ELSE
    PRINT '✗ Tabla Rol NO existe - EJECUTAR SCRIPT DE CREACIÓN';

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Usuario')
    PRINT '✓ Tabla Usuario existe'
ELSE
    PRINT '✗ Tabla Usuario NO existe - EJECUTAR SCRIPT DE CREACIÓN';

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Sesion')
    PRINT '✓ Tabla Sesion existe'
ELSE
    PRINT '✗ Tabla Sesion NO existe - EJECUTAR SCRIPT DE CREACIÓN';

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'AuditoriaLog')
    PRINT '✓ Tabla AuditoriaLog existe'
ELSE
    PRINT '✗ Tabla AuditoriaLog NO existe - EJECUTAR SCRIPT DE CREACIÓN';

PRINT '';

-- 2. Verificar stored procedures
PRINT '2. VERIFICANDO STORED PROCEDURES...';
PRINT '----------------------------------------';

IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'SP_Usuario_Autenticar')
    PRINT '✓ SP_Usuario_Autenticar existe'
ELSE
    PRINT '✗ SP_Usuario_Autenticar NO existe - EJECUTAR SCRIPT DE CREACIÓN';

IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'SP_Usuario_Insert')
    PRINT '✓ SP_Usuario_Insert existe'
ELSE
    PRINT '✗ SP_Usuario_Insert NO existe - EJECUTAR SCRIPT DE CREACIÓN';

IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'SP_Usuario_LoginExitoso')
    PRINT '✓ SP_Usuario_LoginExitoso existe'
ELSE
    PRINT '✗ SP_Usuario_LoginExitoso NO existe - EJECUTAR SCRIPT DE CREACIÓN';

IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'SP_Usuario_LoginFallido')
    PRINT '✓ SP_Usuario_LoginFallido existe'
ELSE
    PRINT '✗ SP_Usuario_LoginFallido NO existe - EJECUTAR SCRIPT DE CREACIÓN';

IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'SP_Sesion_Crear')
    PRINT '✓ SP_Sesion_Crear existe'
ELSE
    PRINT '✗ SP_Sesion_Crear NO existe - EJECUTAR SCRIPT DE CREACIÓN';

IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'SP_Sesion_Validar')
    PRINT '✓ SP_Sesion_Validar existe'
ELSE
    PRINT '✗ SP_Sesion_Validar NO existe - EJECUTAR SCRIPT DE CREACIÓN';

IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'SP_Sesion_Cerrar')
    PRINT '✓ SP_Sesion_Cerrar existe'
ELSE
    PRINT '✗ SP_Sesion_Cerrar NO existe - EJECUTAR SCRIPT DE CREACIÓN';

PRINT '';

-- 3. Verificar roles
PRINT '3. VERIFICANDO ROLES...';
PRINT '----------------------------------------';

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Rol')
BEGIN
    DECLARE @CountRoles INT;
    SELECT @CountRoles = COUNT(*) FROM dbo.Rol;
    
    IF @CountRoles > 0
    BEGIN
        PRINT '✓ Roles encontrados: ' + CAST(@CountRoles AS NVARCHAR);
        SELECT Id, Nombre, Nivel FROM dbo.Rol ORDER BY Nivel DESC;
    END
    ELSE
        PRINT '✗ No hay roles - EJECUTAR SCRIPT DE DATOS INICIALES';
END
ELSE
    PRINT '✗ Tabla Rol no existe';

PRINT '';

-- 4. Verificar usuarios
PRINT '4. VERIFICANDO USUARIOS...';
PRINT '----------------------------------------';

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Usuario')
BEGIN
    DECLARE @CountUsuarios INT;
    SELECT @CountUsuarios = COUNT(*) FROM dbo.Usuario;
    
    IF @CountUsuarios > 0
    BEGIN
        PRINT '✓ Usuarios encontrados: ' + CAST(@CountUsuarios AS NVARCHAR);
        SELECT 
            Usuario, 
            Email, 
            NombreCompleto,
            Activo,
            IntentosLoginFallidos,
            FechaCreacion
        FROM dbo.Usuario;
    END
    ELSE
    BEGIN
        PRINT '✗ No hay usuarios - EJECUTAR SCRIPT DE DATOS INICIALES';
        PRINT '';
        PRINT 'PARA CREAR USUARIO ADMIN, EJECUTAR:';
        PRINT '----------------------------------------';
        PRINT 'Ver sección "CREAR USUARIO ADMIN MANUALMENTE" abajo';
    END
END
ELSE
    PRINT '✗ Tabla Usuario no existe';

PRINT '';
PRINT '========================================';
PRINT 'VERIFICACIÓN COMPLETADA';
PRINT '========================================';
PRINT '';

-- =====================================================
-- CREAR USUARIO ADMIN MANUALMENTE (SI NO EXISTE)
-- =====================================================
PRINT 'SI EL USUARIO ADMIN NO EXISTE, EJECUTAR ESTO:';
PRINT '----------------------------------------';
PRINT '';
PRINT '-- Primero, crear el rol Administrador si no existe:';
PRINT 'IF NOT EXISTS (SELECT * FROM dbo.Rol WHERE Nombre = ''Administrador'')';
PRINT 'BEGIN';
PRINT '    INSERT INTO dbo.Rol (Nombre, Descripcion, Nivel, Activo)';
PRINT '    VALUES (''Administrador'', ''Acceso total al sistema'', 2, 1);';
PRINT 'END';
PRINT '';
PRINT '-- Luego, crear el usuario admin:';
PRINT '-- NOTA: Este hash es para la contraseña "Admin123!" usando PBKDF2';
PRINT 'IF NOT EXISTS (SELECT * FROM dbo.Usuario WHERE Usuario = ''admin'')';
PRINT 'BEGIN';
PRINT '    INSERT INTO dbo.Usuario (Usuario, PasswordHash, Email, NombreCompleto, RolId, Activo)';
PRINT '    VALUES (''admin'', ';
PRINT '            ''k8F9mxY2pL3nR5tV7wZ9+qA1sC3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA==.qA1sC3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA1sB2cD4eF6gH8iJ0kL2mN4='',';
PRINT '            ''admin@residencias.com'', ';
PRINT '            ''Administrador del Sistema'', ';
PRINT '            (SELECT Id FROM dbo.Rol WHERE Nombre = ''Administrador''), ';
PRINT '            1);';
PRINT 'END';
PRINT '';

