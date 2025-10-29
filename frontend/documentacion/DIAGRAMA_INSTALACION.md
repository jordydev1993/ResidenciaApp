# 📊 Diagramas de Instalación y Flujo del Sistema

> Representación visual de los procesos de instalación, configuración y flujo de datos

---

## 📋 Índice

1. [Flujo de Instalación Completa](#-flujo-de-instalación-completa)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Flujo de Datos](#-flujo-de-datos)
4. [Proceso de Inicio Diario](#-proceso-de-inicio-diario)
5. [Troubleshooting Flow](#-troubleshooting-flow)

---

## 🔄 Flujo de Instalación Completa

```
┌─────────────────────────────────────────────────────────────────┐
│                      INSTALACIÓN INICIAL                        │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ├─── [1] Instalar SQL Server Express
  │         │
  │         ├─ Descargar desde Microsoft
  │         ├─ Ejecutar instalador
  │         ├─ Configurar instancia: SQLEXPRESS
  │         ├─ Modo autenticación: Mixto
  │         └─ Anotar nombre: NOMBRE_PC\SQLEXPRESS
  │         │
  │         ✓ SQL Server instalado
  │         │
  │         v
  │    [2] Instalar SSMS
  │         │
  │         ├─ Descargar SSMS
  │         ├─ Instalar
  │         └─ Reiniciar (si es necesario)
  │         │
  │         ✓ SSMS instalado
  │         │
  │         v
  │    [3] Crear Base de Datos
  │         │
  │         ├─ Abrir SSMS
  │         ├─ Conectar a: NOMBRE_PC\SQLEXPRESS
  │         ├─ File → Open → db/bd.sql
  │         └─ Ejecutar script (F5)
  │         │
  │         ✓ Base de datos ResidenciaDB creada
  │         │
  │         v
  │    [4] Instalar Visual Studio
  │         │
  │         ├─ Descargar VS 2019/2022 Community
  │         ├─ Seleccionar workload: ASP.NET y desarrollo web
  │         ├─ Instalar .NET Framework 4.7.2
  │         └─ Esperar instalación (30-40 min)
  │         │
  │         ✓ Visual Studio instalado
  │         │
  │         v
  │    [5] Configurar API
  │         │
  │         ├─ Abrir: api/ResidenciaWebApp.sln
  │         ├─ Esperar carga y restauración de NuGet
  │         ├─ Editar Web.config:
  │         │   └─ Connection String → NOMBRE_PC\SQLEXPRESS
  │         ├─ Build → Rebuild Solution
  │         └─ Verificar: Build succeeded
  │         │
  │         ✓ API configurada y compilada
  │         │
  │         v
  │    [6] Ejecutar API
  │         │
  │         ├─ Presionar F5 en Visual Studio
  │         ├─ Esperar que abra navegador
  │         ├─ Navegar a /swagger
  │         └─ Anotar puerto (ej: 44300)
  │         │
  │         ✓ API corriendo con Swagger
  │         │
  │         v
  │    [7] Instalar Python (para frontend)
  │         │
  │         ├─ Descargar Python 3.8+
  │         ├─ Instalar (marcar "Add to PATH")
  │         └─ Verificar: python --version
  │         │
  │         ✓ Python instalado
  │         │
  │         v
  │    [8] Configurar Frontend
  │         │
  │         ├─ Editar: frontend/assets/js/utils/http.js
  │         └─ Actualizar API_BASE_URL con puerto de API
  │         │
  │         ✓ Frontend configurado
  │         │
  │         v
  │    [9] Ejecutar Frontend
  │         │
  │         ├─ Abrir terminal
  │         ├─ cd frontend
  │         ├─ python -m http.server 5500
  │         └─ Abrir: http://localhost:5500/dashboard.html
  │         │
  │         ✓ Frontend corriendo
  │         │
  │         v
  │    [10] Verificar Sistema
  │          │
  │          ├─ Dashboard carga correctamente
  │          ├─ No hay errores en consola (F12)
  │          ├─ Datos se cargan desde API
  │          └─ Todos los módulos funcionan
  │          │
  │          ✓ SISTEMA COMPLETAMENTE FUNCIONAL
  │          │
  │          v
  │        SUCCESS! 🎉

Tiempo estimado total: 1-2 horas (primera vez)
```

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUARIO FINAL                               │
│                      (Navegador Web)                                │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTP GET/POST
                             │ Port 5500
                             │
                             v
┌─────────────────────────────────────────────────────────────────────┐
│                       CAPA DE PRESENTACIÓN                          │
│                       (Frontend - Cliente)                          │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  dashboard   │  │   alertas    │  │   legajos    │            │
│  │    .html     │  │    .html     │  │    .html     │   + más    │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  JavaScript Modules (ES6+)                                   │ │
│  │  - api/ (clientes HTTP)                                      │ │
│  │  - utils/ (helpers, DOM, modals)                             │ │
│  │  - alertas/, legajos/, dashboard/ (lógica por módulo)        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  UI Libraries (CDN)                                          │ │
│  │  - Tailwind CSS   - Bootstrap Icons   - Chart.js            │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ HTTPS Fetch API
                             │ JSON Request/Response
                             │ Port: 44300-44399
                             │
                             v
┌─────────────────────────────────────────────────────────────────────┐
│                      CAPA DE LÓGICA DE NEGOCIO                      │
│                    (Backend API - .NET Web API)                     │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Controllers (API REST)                                      │ │
│  │                                                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │   Alerta    │  │   Legajo    │  │    Nino     │        │ │
│  │  │ Controller  │  │ Controller  │  │ Controller  │  +más  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  │                                                              │ │
│  │  [GET]    /api/Alerta         → Listar alertas             │ │
│  │  [POST]   /api/Alerta         → Crear alerta               │ │
│  │  [POST]   /api/Alerta/{id}/completar → Completar alerta    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Models (Entidades de datos)                                │ │
│  │  - Alerta.cs    - Legajo.cs    - Nino.cs    - Tutor.cs     │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Middlewares                                                 │ │
│  │  - CORS (Cross-Origin Resource Sharing)                     │ │
│  │  - Authentication (preparado)                                │ │
│  │  - Error Handling                                            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Swagger UI                                                  │ │
│  │  Documentación interactiva: /swagger                         │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ ADO.NET / SQL Client
                             │ Connection String
                             │ Port: 1433
                             │
                             v
┌─────────────────────────────────────────────────────────────────────┐
│                      CAPA DE PERSISTENCIA                           │
│                  (SQL Server - Base de Datos)                       │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  ResidenciaDB                                                │ │
│  │                                                              │ │
│  │  Tablas Principales:                                         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │ │
│  │  │   Nino   │──│  Legajo  │──│  Alerta  │  │  Tutor   │   │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │ │
│  │                                                              │ │
│  │  Catálogos:                                                  │ │
│  │  ┌──────────┐  ┌────────────┐  ┌─────────────┐            │ │
│  │  │  Estado  │  │ TipoAlerta │  │ EstadoAlerta│  +más      │ │
│  │  └──────────┘  └────────────┘  └─────────────┘            │ │
│  │                                                              │ │
│  │  Features:                                                   │ │
│  │  ✓ Relaciones con Foreign Keys                              │ │
│  │  ✓ Constraints (UNIQUE, NOT NULL)                           │ │
│  │  ✓ Campos de auditoría (FechaCreacion, Usuario...)          │ │
│  │  ✓ Identity para IDs autoincrementales                      │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔀 Flujo de Datos (Ejemplo: Crear Alerta)

```
USUARIO                FRONTEND             API                BASE DATOS
  │                      │                   │                    │
  │ 1. Click "Nueva      │                   │                    │
  │    Alerta"           │                   │                    │
  ├─────────────────────>│                   │                    │
  │                      │                   │                    │
  │                      │ 2. Abrir modal    │                    │
  │                      │    Cargar         │                    │
  │                      │    catálogos      │                    │
  │                      │                   │                    │
  │                      │ 3. GET /api/      │                    │
  │                      │    TipoAlerta     │                    │
  │                      ├──────────────────>│                    │
  │                      │                   │ 4. SELECT *        │
  │                      │                   │    FROM            │
  │                      │                   │    TipoAlerta      │
  │                      │                   ├───────────────────>│
  │                      │                   │                    │
  │                      │                   │ 5. Resultados      │
  │                      │                   │<───────────────────┤
  │                      │ 6. JSON Response  │                    │
  │                      │<──────────────────┤                    │
  │                      │                   │                    │
  │                      │ 7. Renderizar     │                    │
  │                      │    select con     │                    │
  │ 8. Ver formulario    │    opciones       │                    │
  │<─────────────────────┤                   │                    │
  │                      │                   │                    │
  │ 9. Llenar datos y    │                   │                    │
  │    click "Guardar"   │                   │                    │
  ├─────────────────────>│                   │                    │
  │                      │                   │                    │
  │                      │ 10. Validar       │                    │
  │                      │     campos        │                    │
  │                      │                   │                    │
  │                      │ 11. POST /api/    │                    │
  │                      │     Alerta        │                    │
  │                      │     {JSON data}   │                    │
  │                      ├──────────────────>│                    │
  │                      │                   │                    │
  │                      │                   │ 12. Validar        │
  │                      │                   │     modelo         │
  │                      │                   │                    │
  │                      │                   │ 13. INSERT INTO    │
  │                      │                   │     Alerta         │
  │                      │                   │     VALUES(...)    │
  │                      │                   ├───────────────────>│
  │                      │                   │                    │
  │                      │                   │ 14. ID generado    │
  │                      │                   │<───────────────────┤
  │                      │                   │                    │
  │                      │ 15. HTTP 201      │                    │
  │                      │     Created       │                    │
  │                      │<──────────────────┤                    │
  │                      │                   │                    │
  │                      │ 16. Cerrar modal  │                    │
  │                      │     Mostrar toast │                    │
  │                      │     Recargar tabla│                    │
  │                      │                   │                    │
  │ 17. Ver alerta       │                   │                    │
  │     creada           │                   │                    │
  │<─────────────────────┤                   │                    │
  │                      │                   │                    │

Tiempo total: ~500-1000ms
```

---

## ⏱️ Proceso de Inicio Diario

```
┌─────────────────────────────────────────────────────────────┐
│                   INICIO DIARIO DEL SISTEMA                 │
│              (Una vez todo está configurado)                │
└─────────────────────────────────────────────────────────────┘

START
  │
  ├─── OPCIÓN A: Automático (Recomendado)
  │         │
  │         └─ Ejecutar: .\iniciar-sistema.ps1
  │         │
  │         ├─ [Script verifica SQL Server]
  │         ├─ [Script abre Visual Studio]
  │         ├─ [Script inicia servidor frontend]
  │         └─ [Script abre navegador]
  │         │
  │         v
  │     Acción manual: Presionar F5 en Visual Studio
  │         │
  │         v
  │     SISTEMA LISTO ✓
  │
  └─── OPCIÓN B: Manual
            │
            ├─── [PASO 1] Verificar SQL Server
            │         │
            │         └─ PowerShell: Get-Service MSSQL$SQLEXPRESS
            │         │
            │         ├─ ¿Está corriendo?
            │         │   ├─ Sí → Continuar
            │         │   └─ No → net start MSSQL$SQLEXPRESS
            │         │
            │         v
            │     ✓ SQL Server corriendo
            │         │
            ├─── [PASO 2] Iniciar API
            │         │
            │         ├─ Abrir Visual Studio
            │         ├─ File → Open → api/ResidenciaWebApp.sln
            │         ├─ Esperar carga (10-20 seg)
            │         └─ Presionar F5
            │         │
            │         v
            │     ✓ API corriendo
            │     (Navegador abre automáticamente)
            │         │
            ├─── [PASO 3] Iniciar Frontend
            │         │
            │         ├─ Abrir terminal/PowerShell
            │         ├─ cd C:\Users\...\ResidenciaApp\frontend
            │         └─ python -m http.server 5500
            │         │
            │         v
            │     ✓ Frontend corriendo
            │         │
            └─── [PASO 4] Acceder al Sistema
                      │
                      ├─ Abrir navegador
                      └─ http://localhost:5500/dashboard.html
                      │
                      v
                  ✓ SISTEMA LISTO ✓

Tiempo total: 2-3 minutos
```

---

## 🔧 Troubleshooting Flow

```
┌─────────────────────────────────────────────────────────────┐
│              DIAGRAMA DE TROUBLESHOOTING                    │
└─────────────────────────────────────────────────────────────┘

PROBLEMA: Sistema no funciona
  │
  ├─── ¿Frontend carga la página?
  │     │
  │     ├─ NO → ¿Servidor HTTP corriendo?
  │     │   │
  │     │   ├─ NO → python -m http.server 5500
  │     │   │
  │     │   └─ SÍ → ¿Puerto correcto? (5500)
  │     │       │
  │     │       ├─ NO → Cambiar puerto o verificar conflictos
  │     │       │       netstat -ano | findstr :5500
  │     │       │
  │     │       └─ SÍ → Verificar archivos HTML existen
  │     │
  │     └─ SÍ → Continuar...
  │         │
  │         ├─── ¿Muestra datos en tablas?
  │         │     │
  │         │     ├─ NO → Abrir DevTools (F12) → Console
  │         │     │   │
  │         │     │   ├─── ¿Errores de CORS?
  │         │     │   │     │
  │         │     │   │     └─ SÍ → Verificar API:
  │         │     │   │           - WebApiConfig.cs tiene EnableCors()
  │         │     │   │           - Controllers tienen [EnableCors]
  │         │     │   │           - Reiniciar API
  │         │     │   │
  │         │     │   ├─── ¿Error de conexión (net::ERR)?
  │         │     │   │     │
  │         │     │   │     └─ SÍ → Verificar:
  │         │     │   │           - API está corriendo
  │         │     │   │           - Puerto correcto en http.js
  │         │     │   │           - URL correcta (https/http)
  │         │     │   │
  │         │     │   └─── ¿Error 500?
  │         │     │         │
  │         │     │         └─ SÍ → Problema en API o BD
  │         │     │               Ver logs de Visual Studio
  │         │     │
  │         │     └─ SÍ → ✓ Frontend OK
  │         │
  │         └─── API
  │               │
  │               ├─── ¿API está corriendo?
  │               │     │
  │               │     ├─ NO → Abrir Visual Studio → F5
  │               │     │   │
  │               │     │   ├─ ¿Compila con errores?
  │               │     │   │   │
  │               │     │   │   └─ SÍ → Ver Error List
  │               │     │   │         - Restaurar NuGet
  │               │     │   │         - Clean + Rebuild
  │               │     │   │
  │               │     │   └─ NO → Continuar
  │               │     │
  │               │     └─ SÍ → ¿Swagger accesible?
  │               │         │
  │               │         └─ NO → Verificar /swagger en URL
  │               │
  │               └─── ¿Endpoints responden?
  │                     │
  │                     ├─ NO → Ver logs en Visual Studio
  │                     │   │    Output window
  │                     │   │
  │                     │   └─ ¿Error de SQL?
  │                     │       │
  │                     │       └─ SÍ → Verificar BD
  │                     │
  │                     └─ SÍ → ✓ API OK
  │
  └─── Base de Datos
        │
        ├─── ¿SQL Server corriendo?
        │     │
        │     ├─ NO → net start MSSQL$SQLEXPRESS
        │     │   │
        │     │   └─ ¿Falla al iniciar?
        │     │       │
        │     │       └─ Ver logs de SQL Server
        │     │           Verificar instalación
        │     │
        │     └─ SÍ → Continuar
        │
        ├─── ¿Base de datos existe?
        │     │
        │     ├─ NO → Ejecutar: db/bd.sql en SSMS
        │     │
        │     └─ SÍ → Continuar
        │
        ├─── ¿Connection string correcto?
        │     │
        │     ├─ NO → Editar Web.config
        │     │       Verificar: NOMBRE_PC\SQLEXPRESS
        │     │
        │     └─ SÍ → ✓ BD OK
        │
        └─ ✓ TODOS LOS COMPONENTES OK
```

---

## 📊 Matriz de Estados del Sistema

| Componente | Verificación | Estado OK | Estado Error | Solución |
|------------|--------------|-----------|--------------|----------|
| **SQL Server** | `Get-Service MSSQL$SQLEXPRESS` | `Status: Running` | `Status: Stopped` o `null` | `net start MSSQL$SQLEXPRESS` |
| **Base de Datos** | `SELECT * FROM sys.databases WHERE name='ResidenciaDB'` | 1 registro | 0 registros | Ejecutar `db/bd.sql` |
| **API** | `Get-Process iisexpress` | Proceso existe | Proceso no existe | Abrir VS → F5 |
| **Swagger** | Navegador: `/swagger` | Página carga | Error 404 | Verificar Swashbuckle instalado |
| **Frontend** | `netstat -ano \| findstr :5500` | Conexión listada | Sin resultados | `python -m http.server 5500` |
| **Conexión API** | DevTools Console | Sin errores CORS | `CORS policy` error | Verificar `WebApiConfig.cs` |

---

## 🎯 Checklist Visual de Verificación

```
┌────────────────────────────────────────────────────────────┐
│              CHECKLIST DE VERIFICACIÓN                     │
└────────────────────────────────────────────────────────────┘

ANTES DE EMPEZAR A DESARROLLAR:

┌─ INFRAESTRUCTURA ────────────────────────────────────────┐
│ [ ] SQL Server instalado                                 │
│ [ ] SQL Server corriendo                                 │
│ [ ] SSMS instalado                                       │
│ [ ] Visual Studio instalado (con ASP.NET workload)      │
│ [ ] Python instalado (con PATH configurado)             │
└──────────────────────────────────────────────────────────┘

┌─ BASE DE DATOS ──────────────────────────────────────────┐
│ [ ] ResidenciaDB existe                                  │
│ [ ] Tablas creadas (Nino, Tutor, Legajo, Alerta, etc.)  │
│ [ ] Datos de prueba en catálogos                        │
│ [ ] Connection string configurado en Web.config          │
└──────────────────────────────────────────────────────────┘

┌─ API BACKEND ────────────────────────────────────────────┐
│ [ ] Solución abre en Visual Studio                       │
│ [ ] NuGet packages restaurados                           │
│ [ ] Compila sin errores (Build succeeded)               │
│ [ ] API ejecutándose (F5)                                │
│ [ ] Swagger UI accesible (/swagger)                      │
│ [ ] Endpoints responden (Status 200)                     │
└──────────────────────────────────────────────────────────┘

┌─ FRONTEND ───────────────────────────────────────────────┐
│ [ ] Servidor HTTP corriendo (puerto 5500)                │
│ [ ] URL de API configurada en http.js                   │
│ [ ] Dashboard accesible (localhost:5500/dashboard.html) │
│ [ ] Datos se cargan en tablas                           │
│ [ ] No hay errores en Console (F12)                     │
│ [ ] No hay errores CORS                                 │
└──────────────────────────────────────────────────────────┘

┌─ FUNCIONALIDAD ──────────────────────────────────────────┐
│ [ ] Dashboard muestra KPIs                               │
│ [ ] Módulo Alertas carga                                │
│ [ ] Módulo Legajos carga                                │
│ [ ] Módulo Niños carga                                  │
│ [ ] Módulo Tutores carga                                │
│ [ ] Modales abren correctamente                         │
│ [ ] Formularios validan datos                           │
│ [ ] Se puede crear nuevo registro                       │
└──────────────────────────────────────────────────────────┘

✓ TODO MARCADO = SISTEMA 100% FUNCIONAL
```

---

## 📈 Tiempos de Respuesta Esperados

```
┌────────────────────────────────────────────────────────────┐
│                   PERFORMANCE BENCHMARKS                   │
└────────────────────────────────────────────────────────────┘

Operación                          Tiempo Esperado   Estado
─────────────────────────────────────────────────────────────
Inicio SQL Server                  2-5 segundos      🟢 Normal
Abrir Visual Studio                10-20 segundos    🟢 Normal
Compilar API (primera vez)         15-30 segundos    🟢 Normal
Compilar API (incremental)         5-10 segundos     🟢 Normal
Iniciar API (F5)                   3-8 segundos      🟢 Normal
Iniciar Frontend (Python)          1-2 segundos      🟢 Normal
Carga inicial Dashboard            500ms - 1s        🟢 Normal
GET /api/Nino                      50-200ms          🟢 Normal
POST /api/Alerta                   100-300ms         🟢 Normal
Exportar PDF                       1-3 segundos      🟢 Normal
Exportar Excel                     500ms - 2s        🟢 Normal

🟢 Normal   🟡 Revisar   🔴 Problema

Si los tiempos son >3x lo esperado, verificar:
- Uso de CPU/RAM del sistema
- Disco duro (SSD recomendado)
- Antivirus que ralentice ejecución
```

---

## 💾 Rutas de Archivos Importantes

```
C:\Users\[USUARIO]\Desktop\ResidenciaApp\
│
├─ 📄 Web.config
│  └─ api\WebApi\Web.config
│     → Connection String (línea 8-10)
│
├─ 📄 http.js
│  └─ frontend\assets\js\utils\http.js
│     → API_BASE_URL (línea 1)
│
├─ 📄 bd.sql
│  └─ db\bd.sql
│     → Script completo de base de datos
│
└─ 📄 ResidenciaWebApp.sln
   └─ api\ResidenciaWebApp.sln
      → Solución principal de Visual Studio
```

---

**Tip:** Imprime esta guía visual como referencia rápida durante la instalación 📋

---

*Última actualización: Octubre 2025*

