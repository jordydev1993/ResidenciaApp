## Manual de Capacitación - ResidenciaApp

### Objetivo
Este manual explica el funcionamiento del sistema completo (Base de Datos, API y Frontend), su arquitectura, flujos críticos y cómo mantenerlo. Incluye referencias a código y consultas útiles para soporte y QA.

### Índice
- Arquitectura general
- Base de datos (modelado, vistas, SPs, verificaciones)
- API Web (endpoints, filtros, configuración)
- Frontend (páginas, assets, flujos)
- Operación: instalación y diagnóstico
- Pruebas y validaciones

---

### Arquitectura general
- **Capa Datos (SQL Server)**: esquema `dbo` con entidades principales (`Nino`, `Tutor`, `Legajo`, `Alerta`) y catálogos (`Estado`, `TipoAlerta`, `Prioridad`, `EstadoAlerta`). Vistas de lectura optimizadas y procedimientos almacenados CRUD controlados.
- **Capa API (.NET Web API)**: proyecto `api/WebApi` expone endpoints REST sobre las entidades y vistas. Maneja CORS, serialización JSON y documentación (Swashbuckle/HelpPage).
- **Capa Frontend (HTML/JS)**: páginas estáticas que consumen la API para operar el sistema (autenticación, dashboard, gestión de legajos y alertas, reportes).

---

### Base de datos

#### Script maestro y dataset de prueba
El archivo `db/bd.sql` recrea la base desde cero, crea tablas, índices, vistas, SPs, carga catálogos y datos de prueba, y agrega verificaciones. 
Ingresar al archivo para leer la documentacion completa


Uso recomendado: ejecutar periódicamente para control de calidad y monitoreo operativo.

---

### API Web (.NET Web API)

Estructura del proyecto: `api/WebApi`.

- `Controllers/`: controladores MVC para recursos; exponen endpoints.
- `Models/`: contratos de datos (DTOs/Entities).
- `App_Start/`: configuración (WebApiConfig, filtros, CORS, Swagger HelpPage).
- `Global.asax`: ciclo de vida de la app.

Puntos clave a revisar en el código:
- Rutas y convenciones en `App_Start/WebApiConfig.cs`.
- CORS habilitado en `App_Start` para permitir consumo desde `frontend`.
- Serialización JSON (Newtonsoft), configuraciones culturales.
- Controladores en `Controllers/` que consultan SPs y vistas definidas en `db/bd.sql`.

Documentación auto-generada: el paquete `HelpPage` permite ver contratos y ejemplos de respuesta; Swashbuckle aporta `swagger` si está habilitado.

Seguridad básica: validar inputs (tipos, rangos) en endpoints y utilizar parámetros tipados hacia SPs para evitar inyecciones.

#### Controladores - Documentación línea por línea

##### `NinoController`

```1:30:api/WebApi/Controllers/NinoController.cs
using System;
using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.Models;

namespace WebApi.Controllers
{
    public class NinoController : ApiController
    {
        // GET: api/Nino
        public IHttpActionResult Get()
        {
            try
            {
                var nino = new Nino();
                var dt = nino.ListarTodos();
                return Ok(dt);
            }
            catch (InvalidOperationException inv)
            {
                // Conflicto de negocio (e.g., DNI duplicado)
                return Content(System.Net.HttpStatusCode.Conflict, new { Message = inv.Message });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
```
- Importa dependencias y define `ApiController`.
- `Get()` lista todos vía `Models.Nino.ListarTodos()` y devuelve `200 OK` con el `DataTable`.
- Maneja `InvalidOperationException` como `409 Conflict` y otras excepciones como `500`.

```32:47:api/WebApi/Controllers/NinoController.cs
// GET: api/Nino/{dni}
public IHttpActionResult Get(string id)
{
    try
    {
        if (string.IsNullOrWhiteSpace(id)) return BadRequest("DNI requerido");
        var nino = new Nino();
        var dt = nino.ObtenerPorDni(id);
        if (dt.Rows.Count == 0) return NotFound();
        return Ok(dt);
    }
    catch (Exception ex)
    {
        return InternalServerError(ex);
    }
}
```
- `Get(id)` valida `dni`, consulta por DNI y retorna `404` si no hay filas.

```49:84:api/WebApi/Controllers/NinoController.cs
// POST: api/Nino
public IHttpActionResult Post([FromBody] Nino value)
{
    try
    {
        if (value == null || string.IsNullOrWhiteSpace(value.DNI))
            return BadRequest("DNI requerido");
        if (string.IsNullOrWhiteSpace(value.Nombre))
            return BadRequest("Nombre requerido");
        if (value.FechaNacimiento == default(DateTime))
            return BadRequest("FechaNacimiento requerida");

        var n = new Nino
        {
            Id = value.Id, // upsert
            DNI = value.DNI,
            Nombre = value.Nombre,
            Apellido = value.Apellido,
            FechaNacimiento = value.FechaNacimiento
        };
        n.Upsert();
        return Ok(n);
    }
    catch (InvalidOperationException ex)
    {
        return Content(HttpStatusCode.Conflict, new { message = ex.Message });
    }
    catch (Exception ex)
    {
        return InternalServerError(ex);
    }
}
```
- Valida payload requerido, construye un upsert y devuelve `200` con el objeto.

```86:101:api/WebApi/Controllers/NinoController.cs
// DELETE: api/Nino/{dni}
public IHttpActionResult Delete(string id)
{
    try
    {
        if (string.IsNullOrWhiteSpace(id)) return BadRequest("DNI requerido");
        var n = new Nino { DNI = id };
        var rows = n.Eliminar();
        if (rows == 0) return NotFound();
        return Ok($"Nino {id} eliminado");
    }
    catch (Exception ex)
    {
        return InternalServerError(ex);
    }
}
```
- Elimina por DNI; retorna `404` si no afectó filas.

##### `LegajoController`

```12:20:api/WebApi/Controllers/LegajoController.cs
public class LegajoController : ApiController
{
    // GET: api/Legajo
    public DataTable Get()
    {
        Legajo oLegajo = new Legajo();
        return oLegajo.ListarTodos();
    }
```
- Endpoint para listar legajos: retorna `DataTable` con `SP_Legajo_GetAll`.

```21:38:api/WebApi/Controllers/LegajoController.cs
// GET: api/Legajo/5
public IHttpActionResult Get(int id)
{
    try
    {
        Legajo oLegajo = new Legajo();
        DataTable dt = oLegajo.ObtenerPorId(id);
        if (dt.Rows.Count == 0)
            return NotFound();
        return Ok(dt);
    }
    catch (Exception ex)
    {
        return InternalServerError(ex);
    }
}
```
- Obtiene por Id apoyado en `SP_Legajo_GetById` (definido en SQL).

```40:72:api/WebApi/Controllers/LegajoController.cs
// POST: api/Legajo
public IHttpActionResult Post([FromBody] Legajo value)
{
    try
    {
        if (value == null) return BadRequest("Payload requerido");
        if (value.NinoId <= 0) return BadRequest("NinoId requerido");
        if (value.EstadoId <= 0) return BadRequest("EstadoId requerido");
        if (value.FechaIngreso == default(DateTime)) return BadRequest("FechaIngreso requerida");

        Legajo oLegajo = new Legajo { NinoId = value.NinoId, FechaIngreso = value.FechaIngreso, EstadoId = value.EstadoId, TutorId = value.TutorId, Observaciones = value.Observaciones };
        oLegajo.Guardar();
        return Created(Request.RequestUri, oLegajo);
    }
    catch (Exception ex)
    {
        return InternalServerError(ex);
    }
}
```
- Valida campos críticos y crea legajo llamando a `SP_Legajo_Insert`.

```74:96:api/WebApi/Controllers/LegajoController.cs
// PUT: api/Legajo/5
public IHttpActionResult Put(int id, [FromBody] Legajo value)
{
    try
    {
        Legajo oLegajo = new Legajo { Id = id, EstadoId = value.EstadoId, TutorId = value.TutorId, Observaciones = value.Observaciones };
        oLegajo.Actualizar();
        return Ok(oLegajo);
    }
    catch (Exception ex)
    {
        return InternalServerError(ex);
    }
}
```
- Actualiza campos editables del legajo vía `SP_Legajo_Update`.

```98:113:api/WebApi/Controllers/LegajoController.cs
// DELETE: api/Legajo/5
public IHttpActionResult Delete(int id)
{
    try
    {
        Legajo oLegajo = new Legajo { Id = id };
        oLegajo.Eliminar();
        return Ok(new { message = $"Legajo con Id={id} eliminado correctamente" });
    }
    catch (Exception ex)
    {
        return Content(System.Net.HttpStatusCode.BadRequest, new { error = ex.Message });
    }
}
```
- Elimina y captura errores de negocio (p. ej., FKs por alertas) como `400` con mensaje.

##### `AlertaController`

```12:19:api/WebApi/Controllers/AlertaController.cs
public class AlertaController : ApiController
{
    // GET: api/Alerta
    public DataTable Get()
    {
        Alerta alerta = new Alerta();
        return alerta.ListarTodos();
    }
```
- Lista todas las alertas (`SP_Alerta_GetAll`).

```27:47:api/WebApi/Controllers/AlertaController.cs
// POST: api/Alerta
public IHttpActionResult Post([FromBody] Alerta value)
{
    if (value == null) return BadRequest("Payload requerido");
    if (value.TipoId <= 0) return BadRequest("TipoId requerido");
    if (value.LegajoId <= 0) return BadRequest("LegajoId requerido");
    if (value.EstadoId <= 0) return BadRequest("EstadoId requerido");

    Alerta alerta = new Alerta { TipoId = value.TipoId, LegajoId = value.LegajoId, Descripcion = value.Descripcion, FechaVencimiento = value.FechaVencimiento, PrioridadId = value.PrioridadId, EstadoId = value.EstadoId };
    var id = alerta.Guardar();
    return Created(Request.RequestUri, new { Id = id });
}
```
- Valida payload y crea alerta (`SP_Alerta_Insert`).

```49:68:api/WebApi/Controllers/AlertaController.cs
// PUT: api/Alerta/5
public IHttpActionResult Put(int id, [FromBody] Alerta value)
{
    if (value == null) return BadRequest("Payload requerido");
    if (id <= 0) return BadRequest("Id inválido");
    if (value.EstadoId <= 0) return BadRequest("EstadoId requerido");

    Alerta alerta = new Alerta { Id = id, EstadoId = value.EstadoId, PrioridadId = value.PrioridadId, Descripcion = value.Descripcion, FechaVencimiento = value.FechaVencimiento };
    var rows = alerta.Actualizar();
    if (rows == 0) return NotFound();
    return Ok(new { Id = id });
}
```
- Actualiza campos de alerta (`SP_Alerta_Update`), retorna `404` si no encontró.

```70:88:api/WebApi/Controllers/AlertaController.cs
// POST: api/Alerta/{id}/completar
[HttpPost]
[Route("api/Alerta/{id}/completar")]
public IHttpActionResult Completar(int id)
{
    if (id <= 0) return BadRequest("Id inválido");
    var alerta = new Alerta { Id = id, EstadoId = 2 /* Completada */ };
    var rows = alerta.Actualizar();
    if (rows == 0) return NotFound();
    return Ok(new { Id = id, EstadoId = 2 });
}
```
- Atajo para marcar como completada (estado Id=2).

##### `AuthController`

```13:31:api/WebApi/Controllers/AuthController.cs
/// Controlador para gestión de autenticación y sesiones
[RoutePrefix("api/Auth")]
public class AuthController : ApiController
{
    // POST: api/Auth/Login
    [HttpPost]
    [Route("Login")]
    public IHttpActionResult Login([FromBody] LoginRequest request)
    {
        // valida credenciales, verifica hash, registra auditoría, genera token
    }
```
- Prefijo de ruta para endpoints de auth. `Login` valida usuario/contraseña, registra intento y crea sesión con token.

```138:166:api/WebApi/Controllers/AuthController.cs
[HttpPost]
[Route("Logout")]
public IHttpActionResult Logout()
{
    var token = GetTokenFromHeader();
    // cierra sesión asociada al token
}
```
- Extrae bearer token y lo invalida en servidor.

```173:224:api/WebApi/Controllers/AuthController.cs
[HttpGet]
[Route("ValidateToken")]
public IHttpActionResult ValidateToken()
{
    var token = GetTokenFromHeader();
    // valida token y retorna datos del usuario si es válido
}
```
- Validación de sesión para proteger rutas.

```231:269:api/WebApi/Controllers/AuthController.cs
[HttpPost]
[Route("RenewToken")]
public IHttpActionResult RenewToken()
{
    var token = GetTokenFromHeader();
    // renueva la expiración de la sesión
}
```
- Extiende la vida del token.

```281:343:api/WebApi/Controllers/AuthController.cs
[HttpPost]
[Route("Register")]
public IHttpActionResult Register([FromBody] RegistroRequest request)
{
    // valida, hashea contraseña, crea usuario
}
```
- Registro de usuarios con validaciones y manejo de duplicados.

```351:415:api/WebApi/Controllers/AuthController.cs
[HttpPost]
[Route("ChangePassword")]
public IHttpActionResult ChangePassword([FromBody] CambioPasswordRequest request)
{
    // valida token, verifica contraseña actual, fuerza de nueva contraseña y actualiza hash
}
```
- Cambio seguro de contraseña.

```425:466:api/WebApi/Controllers/AuthController.cs
private string GetTokenFromHeader() { /* extrae Bearer token */ }
private string GetClientIpAddress() { /* intenta obtener IP/forwarded-for */ }
```
- Utilidades de extracción de token e IP del cliente.

##### Catálogos: `EstadoController`, `EstadoAlertaController`, `PrioridadController`, `TipoAlertaController`

```7:22:api/WebApi/Controllers/EstadoController.cs
public IHttpActionResult Get() { /* listar todos */ }
```
- Endpoints CRUD básicos que delegan en `Models` para `Insertar/Actualizar/Eliminar`.

```24:39:api/WebApi/Controllers/EstadoController.cs
public IHttpActionResult Post([FromBody] Estado value) { /* valida y crea */ }
```

```46:62:api/WebApi/Controllers/EstadoController.cs
public IHttpActionResult Put(int id, [FromBody] Estado value) { /* actualiza */ }
```

```69:83:api/WebApi/Controllers/EstadoController.cs
public IHttpActionResult Delete(int id) { /* borra con NotFound si 0 filas */ }
```

Patrón análogo en:
- `api/WebApi/Controllers/EstadoAlertaController.cs` (L9:22, L24:39, L41:56, L58:72)
- `api/WebApi/Controllers/PrioridadController.cs` (L10:22, L24:39, L41:56, L58:72)
- `api/WebApi/Controllers/TipoAlertaController.cs` (L10:22, L24:39, L41:56, L58:72)

##### `TutorController`

```9:22:api/WebApi/Controllers/TutorController.cs
public IHttpActionResult Get() { /* listar todos */ }
```

```24:46:api/WebApi/Controllers/TutorController.cs
public IHttpActionResult Post([FromBody] Tutor value) { /* valida nombre y upsert */ }
```

```48:71:api/WebApi/Controllers/TutorController.cs
public IHttpActionResult Put(int id, [FromBody] Tutor value) { /* upsert por id */ }
```

```73:87:api/WebApi/Controllers/TutorController.cs
public IHttpActionResult Delete(int id) { /* eliminar/NotFound */ }
```

---

### Frontend (HTML/JS/CSS)

Ubicación: `frontend/`.

- Páginas principales: `index.html`, `dashboard.html`, `ninos.html`, `legajos.html`, `alertas.html`, `reportes_*`. Cada una se apoya en `assets/js` y estilos en `assets/css`.
- Librerías: Bootstrap y jQuery (desde `api/packages`/`frontend/assets`).
- Flujo típico: las páginas consumen endpoints de la API para listar y operar Legajos/Alertas; muestran estados, validan inputs mínimos y formatean resultados.

Buenas prácticas al extender:
- Centralizar llamadas a API en un módulo JS (fetch con manejo de errores y timeouts).
- Validar formularios en cliente y servidor.
- Usar componentes reutilizables (modales, tablas, paginación) y estilos consistentes.

#### Utils HTTP y APIs de Frontend - Documentación línea por línea

##### `utils/http.js`

```1:11:frontend/assets/js/utils/http.js
const API_BASE = (typeof window !== 'undefined' && (window.API_BASE || localStorage.getItem('API_BASE'))) || 'http://localhost:50948';

function resolveUrl(url) {
    if (typeof url !== 'string') return url;
    // Prefijar base cuando se usa ruta absoluta ("/api/...") desde un origen distinto
    if (url.startsWith('/')) {
        const base = API_BASE.replace(/\/$/, '');
        return `${base}${url}`;
    }
    return url;
}
```
- `API_BASE` configurable por `window` o `localStorage` (fallback local).
- `resolveUrl` antepone base para rutas absolutas.

```13:25:frontend/assets/js/utils/http.js
export async function http(url, options = {}) {
    const response = await fetch(resolveUrl(url), {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    });
    let body = null;
    try { body = await response.json(); } catch { body = null; }
    if (!response.ok) {
        const message = (body && (body.message || body.error)) || `HTTP ${response.status}`;
        throw new Error(message);
    }
    return body;
}

export function buildQuery(params = {}) {
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
    return entries.length ? `?${new URLSearchParams(entries).toString()}` : '';
}
```
- `http` hace fetch, parsea JSON seguro y normaliza errores con mensaje.
- `buildQuery` serializa params ignorando vacíos.

##### `api/legajosApi.js`

```1:11:frontend/assets/js/api/legajosApi.js
import { http, buildQuery } from '../utils/http.js';

const BASE = '/api/Legajo';

export const listLegajos = (params = {}) => http(`${BASE}${buildQuery(params)}`, { method: 'GET' });
export const createLegajo = (data) => http(BASE, { method: 'POST', body: JSON.stringify(data) });
export const updateLegajo = (id, data) => http(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteLegajo = (id) => http(`${BASE}/${id}`, { method: 'DELETE' });
export const searchLegajos = (q) => http(`${BASE}/search${buildQuery({ q })}`, { method: 'GET' });
export const reportesLegajos = (params = {}) => http(`${BASE}/reportes${buildQuery(params)}`, { method: 'GET' });

export const listEstados = () => http('/api/Estado', { method: 'GET' });
export const createEstado = (data) => http('/api/Estado', { method: 'POST', body: JSON.stringify(data) });
export const updateEstado = (id, data) => http(`/api/Estado/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEstado = (id) => http(`/api/Estado/${id}`, { method: 'DELETE' });
export const listTutores = () => http('/api/Tutor', { method: 'GET' });
```
- Capa fina para endpoints de legajos y catálogos asociados.
- `searchLegajos` y `reportesLegajos` prevén endpoints adicionales.

##### `auth/login.js`

```1:12:frontend/assets/js/auth/login.js
import { Session } from './session.js';
const API_URL = 'http://localhost:50948/api';
document.addEventListener('DOMContentLoaded', () => {
    if (Session.isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }
    const form = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    // ...
});
```
- Redirige si ya hay sesión; inicializa handlers de UI.

```35:75:frontend/assets/js/auth/login.js
async function handleLogin(e) {
    // valida formulario, muestra loading, POST a /Auth/Login
    // maneja 401/403 y muestra mensajes
}
```
- Autenticación contra la API, manejo de errores y UX (spinners, toasts).

```78:107:frontend/assets/js/auth/login.js
// on success: guarda token/usuario en Session, respeta RememberMe y redirige (returnUrl o dashboard)
```

##### `auth/session.js`

```5:27:frontend/assets/js/auth/session.js
export class Session {
    static TOKEN_KEY = 'auth_token';
    static USER_KEY = 'user_data';
    static REMEMBER_KEY = 'remember_me';
    static setToken(token) { /* guarda token en storage elegido */ }
    static getToken() { /* obtiene token de session/local */ }
}
```
- API de sesión: persistencia, remember-me y helpers de autorización/roles.

```92:131:frontend/assets/js/auth/session.js
static hasRole(roleName) { /* compara rol */ }
static hasMinLevel(level) { /* compara nivel mínimo */ }
static getUserName() { /* nombre completo */ }
static getUserRole() { /* nombre de rol */ }
```

##### `utils/authGuard.js`

```10:22:frontend/assets/js/utils/authGuard.js
export function requireAuth() { /* redirige a login si no hay token y valida token en background */ }
```

```45:54:frontend/assets/js/utils/authGuard.js
export function requireMinLevel(level) { /* fuerza nivel mínimo y redirige */ }
```

```60:82:frontend/assets/js/utils/authGuard.js
async function validateTokenAsync() { /* GET /Auth/ValidateToken con Bearer; si 401, logout y redirect */ }
```

```88:126:frontend/assets/js/utils/authGuard.js
export function setupAuthInterceptor() { /* wrap de fetch: agrega Authorization y captura 401 global */ }
```

```132:144:frontend/assets/js/utils/authGuard.js
export function initAuth() { /* set interceptor, requireAuth, y pinta user en UI */ }
```

```169:194:frontend/assets/js/utils/authGuard.js
export async function handleLogout() { /* POST /Auth/Logout si hay token y limpiar sesión */ }
```

##### `alertas/page.js`

```13:57:frontend/assets/js/alertas/page.js
async function loadStats() { /* KPIs de alertas: vencidas, próximas, pendientes, completadas */ }
```

```145:191:frontend/assets/js/alertas/page.js
async function aplicarFiltros() { /* obtiene filtros, filtra en cliente mapeando IDs→nombres, pagina y renderiza */ }
```

```296:323:frontend/assets/js/alertas/page.js
function renderCurrentPage(pageData) { /* render de filas actuales con estados UI */ }
```

```328:363:frontend/assets/js/alertas/page.js
function selectRow(id) { /* selección robusta por distintos nombres de campo */ }
```

```452:592:frontend/assets/js/alertas/page.js
function mostrarDetalleAlerta(alerta) { /* modal de detalle con badges por estado/prioridad y fechas */ }
```

```627:738:frontend/assets/js/alertas/page.js
document.addEventListener('DOMContentLoaded', async () => { /* carga en paralelo catálogos+alertas, init paginación, eventos */ });
```

##### `dashboard/page.js`

##### `alertas/form.js`

```1:38:frontend/assets/js/alertas/form.js
import { createAlerta, updateAlerta, listTipoAlertas, listPrioridades, listEstadoAlertas } from '../api/alertasApi.js';
import { listLegajos } from '../api/legajosApi.js';
import { $, serializeForm, showToast } from '../utils/dom.js';

export async function loadCatalogos() {
    const [legajos, tipos, prioridades, estados] = await Promise.all([
        listLegajos(), listTipoAlertas(), listPrioridades(), listEstadoAlertas()
    ]);
    // pobla selects: #selectLegajo, #selectTipoAlerta, #selectPrioridad, #selectEstadoAlerta
}
```
- Carga catálogos en paralelo y llena selects con soporte a distintos formatos de respuesta.

```86:124:frontend/assets/js/alertas/form.js
function validarFormulario(payload) { /* valida legajoId, tipoAlertaId, prioridadId, descripcion, fechaVencimiento */ }
```
- Validaciones mínimas del formulario con chequeos de campos requeridos.

```129:198:frontend/assets/js/alertas/form.js
export function bindAlertaForm(onCreated) {
    // serializa form, valida, arma payload para create/update; maneja título modal y cierra
}
```
- Vincula submit del formulario, diferencia creación vs edición y refresca datos vía callback.

```203:206:frontend/assets/js/alertas/form.js
export function guardarAlerta() { /* trigger programático submit del formulario */ }
```

##### `alertas/table.js`

```1:16:frontend/assets/js/alertas/table.js
import { listAlertas, completeAlerta } from '../api/alertasApi.js';
import { $, renderHTML, showToast, setText } from '../utils/dom.js';
function getVencimientoStatus(fechaVencimiento, estado) { /* calcula clase/icono y texto según vencimiento */ }
```
- Helpers para badges de vencimiento, prioridad, estado y formateo de fecha.

```92:156:frontend/assets/js/alertas/table.js
export function rowTemplate(a) { /* compone fila HTML resiliente a PascalCase/camelCase; badges y KPIs */ }
```
- Usa `getVencimientoStatus`, `getPrioridadBadge`, `getEstadoBadge` y truncado de descripción.

```161:206:frontend/assets/js/alertas/table.js
export async function loadAlertas(params = {}) {
    const data = await listAlertas(params);
    // setea contador, renderiza tabla vacía o filas, y devuelve items
}
```
- Renderizado con estados vacíos y manejo de errores con `showToast`.

##### `utils/dom.js`

```1:17:frontend/assets/js/utils/dom.js
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
export function setText(el, text) { /* set textContent seguro */ }
export function renderHTML(el, html) { /* set innerHTML seguro */ }
export function serializeForm(form) { /* FormData → objeto */ }
```
- Utilidades DOM básicas y serialización de formularios.

```19:74:frontend/assets/js/utils/dom.js
export function showToast(message, type = 'info') { /* usa Bootstrap si existe; fallback simple */ }
```
- Notificaciones reutilizables con degradado a implementación propia si no hay Bootstrap.

##### `utils/pagination.js`

```9:17:frontend/assets/js/utils/pagination.js
export class Pagination {
    constructor(options = {}) { /* data, itemsPerPage, currentPage, containerId, callbacks */ }
}
```

```22:42:frontend/assets/js/utils/pagination.js
setData(data) { /* set y reset page=1 */ }
getTotalPages() { /* ceil(len/itemsPerPage) */ }
getCurrentPageData() { /* slice por página actual */ }
```

```47:56:frontend/assets/js/utils/pagination.js
goToPage(page) { /* clamp a [1..total], onPageChange, render */ }
```

```61:84:frontend/assets/js/utils/pagination.js
nextPage(), prevPage(), firstPage(), lastPage()
```

```89:116:frontend/assets/js/utils/pagination.js
setItemsPerPage(items) { /* parse, reset y render */ }
getInfo() { /* info derivada: current, total, start/end, flags */ }
```

```121:225:frontend/assets/js/utils/pagination.js
render() { /* genera UI HTML accesible y responsive; números con generatePageNumbers */ }
```

```231:268:frontend/assets/js/utils/pagination.js
generatePageNumbers(current, total) { /* compacta con '...' alrededor de página actual */ }
```

```273:305:frontend/assets/js/utils/pagination.js
attachEventListeners() { /* wire botones y selector items/page → callbacks */ }
```

##### `api/alertasApi.js`

```1:12:frontend/assets/js/api/alertasApi.js
import { http, buildQuery } from '../utils/http.js';
import { catalogCache, dataCache } from '../utils/cache.js';
const BASE = '/api/Alerta';
// bases de catálogos: TipoAlerta, Prioridad, EstadoAlerta; TTLs
```

```17:24:frontend/assets/js/api/alertasApi.js
export const listAlertas = (params = {}) => { /* usa caché 1m si no hay filtros */ }
```

```26:43:frontend/assets/js/api/alertasApi.js
export const createAlerta = async (data) => { /* POST y invalidación de caches relacionados */ }
export const updateAlerta = async (id, data) => { /* PUT e invalidación */ }
export const deleteAlerta = async (id) => { /* DELETE e invalidación */ }
export const completeAlerta = async (id) => { /* POST completar e invalidación */ }
```

```59:62:frontend/assets/js/api/alertasApi.js
export const dashboardAlertas = () => dataCache.get('dashboard-alertas', () => http(`${BASE}/dashboard`, { method: 'GET' }), DATA_TTL);
```

```66:90:frontend/assets/js/api/alertasApi.js
// list/create/update/delete de TipoAlerta con caché (TTL 5m)
```

```95:118:frontend/assets/js/api/alertasApi.js
// list/create/update/delete de Prioridad con caché
```

```123:146:frontend/assets/js/api/alertasApi.js
// list/create/update/delete de EstadoAlerta con caché
```

```10:19:frontend/assets/js/dashboard/page.js
async function loadKPIs() { /* total legajos/alertas, vencidas, próximas, completadas */ }
```

```74:117:frontend/assets/js/dashboard/page.js
async function loadCharts() { /* agrupa por estado y prioridad y crea gráficos */ }
```

```123:167:frontend/assets/js/dashboard/page.js
async function loadDashboardStats() { /* intenta endpoint único /Dashboard/Stats, fallback a métodos locales */ }
```

```172:177:frontend/assets/js/dashboard/page.js
async function init() { await loadDashboardStats(); }
document.addEventListener('DOMContentLoaded', init);
```

#### Página de Legajos - Documentación línea por línea (extractos clave)

```1:8:frontend/assets/js/legajos/page.js
import { $, renderHTML, serializeForm, showToast } from '../utils/dom.js';
import { listLegajos, createLegajo, updateLegajo, deleteLegajo } from '../api/legajosApi.js';
import { listNinos } from '../api/ninoApi.js';
import { listEstados } from '../api/catalogosApi.js';
import { listTutores, createTutor } from '../api/tutorApi.js';
import { upsertNino } from '../api/ninoApi.js';
import { Pagination } from '../utils/pagination.js';
```
- Importa utilidades de DOM, APIs y paginación.

```23:31:frontend/assets/js/legajos/page.js
// Normaliza texto: minúsculas y sin tildes
function normalizeText(value) {
    return String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}
```
- Normalización para búsquedas/filtros robustos.

```31:66:frontend/assets/js/legajos/page.js
function rowTemplate(leg) {
    // DataTable serializado o JSON directo
    const id = leg.LegajoId ?? leg["LegajoId"] ?? leg.Id ?? leg["Id"] ?? leg.id ?? leg[0];
    // ...
    return `<tr class="hover:bg-gray-50" data-id="${id}" ...>...</tr>`;
}
```
- Templating resiliente a distintos formatos de datos (nombres y posiciones).

```68:96:frontend/assets/js/legajos/page.js
async function load() {
    try {
        const data = await listLegajos();
        const items = Array.isArray(data) ? data : (data?.items || data);
        legajosData = items || [];
        filteredData = [...legajosData];
        // inicializa paginación y render
        updateKPIs();
        applyFilters();
    } catch (err) {
        showToast(`❌ Error al cargar: ${err.message}`);
    }
}
```
- Carga datos, inicia paginación, KPI y filtros; maneja errores de red/API.

```249:282:frontend/assets/js/legajos/page.js
function applyFilters() {
    // lee inputs, normaliza y filtra por campo
    filteredData = legajosData.filter(legajo => { /* match por estado/dni/nombre/tutor */ });
    sortData();
    // sincroniza paginación y renderiza
}
```
- Filtros client-side y sincronización con paginación.

```1082:1127:frontend/assets/js/legajos/page.js
function bindForm() {
    const form = '#legajoForm';
    // submit con validaciones, crea/actualiza vía API
}
```
- Gestión del formulario principal con validaciones y feedback.

```1128:1134:frontend/assets/js/legajos/page.js
document.addEventListener('DOMContentLoaded', () => {
    bindForm();
    bindNinoRapidoForm();
    bindTutorRapidoForm();
    bindEvents();
    loadCatalogos().then(() => load());
});
```
- Secuencia de inicialización al cargar la página.

Para más módulos (`alertas/*`, `dashboard/*`, `utils/*`), seguir el mismo patrón: citar bloques con referencias e incluir una explicación breve por bloque (validaciones, flujos de red, render, eventos, estado local y utilidades compartidas).

---

### Operación: instalación y diagnóstico

1) Base de datos
- Ejecutar `db/bd.sql` completo en SQL Server (creación, catálogos, SPs, datos prueba y verificaciones).
- Para diagnóstico, ejecutar secciones 8 y 9 (verificaciones y reportes rápidos).

2) API
- Abrir solución `api/ResidenciaWebApp.sln` en Visual Studio.
- Restaurar paquetes (NuGet), compilar `WebApi` y ejecutar localmente.

3) Frontend
- Servir `frontend/` (por ejemplo con Live Server) y configurar base URL de API si corresponde.

---

### Pruebas y validaciones
- Validar vistas y SPs: ejecutar `SP_Legajo_GetAll`, `SP_Alerta_GetAll` y las vistas `VW_*`.
- Probar altas, bajas y modificaciones vía endpoints en la API (usar Postman o la HelpPage/Swagger).
- En frontend, verificar flujos: alta de legajo, creación/actualización de alerta, filtros de estado/prioridad y listados de reportes.

### Mantenimiento
- Agregar nuevas columnas: hacerlo primero en tablas, luego ajustar vistas y SPs.
- Rendimiento: revisar índices según patrones de consultas (ej. filtros por `EstadoId`, `FechaVencimiento`).
- Auditoría: mantener consistentes los campos `Fecha*` y `Usuario*` en operaciones de actualización.

---

## Módulos adicionales documentados

### `utils/cache.js`

```1:26:frontend/assets/js/utils/cache.js
/**
 * Sistema de caché con TTL (Time To Live)
 * Almacena datos en localStorage con expiración automática
 */
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
const CACHE_PREFIX = 'cache_residencia_';
export class CacheManager {
    constructor(namespace = 'default') { /* prefix por namespace */ }
}
```
- Sistema de caché con namespace, TTL y metadatos para evitar colisiones.

```39:84:frontend/assets/js/utils/cache.js
async get(key, fetcher, ttl = DEFAULT_TTL) {
    // intenta obtener de storage, verifica TTL, log HIT/MISS/EXPIRED
    // si no está o expiró, llama fetcher y guarda con timestamp
    // fallback a expirados si falla fetcher
}
```
- Patrón cache-aside con fallback a datos expirados ante error de red.

```93:112:frontend/assets/js/utils/cache.js
set(key, data, ttl) { /* guarda directamente */ }
invalidate(key) { /* borra entrada y actualiza metadata */ }
invalidateAll() { /* borra todo el namespace */ }
```

```140:179:frontend/assets/js/utils/cache.js
static cleanup() { /* recorre metadata, borra expirados, retorna count */ }
```
- Limpieza automática ejecutada al cargar y cada 10 minutos.

```186:231:frontend/assets/js/utils/cache.js
static getStats() { /* contadores de entradas válidas/expiradas, tamaño KB, namespaces */ }
```

```262:291:frontend/assets/js/utils/cache.js
_saveToStorage(key, data, ttl) { /* serializa con timestamp/ttl, maneja QuotaExceededError */ }
```

```330:358:frontend/assets/js/utils/cache.js
export const catalogCache = new CacheManager('catalogos');
export const dataCache = new CacheManager('data');
// limpieza al cargar y cada 10m; expone window.CacheManager para debugging
```

### `api/catalogosApi.js`

```1:11:frontend/assets/js/api/catalogosApi.js
import { http } from '../utils/http.js';
import { catalogCache } from '../utils/cache.js';
const CATALOG_TTL = 5 * 60 * 1000;
```

```10:29:frontend/assets/js/api/catalogosApi.js
// ESTADO: list con caché 5m, create/update/delete invalidan
export const listEstados = () => catalogCache.get('estados', () => http('/api/Estado', { method: 'GET' }), CATALOG_TTL);
export const createEstado = async (data) => { /* POST e invalidate */ }
```

```34:53:frontend/assets/js/api/catalogosApi.js
// TUTOR: list con caché 5m, create/update/delete invalidan
```

```58:77:frontend/assets/js/api/catalogosApi.js
// TIPO_ALERTA: list con caché 5m, create/update/delete invalidan
```

```82:101:frontend/assets/js/api/catalogosApi.js
// PRIORIDAD: list con caché 5m, create/update/delete invalidan
```

```106:125:frontend/assets/js/api/catalogosApi.js
// ESTADO_ALERTA: list con caché 5m, create/update/delete invalidan
```

### `api/ninoApi.js`

```1:40:frontend/assets/js/api/ninoApi.js
import { http } from '../utils/http.js';
const BASE = '/api/Nino';
// mockData para desarrollo/fallback
```
- Mock local si backend no disponible.

```41:68:frontend/assets/js/api/ninoApi.js
export const upsertNino = async (data) => {
    try {
        return await http(BASE, { method: 'POST', body: JSON.stringify(data) });
    } catch (error) {
        // fallback a datos locales con delay simulado
    }
}
```
- Upsert con fallback a datos mock.

```70:80:frontend/assets/js/api/ninoApi.js
export const listNinos = async () => { /* GET con fallback mock */ }
```

```82:98:frontend/assets/js/api/ninoApi.js
export const deleteNino = async (dni) => { /* DELETE con fallback */ }
```

```100:112:frontend/assets/js/api/ninoApi.js
export const existsDni = async (dni) => { /* verifica existencia por GET; fallback a listado */ }
```

### `api/tutorApi.js`

```1:9:frontend/assets/js/api/tutorApi.js
import { http } from '../utils/http.js';
const BASE = '/api/Tutor';
export const listTutores = () => http(BASE, { method: 'GET' });
export const createTutor = (data) => http(BASE, { method: 'POST', body: JSON.stringify(data) });
export const updateTutor = (id, data) => http(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTutor = (id) => http(`${BASE}/${id}`, { method: 'DELETE' });
```
- API thin de tutores sin caché (reutiliza `catalogCache` desde `catalogosApi.js` si lo necesita).

---

## Resumen de flujos completos

### Alta de Legajo
1. Usuario abre `legajos.html` → `legajos/page.js` carga catálogos (niños, tutores, estados) en paralelo.
2. Click "Nuevo Legajo" → `showModal()` abre formulario.
3. Usuario selecciona niño (buscador o lista) → `seleccionarNino()` almacena en estado local.
4. Llena fecha ingreso, estado, tutor (opcional), observaciones.
5. Submit → `bindForm()` valida, arma payload y llama `createLegajo()` de `api/legajosApi.js`.
6. API → `POST /api/Legajo` → `LegajoController.Post()` → valida y ejecuta `SP_Legajo_Insert`.
7. Éxito → callback `load()` refresca tabla, muestra toast "✅ Legajo creado correctamente".

### Autenticación
1. Usuario abre `auth.html` → `auth/login.js` verifica si hay sesión (`Session.isAuthenticated()`), redirige a dashboard si existe.
2. Ingresa usuario/contraseña, click "Iniciar Sesión" → `handleLogin()` valida campos y hace `POST /api/Auth/Login`.
3. API → `AuthController.Login()` busca usuario en BD, verifica hash con `PasswordHelper`, registra intento (fallido o exitoso), genera token.
4. Éxito → devuelve token y datos de usuario → `Session.setToken()/setUser()` guarda en storage (session o local según "recordar").
5. `setupAuthInterceptor()` captura todas las futuras llamadas fetch a `/api/*` y agrega `Authorization: Bearer <token>`.
6. Navega a `dashboard.html` → `utils/authGuard.js` (`requireAuth()`) valida token en background vía `GET /api/Auth/ValidateToken`.
7. Si token es inválido → logout y redirect a `auth.html`.

### Creación de Alerta
1. Usuario abre `alertas.html` → `alertas/page.js` carga en paralelo catálogos (tipos, prioridades, estados) y alertas existentes.
2. Inicializa paginación (`utils/pagination.js`) y renderiza primera página con `alertas/table.js` (`rowTemplate`).
3. Click "Nueva Alerta" → abre modal → `alertas/form.js` (`loadCatalogos()`) ya cargó selects.
4. Usuario selecciona legajo, tipo, prioridad, descripción, fecha vencimiento.
5. Submit → `bindAlertaForm()` valida, arma payload y llama `createAlerta()` de `api/alertasApi.js`.
6. API → `POST /api/Alerta` → `AlertaController.Post()` valida y ejecuta `SP_Alerta_Insert`.
7. Éxito → invalida caches (`dataCache.invalidate('alertas-list')`) → callback refresca con filtros actuales → toast "✅ Alerta creada exitosamente".

### Sistema de Caché
- Catálogos (estados, tipos, prioridades): TTL 5 minutos vía `catalogCache` (`utils/cache.js`).
- Datos dinámicos (alertas, legajos): TTL 1-2 minutos vía `dataCache`; invalidación explícita al crear/actualizar/borrar.
- Cleanup automático cada 10 minutos borra entradas expiradas.
- Fallback a datos expirados si falla fetch de datos frescos (resiliencia ante caídas de red).

