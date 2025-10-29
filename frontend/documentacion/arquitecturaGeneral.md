Voy a explorar rápidamente las carpetas clave del backend y frontend para identificar controladores, scripts y configuración, y así generar un informe completo y preciso de la arquitectura y vinculación entre capas. Luego compilaré la documentación solicitada.

[5 tools called]

Voy a revisar la configuración de Web API y un par de controladores clave, además de la utilidad HTTP del frontend, para documentar endpoints, ruteo y cómo se conectan con el frontend. Luego redacto el informe completo.

[6 tools called]

### Informe de documentación: arquitectura, frontend, backend y vinculación

- **Stack**: Frontend estático (HTML + JS modular), Backend ASP.NET Web API 2 (.NET Framework 4.7.2), SQL Server.
- **Comunicación**: Fetch JSON sobre HTTP; CORS habilitado; autenticación por token Bearer con sesiones de servidor.

## Arquitectura general

- **Frontend** (`frontend/`):
  - Páginas HTML: `alertas.html`, `dashboard.html`, `legajos.html`, etc.
  - JavaScript modular por dominio en `assets/js/`:
    - `api/` (cliente de API por recurso), `utils/` (http, auth, caché, UI), módulos por página (e.g., `alertas/page.js`).
  - Base URL de API configurable en tiempo de ejecución: `window.API_BASE` o `localStorage.API_BASE`.

- **Backend** (`api/WebApi/`):
  - ASP.NET Web API 2 con ruteo por atributos y ruta por defecto `api/{controller}/{id}`.
  - CORS restrictivo habilitado para orígenes locales.
  - Serialización JSON por defecto (XML deshabilitado).
  - Controladores por recurso: `AlertaController`, `AuthController`, `LegajoController`, `NinoController`, `TutorController`, `TipoAlertaController`, `PrioridadController`, etc.
  - Autenticación: endpoints `api/Auth/*`, tokens Bearer, sesiones con expiración y renovación.
  - Conexión a SQL Server por `Web.config` → `ResidenciaDB`.

- **Base de datos** (`db/`):
  - Scripts de instalación completa, datos demo y administración (`INSTALACION_COMPLETA.sql`, `datos_demo.sql`, `CREAR_ADMIN_*`, índices, verificación).

## Vinculación y flujo de datos

1. El frontend arma URLs a `/api/...` y las resuelve contra la base `API_BASE`:
```1:10:c:\Users\jordy\Desktop\ResidenciaApp\frontend\assets\js\utils\http.js
const API_BASE = (typeof window !== 'undefined' && (window.API_BASE || localStorage.getItem('API_BASE'))) || 'http://localhost:50948';

function resolveUrl(url) {
    if (typeof url !== 'string') return url;
    if (url.startsWith('/')) {
        const base = API_BASE.replace(/\/$/, '');
        return `${base}${url}`;
    }
    return url;
}
```

2. El backend publica rutas JSON, habilita CORS y fuerza JSON como formato:
```14:40:c:\Users\jordy\Desktop\ResidenciaApp\api\WebApi\App_Start\WebApiConfig.cs
// CORS con orígenes permitidos (localhosts)
var corsPolicy = new EnableCorsAttribute(
    origins: string.Join(",", allowedOrigins),
    headers: "Content-Type,Authorization,X-Requested-With",
    methods: "GET,POST,PUT,DELETE,OPTIONS"
) { SupportsCredentials = true };

config.EnableCors(corsPolicy);
```

3. Ruteo API: atributo y ruta por defecto.
```52:60:c:\Users\jordy\Desktop\ResidenciaApp\api\WebApi\App_Start\WebApiConfig.cs
config.MapHttpAttributeRoutes();
config.Routes.MapHttpRoute(
    name: "DefaultApi",
    routeTemplate: "api/{controller}/{id}",
    defaults: new { id = RouteParameter.Optional }
);
```

4. Autenticación: el frontend inyecta `Authorization: Bearer <token>` y valida sesión en background:
```88:101:c:\Users\jordy\Desktop\ResidenciaApp\frontend\assets\js\utils\authGuard.js
export function setupAuthInterceptor() {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const token = Session.getToken();
        if (token && args[0] && args[0].includes('/api/')) {
            if (args[1]) {
                args[1].headers = args[1].headers || {};
                args[1].headers['Authorization'] = `Bearer ${token}`;
            } else {
                args[1] = {
                    ...args[1],
                    headers: { 'Authorization': `Bearer ${token}` }
                };
            }
        }
```

## Backend: detalles por módulo

- Configuración de aplicación:
```14:21:c:\Users\jordy\Desktop\ResidenciaApp\api\WebApi\Global.asax.cs
protected void Application_Start()
{
    AreaRegistration.RegisterAllAreas();
    GlobalConfiguration.Configure(WebApiConfig.Register);
    FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
    RouteConfig.RegisterRoutes(RouteTable.Routes);
    BundleConfig.RegisterBundles(BundleTable.Bundles);
}
```

- Conexión a BD:
```7:11:c:\Users\jordy\Desktop\ResidenciaApp\api\WebApi\Web.config
<add name="ResidenciaDB"
     connectionString="Data Source=JORDYPC\SQLEXPRESS;Initial Catalog=ResidenciaDB;Integrated Security=True;MultipleActiveResultSets=True"
     providerName="System.Data.SqlClient" />
```

- Controladores principales:
  - `AuthController` (`[RoutePrefix("api/Auth")]`)
    - `POST api/Auth/Login`: valida credenciales, registra auditoría, crea sesión y devuelve token.
    - `POST api/Auth/Logout`: invalida sesión.
    - `GET api/Auth/ValidateToken`: valida token y devuelve info de usuario.
    - `POST api/Auth/RenewToken`: renueva expiración de sesión.
```27:36:c:\Users\jordy\Desktop\ResidenciaApp\api\WebApi\Controllers\AuthController.cs
[HttpPost]
[Route("Login")]
public IHttpActionResult Login([FromBody] LoginRequest request)
```

  - `AlertaController` (`api/Alerta` vía ruta por defecto)
    - `GET api/Alerta`: lista alertas (DataTable).
    - `POST api/Alerta`: crea alerta (validaciones de campos requeridos).
    - `PUT api/Alerta/{id}`: actualiza estado/props.
    - `POST api/Alerta/{id}/completar`: cambia estado a completada.
    - `DELETE api/Alerta/{id}`: elimina alerta.
```70:79:c:\Users\jordy\Desktop\ResidenciaApp\api\WebApi\Controllers\AlertaController.cs
[HttpPost]
[Route("api/Alerta/{id}/completar")]
public IHttpActionResult Completar(int id)
```

  - Otros controladores (patrón similar): `EstadoAlertaController`, `EstadoController`, `TipoAlertaController`, `PrioridadController`, `LegajoController`, `NinoController`, `TutorController`, `DashboardController`, `ValuesController`, `HomeController`, `TestController`.

- Serialización:
  - JSON por defecto, `ReferenceLoopHandling.Ignore`, XML removido.

- Seguridad:
  - CORS con lista blanca (localhosts).
  - Token Bearer en encabezado, sesiones con expiración (30 min) y renovación.
  - Hash de contraseñas y validación de fortaleza.
  - Auditoría de logins exitosos/fallidos.
  - Recomendación: activar un `SecurityHeadersHandler` comentado en `WebApiConfig.cs` y ocupar variables de entorno para la cadena de conexión en producción.

## Frontend: estructura y consumo de API

- Estructura:
  - `assets/js/api/*.js`: clientes por recurso. Ejemplo `alertasApi.js`:
```1:8:c:\Users\jordy\Desktop\ResidenciaApp\frontend\assets\js\api\alertasApi.js
import { http, buildQuery } from '../utils/http.js';
const BASE = '/api/Alerta';
const TIPO_ALERTA_BASE = '/api/TipoAlerta';
const PRIORIDAD_BASE = '/api/Prioridad';
const ESTADO_ALERTA_BASE = '/api/EstadoAlerta';
```
  - `assets/js/utils/http.js`: fetch genérico con JSON y manejo de errores; `buildQuery` para querystrings.
  - `assets/js/utils/authGuard.js`: interceptor para inyectar token, validación, guardas por rol/nivel, logout.
  - `assets/js/utils/cache.js`: caché en memoria con TTL para catálogos y datos.
  - `assets/js/*/page.js` y `form.js`/`table.js`: lógica de cada página (UI, eventos, renderizado) consumiendo `api/*`.

- Configuración de base URL:
  - Por defecto `http://localhost:50948` (IIS Express típico).
  - Se puede sobrescribir usando `window.API_BASE = 'http://host:puerto'` o `localStorage.setItem('API_BASE', ...)` antes de cargar scripts.

- Autenticación:
  - `Session` centraliza token y datos de usuario.
  - Interceptor agrega `Authorization: Bearer` automáticamente a cualquier fetch hacia `/api/...`.
  - Respuestas `401` provocan logout y redirección a `auth.html`.

## Base de datos

- Scripts en `db/`:
  - **Instalación**: `INSTALACION_COMPLETA.sql` (+ versión con datos demo).
  - **Datos demo**: `datos_demo.sql`.
  - **Administración**: `CREAR_ADMIN_SIMPLE.sql`, `RESETEAR_ADMIN.sql`, `VERIFICAR_LOGIN.sql`.
  - **Optimización**: `indices.sql`, `diagnostico-rendimiento.sql`, `optimizacion-alertas.sql`.
- El modelo del backend interactúa con SP/tablas retornando `DataTable` (patrón ADO.NET clásico).

## Ejecución y despliegue

- Backend:
  - Abrir `api/ResidenciaWebApp.sln` en Visual Studio.
  - Ejecutar `WebApi` con IIS Express (ver puerto real en la barra; actualizar `API_BASE` si cambia).
  - Configurar `Web.config` para conexión a SQL Server (en producción: usar `appSettings` protegidos o variables de entorno, no cadenas planas).

- Frontend:
  - Servir `frontend/` con un servidor estático (ej. `npx serve` o Live Server).
  - Configurar `window.API_BASE` en la página o `localStorage.API_BASE` para apuntar al puerto del backend.
  - Autenticarse en `auth.html`; el resto de páginas usan guardas de sesión.

## Seguridad y buenas prácticas recomendadas

- Reemplazar la cadena de conexión en `Web.config` por una variable de entorno/secret.
- Limitar CORS a dominios de producción; diferenciar perfiles Dev/Prod.
- Activar headers de seguridad (CSP, HSTS, X-Content-Type-Options) mediante `SecurityHeadersHandler`.
- Rate limiting en `Auth/Login` y bloqueo progresivo por intentos.
- Validaciones de entrada exhaustivas en todos los controladores (se observa en `Auth` y `Alerta`).
- Logs estructurados y trazabilidad de auditoría en operaciones sensibles.

## Mantenimiento y pruebas

- Sugerido:
  - Pruebas de API con Postman/REST Client (incluyendo flujos de login, expiración y renovación).
  - Smoke tests UI por página que validen que las llamadas `api/*` responden y que el interceptor maneja `401`.
  - Monitoreo básico de errores JS (window.onerror) y de API (logs en servidor).

## Apéndice: endpoints destacados

- Autenticación:
  - `POST /api/Auth/Login`
  - `POST /api/Auth/Logout`
  - `GET /api/Auth/ValidateToken`
  - `POST /api/Auth/RenewToken`
- Alertas:
  - `GET /api/Alerta`
  - `POST /api/Alerta`
  - `PUT /api/Alerta/{id}`
  - `POST /api/Alerta/{id}/completar`
  - `DELETE /api/Alerta/{id}`
- Catálogos:
  - `GET/POST/PUT/DELETE /api/TipoAlerta`
  - `GET/POST/PUT/DELETE /api/Prioridad`
  - `GET/POST/PUT/DELETE /api/EstadoAlerta`
- Otros recursos: `Legajo`, `Nino`, `Tutor`, `Dashboard` (métricas).

— Breve resumen —
- El frontend modular consume la API vía `http.js`, con `API_BASE` configurable y un interceptor que agrega el token.
- El backend en Web API expone rutas bajo `api/*`, usa CORS y JSON, y gestiona sesiones y auditoría.
- La BD se prepara con scripts en `db/`; el backend usa ADO.NET y `DataTable`.
- Para producción: endurecer CORS, secretos fuera de `Web.config`, headers de seguridad y rate limiting.