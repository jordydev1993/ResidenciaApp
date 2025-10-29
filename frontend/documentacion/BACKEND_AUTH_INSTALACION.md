# 🔧 Guía de Instalación - Backend de Autenticación

## 📋 Archivos Creados

Los siguientes archivos han sido creados en el proyecto backend:

### 📁 Helpers
- `api/WebApi/Helpers/PasswordHelper.cs` - Gestión de contraseñas con PBKDF2
- `api/WebApi/Helpers/TokenHelper.cs` - Generación de tokens seguros

### 📁 Models
- `api/WebApi/Models/Usuario.cs` - Modelo de usuario con métodos de autenticación
- `api/WebApi/Models/Sesion.cs` - Modelo de sesión
- `api/WebApi/Models/LoginRequest.cs` - Modelos de request/response

### 📁 Controllers
- `api/WebApi/Controllers/AuthController.cs` - Controlador de autenticación

---

## 🚀 Pasos de Instalación

### 1️⃣ Agregar Archivos al Proyecto de Visual Studio

Los archivos ya están físicamente en disco, pero necesitas agregarlos al proyecto `.csproj`:

1. **Abrir Visual Studio 2019/2022**
2. **Abrir el proyecto**: `api/ResidenciaWebApp.sln`
3. **Agregar carpeta Helpers**:
   - Clic derecho en el proyecto `WebApi` → **Agregar** → **Nueva Carpeta**
   - Nombre: `Helpers`
   - Clic derecho en carpeta `Helpers` → **Agregar** → **Elemento Existente**
   - Navegar a `api/WebApi/Helpers/` y seleccionar:
     - `PasswordHelper.cs`
     - `TokenHelper.cs`

4. **Agregar nuevos modelos**:
   - Clic derecho en carpeta `Models` → **Agregar** → **Elemento Existente**
   - Seleccionar:
     - `Usuario.cs`
     - `Sesion.cs`
     - `LoginRequest.cs`

5. **Agregar nuevo controlador**:
   - Clic derecho en carpeta `Controllers` → **Agregar** → **Elemento Existente**
   - Seleccionar: `AuthController.cs`

### 2️⃣ Verificar Referencias

Verifica que el proyecto tenga estas referencias (ya deberían estar instaladas):

```xml
<PackageReference Include="Microsoft.AspNet.WebApi.Core" Version="5.3.0" />
<PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
<PackageReference Include="System.Data.SqlClient" Version="4.8.0" />
```

### 3️⃣ Compilar el Proyecto

1. En Visual Studio: **Compilar** → **Compilar Solución** (o `Ctrl+Shift+B`)
2. Verificar que no haya errores de compilación

---

## 📡 Endpoints Disponibles

### Autenticación

#### 🔐 Login
```http
POST http://localhost:56906/api/Auth/Login
Content-Type: application/json

{
  "Usuario": "admin",
  "Password": "Admin123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "Rp8B...",
  "usuario": {
    "id": 1,
    "usuario": "admin",
    "email": "admin@residencias.com",
    "nombreCompleto": "Administrador del Sistema",
    "rol": "Administrador",
    "rolNivel": 2
  }
}
```

#### 🚪 Logout
```http
POST http://localhost:56906/api/Auth/Logout
Authorization: Bearer {token}
```

#### ✅ Validar Token
```http
GET http://localhost:56906/api/Auth/ValidateToken
Authorization: Bearer {token}
```

#### 🔄 Renovar Sesión
```http
POST http://localhost:56906/api/Auth/RenewToken
Authorization: Bearer {token}
```

### Gestión de Usuarios

#### 📝 Registrar Usuario
```http
POST http://localhost:56906/api/Auth/Register
Content-Type: application/json

{
  "Usuario": "nuevo_usuario",
  "Password": "Password123!",
  "Email": "usuario@example.com",
  "NombreCompleto": "Juan Pérez",
  "RolId": 2
}
```

#### 🔑 Cambiar Contraseña
```http
POST http://localhost:56906/api/Auth/ChangePassword
Authorization: Bearer {token}
Content-Type: application/json

{
  "PasswordActual": "Password123!",
  "PasswordNueva": "NewPassword456!",
  "PasswordNuevaConfirmacion": "NewPassword456!"
}
```

---

## 🧪 Pruebas con Postman

### Colección de Pruebas

1. **Crear nueva colección**: "Auth API Tests"

2. **Test 1: Login Exitoso**
   - Method: POST
   - URL: `http://localhost:56906/api/Auth/Login`
   - Body (raw, JSON):
     ```json
     {
       "Usuario": "admin",
       "Password": "Admin123!"
     }
     ```
   - **Guardar token de la respuesta**

3. **Test 2: Validar Token**
   - Method: GET
   - URL: `http://localhost:56906/api/Auth/ValidateToken`
   - Headers:
     - `Authorization: Bearer {token}`

4. **Test 3: Login con Usuario Incorrecto**
   - Method: POST
   - URL: `http://localhost:56906/api/Auth/Login`
   - Body:
     ```json
     {
       "Usuario": "usuario_inexistente",
       "Password": "password123"
     }
     ```
   - **Expected**: 401 Unauthorized

5. **Test 4: Logout**
   - Method: POST
   - URL: `http://localhost:56906/api/Auth/Logout`
   - Headers:
     - `Authorization: Bearer {token}`

---

## 🔒 Seguridad Implementada

### ✅ Características de Seguridad

| Característica | Estado | Descripción |
|---------------|--------|-------------|
| **Hash de Contraseñas** | ✅ | PBKDF2 con 10,000 iteraciones |
| **Tokens Seguros** | ✅ | Tokens aleatorios de 512 bits |
| **Prevención de Fuerza Bruta** | ✅ | Bloqueo tras 3 intentos fallidos |
| **Expiración de Sesiones** | ✅ | 30 minutos de inactividad |
| **Auditoría** | ✅ | Registro de login/logout en BD |
| **Validación de Contraseñas** | ✅ | Mínimo 8 caracteres, mayúsculas, números |
| **Protección SQL Injection** | ✅ | Stored Procedures parametrizados |
| **Comparación Tiempo Constante** | ✅ | Prevención de timing attacks |

---

## ⚠️ Notas Importantes

### 🔴 Contraseña por Defecto

El usuario administrador tiene estas credenciales iniciales:
- **Usuario**: `admin`
- **Contraseña**: `Admin123!`

**⚠️ IMPORTANTE**: Cambiar esta contraseña inmediatamente en producción.

### 🔴 HTTPS en Producción

En producción, **SIEMPRE** usar HTTPS para proteger las credenciales en tránsito.

Configurar en `Web.config`:
```xml
<system.webServer>
  <rewrite>
    <rules>
      <rule name="Redirect to HTTPS" stopProcessing="true">
        <match url="(.*)" />
        <conditions>
          <add input="{HTTPS}" pattern="^OFF$" />
        </conditions>
        <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
      </rule>
    </rules>
  </rewrite>
</system.webServer>
```

### 🔴 Manejo de Errores

Los errores NO deben exponer información sensible:
- ❌ **Malo**: "Usuario 'admin' no existe"
- ✅ **Bueno**: "Usuario o contraseña incorrectos"

---

## 🐛 Solución de Problemas

### Error: "No se puede encontrar el procedimiento almacenado 'SP_Usuario_Autenticar'"

**Solución**: Ejecutar el script SQL del módulo de login que crea los stored procedures.

```sql
-- Ejecutar en SQL Server Management Studio
-- Archivo: INFORME_MODULO_LOGIN.md (sección de scripts SQL)
```

### Error: "Could not load file or assembly 'System.Data.SqlClient'"

**Solución**: Instalar el paquete NuGet:
```powershell
Install-Package System.Data.SqlClient -Version 4.8.6
```

### Error: "The type or namespace name 'HttpStatusCode' could not be found"

**Solución**: Agregar using en el archivo:
```csharp
using System.Net;
```

### Error 500 en Login

**Causas comunes**:
1. Cadena de conexión incorrecta en `Web.config`
2. Base de datos no accesible
3. Stored procedures no creados

**Verificar**:
```csharp
// En Db.cs, verificar connectionString
private readonly string connectionString = 
    ConfigurationManager.ConnectionStrings["ResidenciaDB"]?.ConnectionString;
```

---

## 📊 Monitoreo y Logs

### Logs de Auditoría

Todos los eventos de autenticación se registran en `dbo.AuditoriaLog`:

```sql
-- Ver últimos logins
SELECT TOP 10 
    a.Fecha,
    u.Usuario,
    a.Accion,
    a.IpAddress,
    a.Detalle
FROM dbo.AuditoriaLog a
LEFT JOIN dbo.Usuario u ON u.Id = a.UsuarioId
WHERE a.Accion LIKE 'LOGIN%'
ORDER BY a.Fecha DESC;
```

### Limpiar Sesiones Expiradas

Ejecutar periódicamente (daily):

```sql
-- Job SQL Server o Tarea Programada
DELETE FROM dbo.Sesion 
WHERE FechaExpiracion < GETDATE() OR Activa = 0;
```

---

## ✅ Checklist de Implementación

- [ ] Archivos agregados a proyecto VS
- [ ] Proyecto compila sin errores
- [ ] Base de datos creada con stored procedures
- [ ] Cadena de conexión configurada
- [ ] Pruebas de login exitosas
- [ ] Pruebas de validación de token
- [ ] Pruebas de logout
- [ ] Contraseña de admin cambiada
- [ ] CORS configurado correctamente
- [ ] Logs de auditoría funcionando

---

## 📚 Recursos Adicionales

- [Documentación ASP.NET Web API](https://docs.microsoft.com/es-es/aspnet/web-api/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Best Practices for Password Storage](https://www.ncsc.gov.uk/collection/passwords/updating-your-approach)

---

## 🆘 Soporte

Si encuentras problemas durante la implementación:

1. Verificar logs de Visual Studio (Output window)
2. Verificar logs de IIS Express
3. Usar Postman/Swagger para debuggear APIs
4. Revisar tabla `dbo.AuditoriaLog` para errores de login

---

**Fecha de creación**: Octubre 2025  
**Versión**: 1.0  
**Estado**: ✅ Implementado

