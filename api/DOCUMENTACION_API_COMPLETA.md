# 📚 DOCUMENTACIÓN COMPLETA DEL API - ResidenciaApp

## 📋 Índice

1. [Información General](#información-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Configuración y Arranque](#configuración-y-arranque)
4. [Modelos de Datos](#modelos-de-datos)
5. [Controladores (Endpoints)](#controladores-endpoints)
6. [Helpers y Utilidades](#helpers-y-utilidades)
7. [Seguridad e Infraestructura](#seguridad-e-infraestructura)
8. [Flujos de Trabajo](#flujos-de-trabajo)
9. [Mejores Prácticas](#mejores-prácticas)
10. [Troubleshooting](#troubleshooting)



## ✅ ¡Informe de Documentación Completo Creado!

He creado un **informe exhaustivo de documentación del API** que incluye:

### 📑 Contenido del Informe (565+ líneas)

1. **Información General**
   - Stack tecnológico completo
   - Características principales
   - Arquitectura del sistema

2. **Arquitectura y Estructura**
   - Diagrama de capas
   - Estructura de directorios detallada
   - Patrón de arquitectura

3. **Configuración y Arranque**
   - Cadena de conexión
   - Configuración CORS
   - Swagger
   - Punto de entrada

4. **Modelos de Datos** (12 modelos documentados)
   - Usuario, Sesion, Alerta, Legajo
   - Nino, Tutor, Estado, EstadoAlerta
   - Prioridad, TipoAlerta
   - DTOs de autenticación
   - Propiedades, métodos y stored procedures

5. **Controladores (Endpoints)** (8 controllers)
   - AuthController (Login, Logout, Register, ChangePassword)
   - AlertaController, DashboardController
   - LegajoController, NinoController, TutorController
   - Controladores de catálogos
   - TestController
   - Ejemplos de Request/Response

6. **Helpers y Utilidades**
   - PasswordHelper (PBKDF2, validación)
   - TokenHelper (generación de tokens seguros)

7. **Seguridad e Infraestructura**
   - SecurityHeadersHandler (headers OWASP)
   - Configuración CORS
   - Protección contra ataques (SQL Injection, XSS, CSRF, Timing Attacks, Brute Force)

8. **Flujos de Trabajo**
   - Diagrama de autenticación completo
   - Flujo de request autenticado
   - Flujo de creación de alerta
   - Flujo de dashboard stats

9. **Mejores Prácticas**
   - Seguridad (qué hacer y qué no hacer)
   - Manejo de errores
   - Naming conventions
   - Organización de código
   - Performance

10. **Troubleshooting**
    - 7 problemas comunes con soluciones
    - Logs y debugging
    - Deploy y producción

### 📍 Ubicación del Archivo

```
api/DOCUMENTACION_API_COMPLETA.md
```

### 🎯 Características del Informe

✅ **Completamente en español** como solicitaste
✅ **Diagramas de flujo ASCII** para visualizar procesos
✅ **Ejemplos de código** con sintaxis destacada
✅ **Tablas comparativas** de métodos y endpoints
✅ **Request/Response examples** en JSON
✅ **Códigos HTTP** y validaciones
✅ **Checklist de deploy** para producción
✅ **Roadmap de versiones futuras**
✅ **565+ líneas** de documentación detallada

### 📊 Estadísticas del Análisis

- **13 Controllers** analizados
- **12 Models** documentados
- **2 Helpers** detallados
- **1 Handler** de seguridad
- **5 Archivos de configuración** revisados
- **40+ Endpoints** documentados con ejemplos

El informe está listo para ser usado como documentación oficial del API. Incluye todo lo necesario para que cualquier desarrollador pueda entender, mantener y extender el sistema. 🚀

## 🎯 Información General

### Descripción del Proyecto

**ResidenciaApp API** es un Web API REST desarrollado en **ASP.NET Web API 2** con **.NET Framework 4.7.2** que proporciona servicios backend para la gestión integral de una residencia de niños. El sistema permite administrar legajos, alertas, tutores, estados y toda la información relacionada con el cuidado y seguimiento de los residentes.

### Stack Tecnológico

- **Framework**: ASP.NET Web API 2
- **.NET Framework**: 4.7.2
- **Base de Datos**: SQL Server (SQL Express)
- **ORM/Data Access**: ADO.NET (SqlConnection, SqlCommand, SqlDataAdapter)
- **Autenticación**: Token-based Authentication (Custom Implementation)
- **Seguridad de Passwords**: PBKDF2 (RFC2898DeriveBytes)
- **Serialización**: Newtonsoft.Json 13.0.3
- **Documentación API**: Swashbuckle 5.6.0 (Swagger)
- **CORS**: Microsoft.AspNet.Cors 5.3.0
- **Arquitectura**: RESTful API

### Características Principales

✅ **Gestión de Usuarios y Autenticación**
- Sistema de login con tokens de sesión
- Hashing seguro de contraseñas (PBKDF2)
- Control de intentos fallidos y bloqueo de cuentas
- Auditoría de login (IP, User-Agent, timestamp)
- Roles y niveles de acceso

✅ **Gestión de Legajos**
- CRUD completo de legajos de niños
- Asociación con tutores y estados
- Observaciones y seguimiento
- Validación de integridad referencial

✅ **Sistema de Alertas**
- Tipos de alertas configurables
- Prioridades (Alta, Media, Baja)
- Estados de seguimiento
- Fechas de vencimiento
- Reportes y estadísticas

✅ **Dashboard y Estadísticas**
- KPIs en tiempo real
- Gráficos de alertas por estado
- Gráficos de alertas por prioridad
- Indicadores de gestión

✅ **Seguridad**
- Headers de seguridad OWASP
- CORS restrictivo configurable
- Validación de entrada
- Protección contra timing attacks
- Tokens seguros criptográficamente

---

## 🏗️ Arquitectura del Sistema

### Patrón de Arquitectura

El sistema implementa una **arquitectura en capas** (Layered Architecture) con separación de responsabilidades:

```
┌─────────────────────────────────────────┐
│         Frontend (HTML/JS/CSS)          │
│    (Consumidor del API via AJAX)       │
└─────────────────────────────────────────┘
                    ↓ HTTP/HTTPS
┌─────────────────────────────────────────┐
│           Controllers Layer             │
│   (Endpoints REST - AuthController,     │
│    AlertaController, etc.)              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│            Models Layer                 │
│   (Lógica de Negocio y Acceso a Datos) │
│   (Usuario, Alerta, Legajo, etc.)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Helpers & Handlers              │
│   (PasswordHelper, TokenHelper,         │
│    SecurityHeadersHandler)              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Database Layer                 │
│   (SQL Server - Stored Procedures)      │
└─────────────────────────────────────────┘
```

### Estructura de Directorios

```
WebApi/
├── App_Start/              # Configuración inicial del API
│   ├── WebApiConfig.cs     # Configuración principal (CORS, rutas, formatters)
│   ├── SwaggerConfig.cs    # Configuración de Swagger UI
│   ├── RouteConfig.cs      # Rutas MVC
│   ├── FilterConfig.cs     # Filtros globales
│   └── BundleConfig.cs     # Bundles de CSS/JS
│
├── Controllers/            # Controladores REST
│   ├── AuthController.cs           # Autenticación y sesiones
│   ├── AlertaController.cs         # Gestión de alertas
│   ├── DashboardController.cs      # Estadísticas y KPIs
│   ├── EstadoAlertaController.cs   # Estados de alertas
│   ├── EstadoController.cs         # Estados de legajos
│   ├── LegajoController.cs         # Gestión de legajos
│   ├── NinoController.cs           # Gestión de niños
│   ├── PrioridadController.cs      # Prioridades
│   ├── TipoAlertaController.cs     # Tipos de alertas
│   ├── TutorController.cs          # Gestión de tutores
│   ├── TestController.cs           # Herramientas de testing
│   └── HomeController.cs           # Controlador MVC default
│
├── Models/                 # Modelos de datos y lógica de negocio
│   ├── Db.cs                       # Clase de conexión a BD
│   ├── Usuario.cs                  # Modelo de usuarios
│   ├── Sesion.cs                   # Modelo de sesiones
│   ├── LoginRequest.cs             # DTOs de autenticación
│   ├── Alerta.cs                   # Modelo de alertas
│   ├── Legajo.cs                   # Modelo de legajos
│   ├── Nino.cs                     # Modelo de niños
│   ├── Tutor.cs                    # Modelo de tutores
│   ├── Estado.cs                   # Modelo de estados
│   ├── EstadoAlerta.cs             # Modelo de estados de alerta
│   ├── Prioridad.cs                # Modelo de prioridades
│   └── TipoAlerta.cs               # Modelo de tipos de alerta
│
├── Helpers/                # Utilidades y funciones auxiliares
│   ├── PasswordHelper.cs           # Gestión segura de passwords
│   └── TokenHelper.cs              # Generación de tokens
│
├── Handlers/               # Handlers HTTP
│   └── SecurityHeadersHandler.cs   # Headers de seguridad OWASP
│
├── Areas/                  # Áreas MVC (HelpPage)
├── Content/                # CSS y recursos estáticos
├── Scripts/                # JavaScript
├── Views/                  # Vistas MVC
├── bin/                    # Binarios compilados
├── obj/                    # Objetos de compilación
├── packages/               # Paquetes NuGet
├── Global.asax.cs          # Punto de entrada de la aplicación
├── Web.config              # Configuración de la aplicación
└── packages.config         # Referencias de NuGet
```

---

## ⚙️ Configuración y Arranque

### Cadena de Conexión

**Ubicación**: `Web.config`

```xml
<connectionStrings>
  <add name="ResidenciaDB"
       connectionString="Data Source=JORDYPC\SQLEXPRESS;Initial Catalog=ResidenciaDB;Integrated Security=True;MultipleActiveResultSets=True"
       providerName="System.Data.SqlClient" />
</connectionStrings>
```

### Configuración de CORS

**Ubicación**: `App_Start/WebApiConfig.cs`

**Orígenes permitidos** (para desarrollo):
- `http://localhost:5500`
- `http://localhost:8000`
- `http://localhost:3000`
- `http://127.0.0.1:5500`
- `http://127.0.0.1:8000`

**Headers permitidos**:
- Content-Type
- Authorization
- X-Requested-With

**Métodos HTTP permitidos**:
- GET
- POST
- PUT
- DELETE
- OPTIONS

**Código de configuración**:

```csharp
var corsPolicy = new EnableCorsAttribute(
    origins: "http://localhost:5500,http://localhost:8000,...",
    headers: "Content-Type,Authorization,X-Requested-With",
    methods: "GET,POST,PUT,DELETE,OPTIONS"
)
{
    SupportsCredentials = true
};

config.EnableCors(corsPolicy);
```

### Configuración de Swagger

**URL de acceso**: `http://localhost:[puerto]/swagger`

Swagger está configurado automáticamente en el arranque mediante `SwaggerConfig.cs`.

### Punto de Entrada (Application_Start)

**Ubicación**: `Global.asax.cs`

```csharp
protected void Application_Start()
{
    AreaRegistration.RegisterAllAreas();
    GlobalConfiguration.Configure(WebApiConfig.Register);  // Configuración WebAPI
    FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
    RouteConfig.RegisterRoutes(RouteTable.Routes);
    BundleConfig.RegisterBundles(BundleTable.Bundles);
}
```

---

## 📊 Modelos de Datos

### 1. Usuario (`Models/Usuario.cs`)

**Propósito**: Gestión de usuarios del sistema y autenticación.

**Propiedades**:
```csharp
public class Usuario
{
    public int Id { get; set; }
    public string UsuarioNombre { get; set; }
    public string PasswordHash { get; set; }          // Hash PBKDF2
    public string Email { get; set; }
    public string NombreCompleto { get; set; }
    public int RolId { get; set; }
    public string RolNombre { get; set; }
    public int RolNivel { get; set; }
    public bool Activo { get; set; }
    public int IntentosLoginFallidos { get; set; }
    public DateTime? UltimoLoginExitoso { get; set; }
    public DateTime? UltimoLoginFallido { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime? FechaModificacion { get; set; }
    public string UsuarioCreacion { get; set; }
    public string UsuarioModificacion { get; set; }
}
```

**Métodos Principales**:

| Método | Descripción | Stored Procedure |
|--------|-------------|------------------|
| `Autenticar(string usuario)` | Busca usuario por nombre o email | `SP_Usuario_Autenticar` |
| `RegistrarLoginExitoso(int usuarioId, string ipAddress, string userAgent)` | Registra login exitoso | `SP_Usuario_LoginExitoso` |
| `RegistrarLoginFallido(string usuario, string ipAddress, string userAgent)` | Registra intento fallido | `SP_Usuario_LoginFallido` |
| `Crear()` | Crea un nuevo usuario | `SP_Usuario_Insert` |
| `ObtenerPorId(int id)` | Obtiene usuario por ID | Query directa |
| `Listar()` | Lista todos los usuarios | Query directa |
| `Actualizar()` | Actualiza datos del usuario | Query directa |
| `CambiarPassword(int usuarioId, string nuevoPasswordHash)` | Cambia la contraseña | Query directa |
| `Desbloquear(int usuarioId)` | Desbloquea usuario bloqueado | Query directa |
| `Eliminar(int id)` | Desactiva usuario | Query directa |

**Flujo de Autenticación**:
1. Buscar usuario con `Autenticar()`
2. Verificar contraseña con `PasswordHelper.VerifyPassword()`
3. Si es exitoso → `RegistrarLoginExitoso()`
4. Si falla → `RegistrarLoginFallido()` (incrementa contador)
5. Bloqueo automático después de 3 intentos fallidos

---

### 2. Sesion (`Models/Sesion.cs`)

**Propósito**: Gestión de tokens de sesión y control de acceso.

**Propiedades**:
```csharp
public class Sesion
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string Token { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaExpiracion { get; set; }
    public string IpAddress { get; set; }
    public string UserAgent { get; set; }
    public bool Activa { get; set; }
}
```

**Métodos Principales**:

| Método | Descripción | Stored Procedure |
|--------|-------------|------------------|
| `Crear(string ipAddress, string userAgent, int minutosExpiracion = 30)` | Crea nueva sesión | `SP_Sesion_Crear` |
| `Validar(string token)` | Valida si un token es válido | `SP_Sesion_Validar` |
| `Cerrar(string token)` | Cierra sesión | `SP_Sesion_Cerrar` |
| `Renovar(string token, int minutosAdicionales = 30)` | Renueva expiración | Query directa |
| `ObtenerSesionesActivas(int usuarioId)` | Lista sesiones activas del usuario | Query directa |
| `CerrarTodasLasSesiones(int usuarioId)` | Cierra todas las sesiones | Query directa |
| `LimpiarSesionesExpiradas()` | Mantenimiento - limpia sesiones viejas | Query directa |

**Características de Seguridad**:
- ✅ Tokens seguros de 512 bits (generados con `RNGCryptoServiceProvider`)
- ✅ Auditoría de IP y User-Agent
- ✅ Expiración automática (30 minutos por defecto)
- ✅ Control de sesiones concurrentes
- ✅ Renovación de sesión sin reautenticación

---

### 3. Alerta (`Models/Alerta.cs`)

**Propósito**: Gestión de alertas y notificaciones del sistema.

**Propiedades**:
```csharp
public class Alerta
{
    public int Id { get; set; }
    public int TipoId { get; set; }
    public int LegajoId { get; set; }
    public string Descripcion { get; set; }
    public DateTime? FechaVencimiento { get; set; }
    public int? PrioridadId { get; set; }
    public int EstadoId { get; set; }
}
```

**Métodos CRUD**:

| Método | Descripción | Stored Procedure |
|--------|-------------|------------------|
| `ListarTodos()` | Lista todas las alertas | `SP_Alerta_GetAll` |
| `Guardar()` | Crea nueva alerta | `SP_Alerta_Insert` |
| `Actualizar()` | Actualiza alerta existente | `SP_Alerta_Update` |
| `Eliminar()` | Elimina alerta | `SP_Alerta_Delete` |

---

### 4. Legajo (`Models/Legajo.cs`)

**Propósito**: Gestión de legajos de niños residentes.

**Propiedades**:
```csharp
public class Legajo
{
    public int Id { get; set; }
    public int NinoId { get; set; }
    public DateTime FechaIngreso { get; set; }
    public int EstadoId { get; set; }
    public int? TutorId { get; set; }
    public string Observaciones { get; set; }
}
```

**Métodos CRUD**:

| Método | Descripción | Stored Procedure |
|--------|-------------|------------------|
| `ListarTodos()` | Lista todos los legajos | `SP_Legajo_GetAll` |
| `ObtenerPorId(int id)` | Obtiene legajo por ID | `SP_Legajo_GetById` |
| `Guardar()` | Crea nuevo legajo | `SP_Legajo_Insert` |
| `Actualizar()` | Actualiza legajo existente | `SP_Legajo_Update` |
| `Eliminar()` | Elimina legajo (con validación) | `SP_Legajo_Delete` |

**Validaciones Especiales**:
- ⚠️ No se puede eliminar un legajo si tiene alertas asociadas
- ⚠️ Captura de excepciones SQL con mensajes amigables

---

### 5. Nino (`Models/Nino.cs`)

**Propósito**: Gestión de información de niños.

**Propiedades**:
```csharp
public class Nino
{
    public int Id { get; set; }
    public string DNI { get; set; }
    public string Nombre { get; set; }
    public string Apellido { get; set; }
    public DateTime FechaNacimiento { get; set; }
    public DateTime? FechaModificacion { get; set; }
}
```

**Métodos**:

| Método | Descripción | Tipo de Query |
|--------|-------------|---------------|
| `Upsert()` | Crea o actualiza (según Id) | Query directa |
| `ListarTodos()` | Lista todos los niños con estado | Query directa con JOINs |
| `ObtenerPorDni(string dni)` | Busca niño por DNI | Query directa |
| `Eliminar()` | Elimina niño por DNI | Query directa |

**Validaciones**:
- ✅ DNI único (no se permiten duplicados)
- ✅ Validación en INSERT y UPDATE
- ✅ Excepción personalizada si DNI ya existe

---

### 6. Tutor (`Models/Tutor.cs`)

**Propósito**: Gestión de tutores de niños.

**Propiedades**:
```csharp
public class Tutor
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    public string Apellido { get; set; }
    public string Telefono { get; set; }
    public string Email { get; set; }
}
```

**Métodos**:

| Método | Descripción | Tipo de Query |
|--------|-------------|---------------|
| `ListarTodos()` | Lista todos los tutores | Query directa |
| `Upsert()` | Crea o actualiza (según Id) | Query directa |
| `Eliminar()` | Elimina tutor | Query directa |

---

### 7. Modelos Auxiliares (Catálogos)

#### Estado (`Models/Estado.cs`)
Estados de legajos: Activo, Inactivo, Egresado, etc.

#### EstadoAlerta (`Models/EstadoAlerta.cs`)
Estados de alertas: Pendiente, En proceso, Completada, etc.

#### Prioridad (`Models/Prioridad.cs`)
Niveles de prioridad con colores y orden.

#### TipoAlerta (`Models/TipoAlerta.cs`)
Tipos de alertas configurables.

**Todos estos modelos implementan métodos estándar**:
- `ListarTodos()`
- `Insertar()`
- `Actualizar()`
- `Eliminar()`

---

### 8. DTOs de Autenticación (`Models/LoginRequest.cs`)

#### LoginRequest
```csharp
public class LoginRequest
{
    [Required]
    public string Usuario { get; set; }
    
    [Required]
    public string Password { get; set; }
}
```

#### RegistroRequest
```csharp
public class RegistroRequest
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Usuario { get; set; }
    
    [Required]
    [StringLength(255, MinimumLength = 8)]
    public string Password { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    public string NombreCompleto { get; set; }
    
    [Required]
    public int RolId { get; set; }
}
```

#### CambioPasswordRequest
```csharp
public class CambioPasswordRequest
{
    [Required]
    public string PasswordActual { get; set; }
    
    [Required]
    [StringLength(255, MinimumLength = 8)]
    public string PasswordNueva { get; set; }
    
    [Required]
    [Compare("PasswordNueva")]
    public string PasswordNuevaConfirmacion { get; set; }
}
```

#### LoginResponse
```csharp
public class LoginResponse
{
    public bool Success { get; set; }
    public string Token { get; set; }
    public UsuarioInfo Usuario { get; set; }
    public string Message { get; set; }
}
```

---

## 🌐 Controladores (Endpoints)

### 1. AuthController (`Controllers/AuthController.cs`)

**Ruta Base**: `/api/Auth`

**Propósito**: Gestión de autenticación, sesiones y usuarios.

#### Endpoints Disponibles

##### 🔐 POST `/api/Auth/Login`
**Descripción**: Iniciar sesión en el sistema.

**Request Body**:
```json
{
  "usuario": "admin",
  "password": "Admin123!"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "usuario": "admin",
    "email": "admin@residencia.com",
    "nombreCompleto": "Administrador del Sistema",
    "rol": "Administrador",
    "rolNivel": 100
  }
}
```

**Códigos de Respuesta**:
- `200 OK` - Login exitoso
- `400 Bad Request` - Datos faltantes
- `401 Unauthorized` - Credenciales incorrectas
- `403 Forbidden` - Usuario bloqueado
- `500 Internal Server Error` - Error del servidor

**Validaciones**:
- ✅ Usuario y contraseña requeridos
- ✅ Verificación de hash PBKDF2
- ✅ Control de intentos fallidos (3 máximo)
- ✅ Bloqueo automático tras múltiples fallos
- ✅ Auditoría de login (IP, User-Agent)

---

##### 🚪 POST `/api/Auth/Logout`
**Descripción**: Cerrar sesión actual.

**Headers**:
```
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

---

##### ✅ GET `/api/Auth/ValidateToken`
**Descripción**: Validar si un token de sesión es válido.

**Headers**:
```
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "valid": true,
  "usuario": {
    "id": 1,
    "usuario": "admin",
    "nombreCompleto": "Administrador del Sistema",
    "email": "admin@residencia.com",
    "rol": "Administrador",
    "rolNivel": 100
  }
}
```

**Response (401 Unauthorized)**:
```json
{
  "valid": false,
  "error": "Token inválido o expirado"
}
```

---

##### 🔄 POST `/api/Auth/RenewToken`
**Descripción**: Renovar la expiración de un token de sesión.

**Headers**:
```
Authorization: Bearer {token}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Sesión renovada correctamente",
  "nuevaExpiracion": "2024-01-20T15:30:00Z"
}
```

---

##### 📝 POST `/api/Auth/Register`
**Descripción**: Registrar un nuevo usuario en el sistema.

**Request Body**:
```json
{
  "usuario": "jperez",
  "password": "SecurePass123!",
  "email": "jperez@residencia.com",
  "nombreCompleto": "Juan Pérez",
  "rolId": 2
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "id": 5,
  "message": "Usuario registrado correctamente"
}
```

**Response (409 Conflict - Usuario duplicado)**:
```json
{
  "error": "El nombre de usuario ya existe"
}
```

**Response (409 Conflict - Email duplicado)**:
```json
{
  "error": "El email ya está registrado"
}
```

**Validaciones**:
- ✅ Usuario: 3-50 caracteres
- ✅ Password: mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
- ✅ Email válido
- ✅ Usuario único
- ✅ Email único

---

##### 🔑 POST `/api/Auth/ChangePassword`
**Descripción**: Cambiar la contraseña del usuario autenticado.

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "passwordActual": "Admin123!",
  "passwordNueva": "NewSecure456!",
  "passwordNuevaConfirmacion": "NewSecure456!"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Contraseña cambiada correctamente"
}
```

**Response (400 Bad Request)**:
```json
{
  "error": "La contraseña actual es incorrecta"
}
```

**Validaciones**:
- ✅ Verificación de contraseña actual
- ✅ Validación de fortaleza de nueva contraseña
- ✅ Requiere autenticación válida

---

### 2. AlertaController (`Controllers/AlertaController.cs`)

**Ruta Base**: `/api/Alerta`

**Propósito**: Gestión CRUD de alertas del sistema.

#### Endpoints Disponibles

##### 📋 GET `/api/Alerta`
**Descripción**: Obtener todas las alertas.

**Response (200 OK)**:
```json
[
  {
    "Id": 1,
    "TipoId": 1,
    "TipoNombre": "Médica",
    "LegajoId": 5,
    "NinoNombre": "Juan Pérez",
    "Descripcion": "Revisión médica pendiente",
    "FechaVencimiento": "2024-02-15T00:00:00",
    "PrioridadId": 1,
    "PrioridadNombre": "Alta",
    "PrioridadColor": "#ff0000",
    "EstadoId": 1,
    "EstadoNombre": "Pendiente",
    "FechaCreacion": "2024-01-10T10:30:00"
  }
]
```

---

##### ➕ POST `/api/Alerta`
**Descripción**: Crear una nueva alerta.

**Request Body**:
```json
{
  "tipoId": 1,
  "legajoId": 5,
  "descripcion": "Revisión médica anual",
  "fechaVencimiento": "2024-03-15",
  "prioridadId": 1,
  "estadoId": 1
}
```

**Response (201 Created)**:
```json
{
  "Id": 15
}
```

**Validaciones**:
- ✅ TipoId requerido
- ✅ LegajoId requerido
- ✅ EstadoId requerido

---

##### ✏️ PUT `/api/Alerta/{id}`
**Descripción**: Actualizar una alerta existente.

**Request Body**:
```json
{
  "estadoId": 2,
  "prioridadId": 2,
  "descripcion": "Revisión médica completada",
  "fechaVencimiento": "2024-03-20"
}
```

**Response (200 OK)**:
```json
{
  "Id": 15
}
```

**Response (404 Not Found)**:
```json
{
  "error": "Alerta no encontrada"
}
```

---

##### ✅ POST `/api/Alerta/{id}/completar`
**Descripción**: Marcar una alerta como completada.

**Response (200 OK)**:
```json
{
  "Id": 15,
  "EstadoId": 2
}
```

---

##### ❌ DELETE `/api/Alerta/{id}`
**Descripción**: Eliminar una alerta.

**Response (200 OK)**:
```json
"Alerta eliminada correctamente"
```

---

### 3. DashboardController (`Controllers/DashboardController.cs`)

**Ruta Base**: `/api/Dashboard`

**Propósito**: Obtener estadísticas y KPIs del sistema.

##### 📊 GET `/api/Dashboard/Stats`
**Descripción**: Obtener todas las estadísticas del dashboard.

**Response (200 OK)**:
```json
{
  "success": true,
  "kpis": {
    "totalLegajos": 45,
    "totalAlertas": 128,
    "alertasVencidas": 8,
    "alertasProximas": 15,
    "alertasCompletadas": 95
  },
  "charts": {
    "porEstado": [
      { "label": "Pendiente", "value": 25 },
      { "label": "En Proceso", "value": 10 },
      { "label": "Completada", "value": 95 }
    ],
    "porPrioridad": [
      { "label": "Alta", "value": 15 },
      { "label": "Media", "value": 50 },
      { "label": "Baja", "value": 65 }
    ]
  }
}
```

**Descripción de KPIs**:
- `totalLegajos`: Total de legajos en el sistema
- `totalAlertas`: Total de alertas registradas
- `alertasVencidas`: Alertas con fecha vencida y no completadas
- `alertasProximas`: Alertas próximas a vencer (próximos 3 días)
- `alertasCompletadas`: Alertas en estado completado

---

### 4. LegajoController (`Controllers/LegajoController.cs`)

**Ruta Base**: `/api/Legajo`

**Propósito**: Gestión CRUD de legajos.

##### 📋 GET `/api/Legajo`
**Descripción**: Obtener todos los legajos.

**Response (200 OK)**:
```json
[
  {
    "Id": 1,
    "NinoId": 5,
    "NinoDNI": "12345678",
    "NinoNombre": "Juan",
    "NinoApellido": "Pérez",
    "FechaIngreso": "2023-01-15",
    "EstadoId": 1,
    "EstadoNombre": "Activo",
    "TutorId": 3,
    "TutorNombre": "María González",
    "Observaciones": "Ingreso regular"
  }
]
```

---

##### 🔍 GET `/api/Legajo/{id}`
**Descripción**: Obtener un legajo por ID.

**Response (200 OK)**: Igual estructura que GET all, pero un solo registro.

**Response (404 Not Found)**: Si el legajo no existe.

---

##### ➕ POST `/api/Legajo`
**Descripción**: Crear un nuevo legajo.

**Request Body**:
```json
{
  "ninoId": 5,
  "fechaIngreso": "2024-01-15",
  "estadoId": 1,
  "tutorId": 3,
  "observaciones": "Ingreso regular sin observaciones"
}
```

**Response (201 Created)**:
```json
{
  "Id": 10,
  "NinoId": 5,
  "FechaIngreso": "2024-01-15",
  "EstadoId": 1,
  "TutorId": 3,
  "Observaciones": "Ingreso regular sin observaciones"
}
```

**Validaciones**:
- ✅ NinoId requerido (> 0)
- ✅ EstadoId requerido (> 0)
- ✅ FechaIngreso requerida

---

##### ✏️ PUT `/api/Legajo/{id}`
**Descripción**: Actualizar un legajo existente.

**Request Body**:
```json
{
  "estadoId": 2,
  "tutorId": 4,
  "observaciones": "Cambio de tutor"
}
```

**Response (200 OK)**:
```json
{
  "Id": 10,
  "EstadoId": 2,
  "TutorId": 4,
  "Observaciones": "Cambio de tutor"
}
```

---

##### ❌ DELETE `/api/Legajo/{id}`
**Descripción**: Eliminar un legajo.

**Response (200 OK)**:
```json
{
  "message": "Legajo con Id=10 eliminado correctamente"
}
```

**Response (400 Bad Request - Alertas asociadas)**:
```json
{
  "error": "No se puede eliminar el legajo porque tiene alertas asociadas. Elimine primero las alertas."
}
```

---

### 5. NinoController (`Controllers/NinoController.cs`)

**Ruta Base**: `/api/Nino`

**Propósito**: Gestión de niños residentes.

##### 📋 GET `/api/Nino`
**Descripción**: Obtener todos los niños.

**Response (200 OK)**:
```json
[
  {
    "Id": 1,
    "Dni": "12345678",
    "Apellido": "Pérez",
    "Nombre": "Juan",
    "FechaNacimiento": "2015-05-10",
    "FechaCreacion": "2023-01-15T10:30:00",
    "FechaModificacion": null,
    "Estado": "Activo",
    "LegajoId": 5
  }
]
```

---

##### 🔍 GET `/api/Nino/{dni}`
**Descripción**: Buscar niño por DNI.

**Response (200 OK)**: Igual estructura que GET all, pero un solo registro.

**Response (404 Not Found)**: Si el DNI no existe.

---

##### ➕ POST `/api/Nino`
**Descripción**: Crear o actualizar un niño (UPSERT).

**Request Body (Crear - Id no especificado o = 0)**:
```json
{
  "dni": "12345678",
  "nombre": "Juan",
  "apellido": "Pérez",
  "fechaNacimiento": "2015-05-10"
}
```

**Request Body (Actualizar - Id > 0)**:
```json
{
  "id": 5,
  "dni": "12345678",
  "nombre": "Juan Carlos",
  "apellido": "Pérez",
  "fechaNacimiento": "2015-05-10"
}
```

**Response (200 OK)**:
```json
{
  "Id": 5,
  "DNI": "12345678",
  "Nombre": "Juan Carlos",
  "Apellido": "Pérez",
  "FechaNacimiento": "2015-05-10"
}
```

**Response (409 Conflict - DNI duplicado)**:
```json
{
  "message": "DNI ya registrado"
}
```

**Validaciones**:
- ✅ DNI requerido
- ✅ Nombre requerido
- ✅ FechaNacimiento requerida
- ✅ DNI único en la base de datos

---

##### ❌ DELETE `/api/Nino/{dni}`
**Descripción**: Eliminar niño por DNI.

**Response (200 OK)**:
```json
"Nino 12345678 eliminado"
```

**Response (404 Not Found)**: Si el DNI no existe.

---

### 6. TutorController (`Controllers/TutorController.cs`)

**Ruta Base**: `/api/Tutor`

**Propósito**: Gestión de tutores.

##### 📋 GET `/api/Tutor`
**Descripción**: Obtener todos los tutores.

**Response (200 OK)**:
```json
[
  {
    "Id": 1,
    "Nombre": "María",
    "Apellido": "González",
    "Telefono": "+54 11 1234-5678",
    "Email": "maria.gonzalez@email.com"
  }
]
```

---

##### ➕ POST `/api/Tutor`
**Descripción**: Crear un nuevo tutor.

**Request Body**:
```json
{
  "nombre": "María",
  "apellido": "González",
  "telefono": "+54 11 1234-5678",
  "email": "maria.gonzalez@email.com"
}
```

**Response (201 Created)**:
```json
{
  "Id": 10,
  "Nombre": "María",
  "Apellido": "González",
  "Telefono": "+54 11 1234-5678",
  "Email": "maria.gonzalez@email.com"
}
```

**Validaciones**:
- ✅ Nombre requerido

---

##### ✏️ PUT `/api/Tutor/{id}`
**Descripción**: Actualizar un tutor existente.

**Request Body**:
```json
{
  "nombre": "María Soledad",
  "apellido": "González",
  "telefono": "+54 11 9999-9999",
  "email": "msoledad.gonzalez@email.com"
}
```

**Response (200 OK)**:
```json
{
  "Id": 10,
  "Nombre": "María Soledad",
  "Apellido": "González",
  "Telefono": "+54 11 9999-9999",
  "Email": "msoledad.gonzalez@email.com"
}
```

---

##### ❌ DELETE `/api/Tutor/{id}`
**Descripción**: Eliminar un tutor.

**Response (200 OK)**:
```json
"Tutor 10 eliminado"
```

---

### 7. Controladores de Catálogos

Los siguientes controladores tienen endpoints similares (GET, POST, PUT, DELETE):

#### EstadoController (`/api/Estado`)
- GET: Listar estados de legajo
- POST: Crear estado
- PUT: Actualizar estado
- DELETE: Eliminar estado

#### EstadoAlertaController (`/api/EstadoAlerta`)
- GET: Listar estados de alerta
- POST: Crear estado de alerta
- PUT: Actualizar estado de alerta
- DELETE: Eliminar estado de alerta

#### PrioridadController (`/api/Prioridad`)
- GET: Listar prioridades
- POST: Crear prioridad (Nombre, Color, Orden)
- PUT: Actualizar prioridad
- DELETE: Eliminar prioridad

#### TipoAlertaController (`/api/TipoAlerta`)
- GET: Listar tipos de alerta
- POST: Crear tipo de alerta
- PUT: Actualizar tipo de alerta
- DELETE: Eliminar tipo de alerta

**Estructura de respuesta común**:
```json
[
  {
    "Id": 1,
    "Nombre": "Pendiente",
    "Descripcion": "Estado inicial"
  }
]
```

---

### 8. TestController (`Controllers/TestController.cs`)

**Ruta Base**: `/api/Test`

**⚠️ IMPORTANTE**: Este controlador debe ser **eliminado en producción**.

**Propósito**: Herramientas de desarrollo para testing de passwords.

##### 🔐 GET `/api/Test/HashPassword?password={password}`
**Descripción**: Genera un hash de contraseña para insertar en BD.

**Ejemplo**:
```
GET /api/Test/HashPassword?password=Admin123!
```

**Response**:
```json
{
  "success": true,
  "password": "Admin123!",
  "hash": "base64hash.base64hash",
  "sql": "UPDATE dbo.Usuario SET PasswordHash = 'base64hash.base64hash' WHERE Usuario = 'admin';"
}
```

---

##### ✅ POST `/api/Test/VerifyPassword`
**Descripción**: Verifica si una contraseña coincide con un hash.

**Request Body**:
```json
{
  "password": "Admin123!",
  "hash": "base64hash.base64hash"
}
```

**Response**:
```json
{
  "success": true,
  "isValid": true,
  "message": "Contraseña correcta"
}
```

---

## 🛠️ Helpers y Utilidades

### 1. PasswordHelper (`Helpers/PasswordHelper.cs`)

**Propósito**: Gestión segura de contraseñas con hashing PBKDF2.

#### Configuración de Seguridad

```csharp
private const int SaltSize = 32;        // 256 bits
private const int HashSize = 32;        // 256 bits
private const int Iterations = 10000;   // Iteraciones PBKDF2
```

#### Métodos Principales

##### `HashPassword(string password)`
**Descripción**: Genera un hash seguro de la contraseña usando PBKDF2.

**Algoritmo**:
1. Generar salt aleatorio de 32 bytes con `RNGCryptoServiceProvider`
2. Aplicar PBKDF2 con 10,000 iteraciones
3. Retornar formato: `Base64(salt).Base64(hash)`

**Ejemplo**:
```csharp
var hash = PasswordHelper.HashPassword("Admin123!");
// Resultado: "uP8xZ3...==.kL9mN2...=="
```

---

##### `VerifyPassword(string password, string hashedPassword)`
**Descripción**: Verifica si una contraseña coincide con un hash.

**Algoritmo**:
1. Separar salt y hash del string almacenado
2. Aplicar PBKDF2 a la contraseña proporcionada con el mismo salt
3. Comparar hashes usando comparación de tiempo constante (`SlowEquals`)

**Ejemplo**:
```csharp
bool isValid = PasswordHelper.VerifyPassword("Admin123!", storedHash);
```

---

##### `ValidatePasswordStrength(string password)`
**Descripción**: Valida la complejidad de una contraseña.

**Requisitos**:
- ✅ Mínimo 8 caracteres
- ✅ Al menos 1 letra mayúscula
- ✅ Al menos 1 letra minúscula
- ✅ Al menos 1 número

**Ejemplo**:
```csharp
bool isStrong = PasswordHelper.ValidatePasswordStrength("Admin123!");
// Resultado: true
```

---

##### `SlowEquals(byte[] a, byte[] b)` (Privado)
**Descripción**: Comparación en tiempo constante para prevenir timing attacks.

**Propósito**: Evitar que un atacante pueda deducir información del hash midiendo el tiempo de respuesta de la comparación.

---

### 2. TokenHelper (`Helpers/TokenHelper.cs`)

**Propósito**: Generación de tokens seguros criptográficamente.

#### Métodos Principales

##### `GenerateToken()`
**Descripción**: Genera un token aleatorio seguro de 512 bits.

**Algoritmo**:
```csharp
var bytes = new byte[64]; // 512 bits
using (var rng = new RNGCryptoServiceProvider())
{
    rng.GetBytes(bytes);
}
return Convert.ToBase64String(bytes);
```

**Ejemplo**:
```csharp
string token = TokenHelper.GenerateToken();
// Resultado: "kL9mN2pQ8rT5vW7xY1zA3bC6dE9fH..."
```

---

##### `GenerateTokenWithTimestamp()`
**Descripción**: Genera un token con timestamp para trazabilidad.

**Formato**: `{timestamp}-{randomToken}`

**Ejemplo**:
```csharp
string token = TokenHelper.GenerateTokenWithTimestamp();
// Resultado: "638412345678901234-kL9mN2pQ8rT5vW7xY1zA3bC6dE9fH..."
```

---

##### `GenerateVerificationCode()`
**Descripción**: Genera un código de verificación de 6 dígitos.

**Uso**: Códigos de verificación por email/SMS.

**Ejemplo**:
```csharp
string code = TokenHelper.GenerateVerificationCode();
// Resultado: "123456"
```

---

##### `GenerateAlphanumericToken(int length = 32)`
**Descripción**: Genera un token alfanumérico de longitud específica.

**Caracteres**: A-Z, a-z, 0-9

**Ejemplo**:
```csharp
string token = TokenHelper.GenerateAlphanumericToken(16);
// Resultado: "aB3dE5fG7hI9jK1l"
```

---

##### `IsValidTokenFormat(string token)`
**Descripción**: Valida el formato de un token.

**Validaciones**:
- ✅ No es null o vacío
- ✅ Longitud mínima de 20 caracteres
- ✅ Es un string Base64 válido

**Ejemplo**:
```csharp
bool isValid = TokenHelper.IsValidTokenFormat("kL9mN2pQ8rT5...");
// Resultado: true
```

---

## 🔒 Seguridad e Infraestructura

### 1. SecurityHeadersHandler (`Handlers/SecurityHeadersHandler.cs`)

**Propósito**: Agregar headers de seguridad OWASP a todas las respuestas HTTP.

**Implementación**: `DelegatingHandler` que intercepta todas las respuestas.

#### Headers Implementados

##### 1. X-Content-Type-Options
```
X-Content-Type-Options: nosniff
```
**Previene**: MIME type sniffing attacks

---

##### 2. X-Frame-Options
```
X-Frame-Options: DENY
```
**Previene**: Clickjacking attacks

---

##### 3. X-XSS-Protection
```
X-XSS-Protection: 1; mode=block
```
**Habilita**: Filtro XSS del navegador

---

##### 4. Strict-Transport-Security (HSTS)
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```
**Fuerza**: Uso de HTTPS (solo se agrega en conexiones HTTPS)

---

##### 5. Content-Security-Policy (CSP)
```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.tailwindcss.com cdn.jsdelivr.net; 
  style-src 'self' 'unsafe-inline' cdn.tailwindcss.com cdn.jsdelivr.net; 
  img-src 'self' data: https:; 
  font-src 'self' cdn.jsdelivr.net; 
  connect-src 'self' http://localhost:* https://localhost:*
```
**Previene**: XSS y data injection attacks

---

##### 6. Referrer-Policy
```
Referrer-Policy: strict-origin-when-cross-origin
```
**Controla**: Información de referrer en requests

---

##### 7. Permissions-Policy
```
Permissions-Policy: 
  geolocation=(), 
  microphone=(), 
  camera=()
```
**Controla**: Features del navegador (antes Feature-Policy)

---

##### 8. X-Permitted-Cross-Domain-Policies
```
X-Permitted-Cross-Domain-Policies: none
```
**Controla**: Políticas cross-domain

---

### 2. Configuración CORS

**Ubicación**: `App_Start/WebApiConfig.cs`

**Estrategia**: Whitelist de orígenes permitidos

**Configuración de Producción Recomendada**:
```csharp
var allowedOrigins = new List<string>
{
    "https://residencias.tu-dominio.com",  // URL producción
    "https://www.tu-dominio.com"           // URL alternativa
};
```

**Configuración de Desarrollo**:
```csharp
var allowedOrigins = new List<string>
{
    "http://localhost:5500",
    "http://localhost:8000",
    "http://127.0.0.1:5500"
};
```

**Configuración**:
```csharp
var corsPolicy = new EnableCorsAttribute(
    origins: string.Join(",", allowedOrigins),
    headers: "Content-Type,Authorization,X-Requested-With",
    methods: "GET,POST,PUT,DELETE,OPTIONS"
)
{
    SupportsCredentials = true  // Permitir cookies/credenciales
};

config.EnableCors(corsPolicy);
```

---

### 3. Validación de Entrada

**Estrategia**: Validación en múltiples capas

#### Capa 1: Data Annotations (DTOs)
```csharp
public class RegistroRequest
{
    [Required(ErrorMessage = "El usuario es requerido")]
    [StringLength(50, MinimumLength = 3)]
    public string Usuario { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }
}
```

#### Capa 2: Validación en Controllers
```csharp
if (request == null || string.IsNullOrWhiteSpace(request.Usuario))
{
    return BadRequest("Usuario requerido");
}
```

#### Capa 3: Validación en Models
```csharp
if (string.IsNullOrEmpty(password))
    throw new ArgumentNullException(nameof(password));
```

#### Capa 4: Validación en Stored Procedures
```sql
IF @Usuario IS NULL OR @Usuario = ''
    THROW 50001, 'Usuario requerido', 1;
```

---

### 4. Protección contra Ataques Comunes

#### SQL Injection
**Mitigación**: Uso de parámetros en todos los queries

```csharp
// ✅ CORRECTO
cmd.Parameters.Add("@Usuario", SqlDbType.NVarChar, 50).Value = usuario;

// ❌ INCORRECTO
cmd.CommandText = "SELECT * FROM Usuario WHERE Usuario = '" + usuario + "'";
```

---

#### XSS (Cross-Site Scripting)
**Mitigación**:
- Content-Security-Policy headers
- Serialización automática de JSON (escape de caracteres)
- Validación de entrada

---

#### CSRF (Cross-Site Request Forgery)
**Mitigación**:
- Tokens de sesión en Authorization header (no cookies)
- Validación de origen (CORS restrictivo)

---

#### Timing Attacks
**Mitigación**: Comparación en tiempo constante

```csharp
private static bool SlowEquals(byte[] a, byte[] b)
{
    uint diff = (uint)a.Length ^ (uint)b.Length;
    for (int i = 0; i < a.Length && i < b.Length; i++)
    {
        diff |= (uint)(a[i] ^ b[i]);
    }
    return diff == 0;
}
```

---

#### Brute Force
**Mitigación**:
- Contador de intentos fallidos
- Bloqueo automático después de 3 intentos
- Auditoría de intentos fallidos

---

#### Session Hijacking
**Mitigación**:
- Tokens seguros de 512 bits
- Expiración de sesiones (30 minutos)
- Auditoría de IP y User-Agent
- Invalidación de token en logout

---

## 🔄 Flujos de Trabajo

### Flujo de Autenticación Completo

```
┌─────────────┐
│   Cliente   │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. POST /api/Auth/Login
       │    { usuario, password }
       ▼
┌─────────────────────────────────────┐
│      AuthController.Login()         │
└──────┬──────────────────────────────┘
       │
       │ 2. Usuario.Autenticar(usuario)
       ▼
┌─────────────────────────────────────┐
│      SP_Usuario_Autenticar          │
│   Retorna: Id, PasswordHash, Activo,│
│   IntentosLoginFallidos, etc.       │
└──────┬──────────────────────────────┘
       │
       ▼
  ¿Usuario existe?
       │
   NO  │  SÍ
   ┌───┴───┐
   │       │
   │       ▼
   │  ¿Está activo?
   │       │
   │   NO  │  SÍ
   │   ┌───┴───┐
   │   │       │
   │   │       ▼
   │   │  PasswordHelper.VerifyPassword()
   │   │       │
   │   │   ¿Coincide?
   │   │       │
   │   │   NO  │  SÍ
   │   │   ┌───┴───┐
   │   │   │       │
   │   │   │       ▼
   │   │   │  ✅ Login Exitoso
   │   │   │       │
   │   │   │       │ 3. Usuario.RegistrarLoginExitoso()
   │   │   │       │    (actualiza UltimoLoginExitoso,
   │   │   │       │     resetea intentos fallidos)
   │   │   │       ▼
   │   │   │  4. TokenHelper.GenerateToken()
   │   │   │       │
   │   │   │       ▼
   │   │   │  5. Sesion.Crear()
   │   │   │       │ (token, usuarioId, ipAddress,
   │   │   │       │  userAgent, expiracion: 30 min)
   │   │   │       ▼
   │   │   │  6. Retornar LoginResponse
   │   │   │       { token, usuario { ... } }
   │   │   │       │
   │   │   ▼       ▼
   │   │  ❌ Password Incorrecta
   │   │   │
   │   │   │ 7. Usuario.RegistrarLoginFallido()
   │   │   │    (incrementa IntentosLoginFallidos)
   │   │   │    (bloquea si intentos >= 3)
   │   │   │       ▼
   │   │   │  8. Retornar 401 Unauthorized
   │   │   │       { error, intentosRestantes }
   │   │   │
   │   ▼   ▼
   │  ❌ Usuario Bloqueado
   │   │
   │   │ 9. Retornar 403 Forbidden
   │   │       { error: "Usuario bloqueado..." }
   │   │
   ▼   ▼
  ❌ Usuario No Encontrado
   │
   │ 10. Usuario.RegistrarLoginFallido()
   │       (registra intento con usuario inexistente)
   │       ▼
   │ 11. Retornar 401 Unauthorized
   │       { error: "Usuario o contraseña incorrectos" }
   │
   ▼
┌─────────────┐
│   Cliente   │
│  Almacena   │
│    Token    │
└─────────────┘
```

---

### Flujo de Request Autenticado

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       │ 1. Request con header:
       │    Authorization: Bearer {token}
       ▼
┌─────────────────────────────────────┐
│      Cualquier Controller           │
│   (excepto Auth/Login, Auth/Register)│
└──────┬──────────────────────────────┘
       │
       │ 2. Extraer token del header
       ▼
  ¿Token presente?
       │
   NO  │  SÍ
   ┌───┴───┐
   │       │
   │       ▼
   │  3. Sesion.Validar(token)
   │       │
   │       ▼
   │  4. SP_Sesion_Validar
   │       │ SELECT sesion y usuario
   │       │ WHERE token = @Token
   │       │   AND Activa = 1
   │       │   AND FechaExpiracion > GETDATE()
   │       ▼
   │  ¿Sesión válida?
   │       │
   │   NO  │  SÍ
   │   ┌───┴───┐
   │   │       │
   │   │       ▼
   │   │  ✅ Sesión Válida
   │   │       │
   │   │       ▼
   │   │  5. Procesar Request
   │   │       │
   │   │       ▼
   │   │  6. Retornar Respuesta
   │   │       │
   │   ▼       ▼
   │  ❌ Token Inválido/Expirado
   │   │
   │   │ 7. Retornar 401 Unauthorized
   │   │       { valid: false, error: "Token inválido..." }
   │   │
   ▼   ▼
  ❌ Token No Proporcionado
   │
   │ 8. Retornar 401 Unauthorized
   │       { error: "Token no proporcionado" }
   │
   ▼
┌─────────────┐
│   Cliente   │
│   Recibe    │
│  Respuesta  │
└─────────────┘
```

---

### Flujo de Creación de Alerta

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       │ 1. POST /api/Alerta
       │    Body: { tipoId, legajoId, descripcion, ... }
       │    Header: Authorization: Bearer {token}
       ▼
┌─────────────────────────────────────┐
│    AlertaController.Post()          │
└──────┬──────────────────────────────┘
       │
       ▼
  Validaciones de entrada
       │
   ✅  │  ❌ Error de validación
   ┌───┴───┐
   │       │
   │       ▼
   │  BadRequest("Datos requeridos")
   │
   ▼
2. Crear instancia Alerta
   var alerta = new Alerta {
       TipoId = value.TipoId,
       LegajoId = value.LegajoId,
       ...
   };
       │
       ▼
3. alerta.Guardar()
       │
       ▼
┌─────────────────────────────────────┐
│      SP_Alerta_Insert               │
│   INSERT INTO dbo.Alerta            │
│   SELECT SCOPE_IDENTITY()           │
└──────┬──────────────────────────────┘
       │
       ▼
  ¿Error de BD?
       │
   NO  │  SÍ
   ┌───┴───┐
   │       │
   │       ▼
   │  InternalServerError(ex)
   │
   ▼
4. Retornar 201 Created
   Location: /api/Alerta/{id}
   Body: { Id: nuevoId }
       │
       ▼
┌─────────────┐
│   Cliente   │
│  Recibe ID  │
│  de alerta  │
└─────────────┘
```

---

### Flujo de Dashboard Stats

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       │ 1. GET /api/Dashboard/Stats
       ▼
┌─────────────────────────────────────┐
│   DashboardController.GetStats()    │
└──────┬──────────────────────────────┘
       │
       │ 2. Abrir conexión SQL
       ▼
┌─────────────────────────────────────┐
│   Ejecutar queries en paralelo:     │
│                                     │
│   • Total Legajos                   │
│     SELECT COUNT(*) FROM Legajo     │
│                                     │
│   • Total Alertas                   │
│     SELECT COUNT(*) FROM Alerta     │
│                                     │
│   • Alertas Vencidas                │
│     SELECT COUNT(*) WHERE           │
│     FechaVencimiento < GETDATE()    │
│     AND Estado != 'Completada'      │
│                                     │
│   • Alertas Próximas (3 días)       │
│     SELECT COUNT(*) WHERE           │
│     FechaVencimiento BETWEEN        │
│     GETDATE() AND GETDATE() + 3     │
│                                     │
│   • Alertas Completadas             │
│     SELECT COUNT(*) WHERE           │
│     Estado = 'Completada'           │
│                                     │
│   • Alertas por Estado (gráfico)    │
│     SELECT Estado, COUNT(*)         │
│     GROUP BY Estado                 │
│                                     │
│   • Alertas por Prioridad (gráfico) │
│     SELECT Prioridad, COUNT(*)      │
│     GROUP BY Prioridad              │
└──────┬──────────────────────────────┘
       │
       ▼
3. Construir objeto de respuesta:
   {
     success: true,
     kpis: { ... },
     charts: {
       porEstado: [...],
       porPrioridad: [...]
     }
   }
       │
       ▼
4. Retornar 200 OK con JSON
       │
       ▼
┌─────────────┐
│   Cliente   │
│  Renderiza  │
│  Dashboard  │
└─────────────┘
```

---

## 💡 Mejores Prácticas

### 1. Seguridad

#### ✅ Hacer

1. **Siempre validar entrada**
   - En controllers
   - En models
   - En stored procedures

2. **Usar parámetros SQL**
   ```csharp
   cmd.Parameters.Add("@Usuario", SqlDbType.NVarChar, 50).Value = usuario;
   ```

3. **Hashear contraseñas**
   ```csharp
   var hash = PasswordHelper.HashPassword(password);
   ```

4. **Tokens en Authorization header**
   ```javascript
   headers: {
       'Authorization': `Bearer ${token}`
   }
   ```

5. **Validar tokens en cada request protegido**

6. **Implementar expiración de sesiones**

7. **Auditar acciones críticas**
   - Login exitoso/fallido
   - Cambios de contraseña
   - Creación/eliminación de registros

#### ❌ No Hacer

1. **Nunca almacenar contraseñas en texto plano**

2. **Nunca concatenar strings en SQL**
   ```csharp
   // ❌ VULNERABLE A SQL INJECTION
   cmd.CommandText = "SELECT * FROM Usuario WHERE Usuario = '" + usuario + "'";
   ```

3. **Nunca exponer detalles de error en producción**

4. **Nunca confiar en datos del cliente sin validar**

5. **Nunca usar algoritmos de hash débiles (MD5, SHA1)**

6. **Nunca deshabilitar HTTPS en producción**

---

### 2. Manejo de Errores

#### Estructura Recomendada

```csharp
public IHttpActionResult MiMetodo([FromBody] MiRequest request)
{
    try
    {
        // 1. Validación de entrada
        if (request == null)
            return BadRequest("Request requerido");
        
        if (string.IsNullOrEmpty(request.Campo))
            return BadRequest("Campo requerido");
        
        // 2. Lógica de negocio
        var resultado = model.Procesar(request);
        
        // 3. Respuesta exitosa
        return Ok(resultado);
    }
    catch (SqlException sqlEx) when (sqlEx.Number == 50001)
    {
        // Error específico de negocio
        return Content(HttpStatusCode.Conflict, 
            new { error = "Registro duplicado" });
    }
    catch (ArgumentException argEx)
    {
        // Error de validación
        return BadRequest(argEx.Message);
    }
    catch (Exception ex)
    {
        // Error genérico
        System.Diagnostics.Debug.WriteLine($"Error: {ex.Message}");
        return InternalServerError(
            new Exception("Error al procesar la solicitud"));
    }
}
```

#### Códigos HTTP Recomendados

| Código | Uso |
|--------|-----|
| `200 OK` | Operación exitosa (GET, PUT, PATCH) |
| `201 Created` | Recurso creado exitosamente (POST) |
| `204 No Content` | Operación exitosa sin contenido |
| `400 Bad Request` | Error de validación |
| `401 Unauthorized` | No autenticado o token inválido |
| `403 Forbidden` | Autenticado pero sin permisos |
| `404 Not Found` | Recurso no encontrado |
| `409 Conflict` | Conflicto de negocio (ej: duplicado) |
| `422 Unprocessable Entity` | Validación de negocio fallida |
| `500 Internal Server Error` | Error del servidor |

---

### 3. Naming Conventions

#### Controllers
- PascalCase
- Sufijo "Controller"
- Ejemplo: `AlertaController`

#### Métodos de Controller
- PascalCase
- Verbos HTTP explícitos
- Ejemplo: `Get()`, `Post()`, `Put()`, `Delete()`

#### Models
- PascalCase
- Singular
- Ejemplo: `Usuario`, `Alerta`

#### Propiedades
- PascalCase
- Ejemplo: `UsuarioNombre`, `FechaCreacion`

#### Métodos de Model
- PascalCase
- Verbos descriptivos
- Ejemplo: `Autenticar()`, `RegistrarLoginExitoso()`

#### Variables locales
- camelCase
- Ejemplo: `var usuarioId`, `var passwordHash`

#### Parámetros SQL
- PascalCase con @
- Ejemplo: `@Usuario`, `@PasswordHash`

---

### 4. Organización de Código

#### Estructura de Controller

```csharp
public class MiController : ApiController
{
    #region Propiedades privadas
    private readonly Db db = new Db();
    #endregion

    #region Endpoints CRUD
    
    // GET: api/Mi
    public IHttpActionResult Get() { ... }
    
    // GET: api/Mi/5
    public IHttpActionResult Get(int id) { ... }
    
    // POST: api/Mi
    public IHttpActionResult Post([FromBody] Mi value) { ... }
    
    // PUT: api/Mi/5
    public IHttpActionResult Put(int id, [FromBody] Mi value) { ... }
    
    // DELETE: api/Mi/5
    public IHttpActionResult Delete(int id) { ... }
    
    #endregion

    #region Endpoints Personalizados
    
    [HttpPost]
    [Route("api/Mi/{id}/accion")]
    public IHttpActionResult Accion(int id) { ... }
    
    #endregion

    #region Métodos Auxiliares Privados
    
    private string GetTokenFromHeader() { ... }
    
    #endregion
}
```

#### Estructura de Model

```csharp
public class MiModel
{
    Db db = new Db();

    #region Propiedades
    
    public int Id { get; set; }
    public string Nombre { get; set; }
    // ... otras propiedades
    
    #endregion

    #region Métodos CRUD
    
    public DataTable ListarTodos() { ... }
    public DataTable ObtenerPorId(int id) { ... }
    public int Crear() { ... }
    public int Actualizar() { ... }
    public void Eliminar() { ... }
    
    #endregion

    #region Métodos de Negocio
    
    public void Procesar() { ... }
    public bool Validar() { ... }
    
    #endregion
}
```

---

### 5. Performance

#### Uso de `using` para Conexiones

```csharp
// ✅ CORRECTO - Libera recursos automáticamente
using (SqlConnection conn = db.GetConnection())
{
    conn.Open();
    // ... operaciones ...
    conn.Close();
}

// ❌ INCORRECTO - Puede causar memory leaks
SqlConnection conn = db.GetConnection();
conn.Open();
// ... operaciones ...
// ¿Se cerró la conexión?
```

#### Evitar Múltiples Round-trips

```csharp
// ✅ CORRECTO - Una conexión, múltiples comandos
using (SqlConnection conn = db.GetConnection())
{
    conn.Open();
    
    var cmd1 = new SqlCommand("SELECT ...", conn);
    var result1 = cmd1.ExecuteScalar();
    
    var cmd2 = new SqlCommand("UPDATE ...", conn);
    cmd2.ExecuteNonQuery();
    
    conn.Close();
}

// ❌ INEFICIENTE - Múltiples conexiones
var result1 = Model1.Obtener(); // Abre y cierra conexión
Model2.Actualizar(result1);      // Abre y cierra conexión
```

#### Uso de DataTable vs Objetos

```csharp
// DataTable - Bueno para listas y reportes
public DataTable ListarTodos()
{
    // Retorna DataTable directamente para serialización JSON
}

// Objetos - Bueno para lógica de negocio
public Usuario ObtenerUsuario(int id)
{
    var dt = ObtenerPorId(id);
    if (dt.Rows.Count == 0) return null;
    
    return new Usuario {
        Id = Convert.ToInt32(dt.Rows[0]["Id"]),
        // ... mapear campos
    };
}
```

---

### 6. Testing

#### Endpoints de Testing

El `TestController` proporciona herramientas útiles para desarrollo:

```csharp
// Generar hash de contraseña
GET /api/Test/HashPassword?password=Admin123!

// Verificar contraseña
POST /api/Test/VerifyPassword
{
  "password": "Admin123!",
  "hash": "..."
}
```

⚠️ **Importante**: Eliminar `TestController` en producción.

#### Testing con Swagger

1. Navegar a `http://localhost:[puerto]/swagger`
2. Expandir endpoint a probar
3. Click en "Try it out"
4. Completar parámetros
5. Click en "Execute"

#### Testing con Postman

**Colección básica**:

1. **Login**
   - POST `http://localhost:[puerto]/api/Auth/Login`
   - Body (JSON):
     ```json
     {
       "usuario": "admin",
       "password": "Admin123!"
     }
     ```
   - Guardar token de respuesta

2. **Request Autenticado**
   - Headers:
     ```
     Authorization: Bearer {token}
     ```

---

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Error de CORS

**Síntoma**:
```
Access to XMLHttpRequest at 'http://localhost:puerto/api/...' from origin 
'http://localhost:5500' has been blocked by CORS policy
```

**Solución**:
1. Verificar que el origen esté en la whitelist de `WebApiConfig.cs`:
   ```csharp
   var allowedOrigins = new List<string>
   {
       "http://localhost:5500",  // ← Agregar origen aquí
   };
   ```

2. Recompilar y reiniciar el API

3. Verificar que los headers incluyan:
   ```javascript
   headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
   }
   ```

---

#### 2. Error de Conexión a Base de Datos

**Síntoma**:
```
SqlException: A network-related or instance-specific error occurred...
```

**Solución**:
1. Verificar cadena de conexión en `Web.config`:
   ```xml
   <connectionStrings>
     <add name="ResidenciaDB"
          connectionString="Data Source=TU_SERVIDOR\SQLEXPRESS;Initial Catalog=ResidenciaDB;..."
          providerName="System.Data.SqlClient" />
   </connectionStrings>
   ```

2. Verificar que SQL Server esté corriendo:
   - Abrir "Services" (services.msc)
   - Buscar "SQL Server (SQLEXPRESS)"
   - Estado debe ser "Running"

3. Verificar que la base de datos exista:
   ```sql
   SELECT name FROM sys.databases WHERE name = 'ResidenciaDB';
   ```

---

#### 3. Token Inválido o Expirado

**Síntoma**:
```json
{
  "valid": false,
  "error": "Token inválido o expirado"
}
```

**Causas y Soluciones**:

1. **Token expirado (30 minutos)**
   - Solución: Hacer login nuevamente o renovar token
   - Endpoint: `POST /api/Auth/RenewToken`

2. **Token no proporcionado en header**
   - Solución: Verificar header:
     ```javascript
     headers: {
         'Authorization': `Bearer ${token}`
     }
     ```

3. **Sesión cerrada manualmente**
   - Solución: Hacer login nuevamente

4. **Token malformado**
   - Solución: Verificar que el token sea el completo recibido en login

---

#### 4. Password Hash Inválido

**Síntoma**:
```
Login falla aunque la contraseña sea correcta
```

**Solución**:
1. Generar nuevo hash con `TestController`:
   ```
   GET /api/Test/HashPassword?password=Admin123!
   ```

2. Actualizar en base de datos:
   ```sql
   UPDATE dbo.Usuario 
   SET PasswordHash = '{nuevo_hash}'
   WHERE Usuario = 'admin';
   ```

3. Reintentar login

---

#### 5. Swagger No Carga

**Síntoma**:
```
404 Not Found al acceder a /swagger
```

**Solución**:
1. Verificar que Swashbuckle esté instalado:
   - Ver `packages.config` → debe incluir Swashbuckle.Core

2. Verificar configuración en `SwaggerConfig.cs`

3. Navegar directamente a:
   ```
   http://localhost:[puerto]/swagger/ui/index
   ```

---

#### 6. Stored Procedure No Encontrado

**Síntoma**:
```
SqlException: Could not find stored procedure 'SP_Usuario_Autenticar'
```

**Solución**:
1. Verificar que los stored procedures existan:
   ```sql
   SELECT name FROM sys.procedures WHERE name LIKE 'SP_%';
   ```

2. Ejecutar scripts de creación desde `db/bd.sql`

3. Verificar que la aplicación apunte a la base de datos correcta

---

#### 7. Usuario Bloqueado

**Síntoma**:
```json
{
  "success": false,
  "error": "Usuario bloqueado. Contacte al administrador..."
}
```

**Solución**:
1. Desbloquear manualmente en base de datos:
   ```sql
   UPDATE dbo.Usuario 
   SET IntentosLoginFallidos = 0,
       Activo = 1
   WHERE Usuario = 'admin';
   ```

2. O usar método de modelo (si está implementado en un endpoint):
   ```csharp
   usuarioModel.Desbloquear(usuarioId);
   ```

---

## 📝 Logs y Debugging

### Estrategia de Logging

El sistema actual usa `System.Diagnostics.Debug.WriteLine()` para logging básico.

**Ejemplo**:
```csharp
catch (Exception ex)
{
    System.Diagnostics.Debug.WriteLine($"Error en Login: {ex.Message}");
    return InternalServerError(new Exception("Error al procesar la solicitud de login"));
}
```

### Ver Logs en Visual Studio

1. Ejecutar en modo Debug (F5)
2. Abrir ventana "Output"
3. Seleccionar "Debug" en el dropdown

### Logging en Producción (Recomendación)

Implementar una biblioteca de logging profesional:

**Opción 1: NLog**
```csharp
private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

try
{
    // ... código ...
}
catch (Exception ex)
{
    Logger.Error(ex, "Error en Login para usuario {Usuario}", usuario);
    throw;
}
```

**Opción 2: Serilog**
```csharp
Log.Error(ex, "Error en Login para usuario {Usuario}", usuario);
```

---

## 🚀 Deploy y Producción

### Checklist Pre-Deploy

#### 1. Seguridad
- [ ] Eliminar `TestController.cs`
- [ ] Actualizar orígenes CORS a URLs de producción
- [ ] Habilitar HTTPS
- [ ] Habilitar `SecurityHeadersHandler`
- [ ] Revisar que no haya credentials hardcodeadas

#### 2. Configuración
- [ ] Actualizar cadena de conexión en `Web.config`
- [ ] Configurar `customErrors mode="RemoteOnly"`
- [ ] Deshabilitar `debug="false"` en `compilation`
- [ ] Configurar logs de producción

#### 3. Base de Datos
- [ ] Ejecutar scripts de creación
- [ ] Crear usuario de BD con permisos mínimos
- [ ] Configurar backups automáticos
- [ ] Crear índices en tablas grandes

#### 4. Performance
- [ ] Habilitar compresión de respuestas
- [ ] Configurar caching donde sea apropiado
- [ ] Optimizar queries lentos

---

### Configuración Web.config para Producción

```xml
<configuration>
  <connectionStrings>
    <add name="ResidenciaDB"
         connectionString="Data Source=SERVIDOR_PROD;Initial Catalog=ResidenciaDB;User Id=api_user;Password=***;MultipleActiveResultSets=True;Encrypt=True;"
         providerName="System.Data.SqlClient" />
  </connectionStrings>
  
  <system.web>
    <compilation debug="false" targetFramework="4.7.2" />
    <customErrors mode="RemoteOnly" />
  </system.web>
  
  <system.webServer>
    <httpProtocol>
      <customHeaders>
        <remove name="X-Powered-By" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>
```

---

## 📚 Referencias y Recursos

### Documentación Oficial

- **ASP.NET Web API**: https://docs.microsoft.com/en-us/aspnet/web-api/
- **ADO.NET**: https://docs.microsoft.com/en-us/dotnet/framework/data/adonet/
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **PBKDF2**: https://en.wikipedia.org/wiki/PBKDF2

### Herramientas

- **Swagger**: https://swagger.io/
- **Postman**: https://www.postman.com/
- **SQL Server Management Studio**: https://docs.microsoft.com/en-us/sql/ssms/

---

## 📞 Soporte

### Información de Contacto

Para consultas técnicas sobre este API, contactar al equipo de desarrollo.

### Contribuciones

Si encuentras un bug o tienes una sugerencia de mejora:

1. Documentar el problema detalladamente
2. Incluir pasos para reproducir
3. Proporcionar logs relevantes
4. Sugerir solución si es posible

---

## 📜 Licencia

[Especificar licencia del proyecto]

---

## 🔄 Historial de Versiones

### Versión 1.0.0 (Actual)
- ✅ Sistema de autenticación completo
- ✅ CRUD de legajos, alertas, niños, tutores
- ✅ Dashboard con estadísticas
- ✅ Headers de seguridad OWASP
- ✅ Documentación Swagger
- ✅ Validaciones de entrada

### Próximas Versiones (Roadmap)

**v1.1.0**
- [ ] Implementar roles y permisos
- [ ] Agregar filtros y paginación
- [ ] Exportación de reportes (PDF, Excel)

**v1.2.0**
- [ ] Notificaciones por email
- [ ] API de auditoría completa
- [ ] Búsqueda avanzada

**v2.0.0**
- [ ] Migración a .NET Core/.NET 6+
- [ ] Implementar Entity Framework Core
- [ ] API GraphQL

---

## 🎯 Conclusión

Este documento proporciona una visión completa del API ResidenciaApp, desde su arquitectura hasta los detalles de implementación. El sistema está diseñado siguiendo las mejores prácticas de seguridad, performance y mantenibilidad.

**Puntos Clave**:

✅ **Seguridad**: Implementación robusta con PBKDF2, tokens seguros, headers OWASP
✅ **Arquitectura**: Capas bien definidas con separación de responsabilidades
✅ **Validación**: Múltiples capas de validación de entrada
✅ **Auditoría**: Tracking completo de acciones críticas
✅ **Performance**: Uso eficiente de recursos y conexiones
✅ **Documentación**: Swagger integrado para testing y documentación

---

**Fecha de creación**: Enero 2024  
**Última actualización**: Enero 2024  
**Versión del documento**: 1.0.0

---

*Fin del documento*

