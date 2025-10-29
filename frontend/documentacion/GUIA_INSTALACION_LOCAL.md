# 🚀 Guía de Instalación y Ejecución Local

> **Sistema de Gestión de Residencias** - Guía completa para configurar y ejecutar el sistema localmente

![Versión](https://img.shields.io/badge/versión-1.0-blue)
![Backend](https://img.shields.io/badge/backend-.NET_Framework_4.7.2-purple)
![BD](https://img.shields.io/badge/database-SQL_Server-red)
![Frontend](https://img.shields.io/badge/frontend-HTML5_+_JS-green)

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#-requisitos-previos)
2. [Instalación de SQL Server](#-instalación-de-sql-server)
3. [Configuración de la Base de Datos](#-configuración-de-la-base-de-datos)
4. [Configuración de la API](#-configuración-de-la-api)
5. [Configuración del Frontend](#-configuración-del-frontend)
6. [Verificación del Sistema](#-verificación-del-sistema)
7. [Solución de Problemas](#-solución-de-problemas)

---

## 🔧 Requisitos Previos

### Software Necesario

#### 1. SQL Server (Base de Datos)
- **SQL Server 2019 o superior** (Express Edition es suficiente)
- **SQL Server Management Studio (SSMS) 18 o superior**

**Descarga:**
- SQL Server Express: https://www.microsoft.com/es-es/sql-server/sql-server-downloads
- SSMS: https://aka.ms/ssmsfullsetup

#### 2. Visual Studio (Para API)
- **Visual Studio 2019 o 2022** (Community Edition es gratuita)
- **Workloads requeridas:**
  - ASP.NET y desarrollo web
  - Desarrollo de .NET Framework

**Descarga:**
- Visual Studio: https://visualstudio.microsoft.com/es/downloads/

#### 3. Servidor Web Local (Para Frontend)
**Elige una de estas opciones:**

**Opción A: Python** (Recomendado - Simple)
- Python 3.8 o superior
- Descarga: https://www.python.org/downloads/

**Opción B: Node.js**
- Node.js 16 o superior
- Descarga: https://nodejs.org/

**Opción C: Visual Studio Code con Live Server**
- VS Code + Extensión "Live Server"
- Descarga: https://code.visualstudio.com/

---

## 🗄️ Instalación de SQL Server

### Paso 1: Instalar SQL Server Express

1. **Descargar SQL Server Express** desde el link mencionado
2. **Ejecutar el instalador** y seleccionar "Instalación básica"
3. **Configuración importante:**
   - Instancia: `SQLEXPRESS`
   - Autenticación: **Modo mixto** (Windows + SQL Server)
   - Crear contraseña para usuario `sa` (opcional pero recomendado)

4. **Anotar el nombre del servidor**, usualmente será:
   ```
   TU_NOMBRE_PC\SQLEXPRESS
   ```
   Por ejemplo: `JORDYPC\SQLEXPRESS`

### Paso 2: Instalar SQL Server Management Studio (SSMS)

1. Descargar e instalar SSMS
2. Reiniciar el equipo si es necesario

### Paso 3: Configurar SQL Server

1. **Abrir SQL Server Configuration Manager**
2. **Habilitar TCP/IP:**
   - Ir a "SQL Server Network Configuration" → "Protocols for SQLEXPRESS"
   - Click derecho en "TCP/IP" → "Enable"
   - Reiniciar el servicio SQL Server

3. **Verificar que el servicio esté corriendo:**
   - Abrir "Servicios" de Windows (services.msc)
   - Buscar "SQL Server (SQLEXPRESS)"
   - Estado debe ser "En ejecución"

---

## 💾 Configuración de la Base de Datos

### Paso 1: Conectar con SSMS

1. **Abrir SQL Server Management Studio**
2. **Configurar conexión:**
   ```
   Tipo de servidor: Motor de base de datos
   Nombre del servidor: TU_NOMBRE_PC\SQLEXPRESS
   Autenticación: Autenticación de Windows
   ```
3. Click en **"Conectar"**

### Paso 2: Ejecutar Script de Base de Datos

1. **Abrir el script:**
   - En SSMS: File → Open → File
   - Navegar a: `ResidenciaApp/db/bd.sql`
   - Click en "Abrir"

2. **Ejecutar el script:**
   - Verificar que esté seleccionada la conexión correcta
   - Click en el botón **"Ejecutar" (F5)** o icono de play verde
   - El script creará automáticamente:
     - Base de datos `ResidenciaDB`
     - Todas las tablas necesarias
     - Datos de prueba (catálogos)

3. **Verificar creación exitosa:**
   ```sql
   -- Ejecutar esta consulta para verificar
   SELECT name FROM sys.databases WHERE name = 'ResidenciaDB';
   
   -- Verificar tablas creadas
   USE ResidenciaDB;
   GO
   SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;
   ```

### Paso 3: Verificar Datos de Prueba

```sql
USE ResidenciaDB;
GO

-- Verificar catálogos cargados
SELECT * FROM dbo.Estado;
SELECT * FROM dbo.TipoAlerta;
SELECT * FROM dbo.Prioridad;
SELECT * FROM dbo.EstadoAlerta;
```

Deberías ver datos en estas tablas. Si están vacías, revisar el script `bd.sql`.

---

## 🔌 Configuración de la API

### Paso 1: Abrir Solución en Visual Studio

1. **Navegar a la carpeta:** `ResidenciaApp/api/`
2. **Doble click en:** `ResidenciaWebApp.sln`
3. Visual Studio abrirá la solución automáticamente

### Paso 2: Configurar Cadena de Conexión

1. **Abrir archivo:** `WebApi/Web.config`
2. **Localizar sección connectionStrings** (línea 7-11):

   ```xml
   <connectionStrings>
       <add name="ResidenciaDB"
            connectionString="Data Source=TU_NOMBRE_PC\SQLEXPRESS;Initial Catalog=ResidenciaDB;Integrated Security=True;MultipleActiveResultSets=True"
            providerName="System.Data.SqlClient" />
   </connectionStrings>
   ```

3. **Modificar `Data Source`** con el nombre de tu servidor SQL:
   - Reemplazar `TU_NOMBRE_PC\SQLEXPRESS` con tu instancia
   - Por ejemplo: `DESKTOP-ABC123\SQLEXPRESS`

4. **Si usas autenticación SQL Server** (en lugar de Windows):
   ```xml
   connectionString="Data Source=TU_PC\SQLEXPRESS;Initial Catalog=ResidenciaDB;User Id=sa;Password=TuContraseña;MultipleActiveResultSets=True"
   ```

### Paso 3: Restaurar Paquetes NuGet

1. En Visual Studio: **Tools → NuGet Package Manager → Manage NuGet Packages for Solution**
2. Si hay paquetes faltantes, click en **"Restore"**
3. Esperar a que se descarguen todas las dependencias

### Paso 4: Compilar la Solución

1. **Build → Rebuild Solution** (Ctrl + Shift + B)
2. Verificar que no haya errores en la ventana "Output"
3. Debe mostrar: `Build succeeded`

### Paso 5: Ejecutar la API

1. **Configurar proyecto de inicio:**
   - Click derecho en "WebApi" → "Set as Startup Project"

2. **Ejecutar en modo debug:**
   - Presionar **F5** o click en el botón verde "IIS Express"
   - Se abrirá un navegador automáticamente

3. **Acceder a Swagger UI:**
   ```
   http://localhost:PUERTO/swagger
   ```
   El puerto será asignado automáticamente (usualmente 44300-44399)

4. **Verificar endpoints disponibles:**
   - Deberías ver la interfaz de Swagger con todos los controladores
   - Endpoints principales: `Alerta`, `Legajo`, `Nino`, `Tutor`, `Estado`, etc.

### Paso 6: Probar Endpoints en Swagger

1. **Expandir un endpoint**, por ejemplo: `GET /api/Nino`
2. Click en **"Try it out"**
3. Click en **"Execute"**
4. Verificar respuesta exitosa (Status 200)

---

## 🎨 Configuración del Frontend

### Paso 1: Ubicar Archivos del Frontend

Los archivos del frontend están en: `ResidenciaApp/frontend/`

### Paso 2: Configurar URL de la API

1. **Abrir archivo:** `frontend/assets/js/utils/http.js`
2. **Localizar la constante `API_BASE_URL`** (primera línea):

   ```javascript
   const API_BASE_URL = 'http://localhost:PUERTO_API';
   ```

3. **Reemplazar con el puerto de tu API:**
   - Si tu API corre en `https://localhost:44300`, usar:
     ```javascript
     const API_BASE_URL = 'https://localhost:44300';
     ```
   - **Importante:** Incluir `https://` si usas SSL

4. **Guardar cambios**

### Paso 3: Iniciar Servidor Web Local

#### Opción A: Con Python (Recomendado)

```bash
# Abrir terminal/PowerShell en la carpeta del proyecto
cd C:\Users\jordy\Desktop\ResidenciaApp\frontend

# Iniciar servidor HTTP en puerto 5500
python -m http.server 5500

# O en sistemas Windows con Python 3:
py -m http.server 5500
```

**Salida esperada:**
```
Serving HTTP on :: port 5500 (http://[::]:5500/) ...
```

#### Opción B: Con Node.js

```bash
# Navegar a la carpeta
cd C:\Users\jordy\Desktop\ResidenciaApp\frontend

# Instalar serve globalmente (solo primera vez)
npm install -g serve

# Iniciar servidor
serve -l 5500
```

#### Opción C: Con VS Code Live Server

1. **Abrir carpeta frontend en VS Code:**
   - File → Open Folder → Seleccionar `ResidenciaApp/frontend`

2. **Instalar extensión "Live Server":**
   - Ir a Extensions (Ctrl + Shift + X)
   - Buscar "Live Server"
   - Instalar extensión de Ritwick Dey

3. **Configurar puerto (opcional):**
   - File → Preferences → Settings
   - Buscar "Live Server Port"
   - Cambiar a `5500`

4. **Iniciar servidor:**
   - Click derecho en `index.html` o `dashboard.html`
   - Seleccionar **"Open with Live Server"**

### Paso 4: Acceder al Sistema

1. **Abrir navegador** (Chrome, Edge, Firefox)
2. **Navegar a:**
   ```
   http://localhost:5500/dashboard.html
   ```

3. **Páginas disponibles:**
   - Dashboard: `http://localhost:5500/dashboard.html`
   - Alertas: `http://localhost:5500/alertas.html`
   - Legajos: `http://localhost:5500/legajos.html`
   - Niños: `http://localhost:5500/ninos.html`
   - Tutores: `http://localhost:5500/tutores.html`
   - Reportes: `http://localhost:5500/reportes_alertas.html`

---

## ✅ Verificación del Sistema

### Checklist de Verificación

#### ✅ Base de Datos
```sql
-- En SSMS, ejecutar:
USE ResidenciaDB;
GO

-- Verificar conexión
SELECT @@VERSION;

-- Verificar tablas
SELECT COUNT(*) as TotalTablas 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';
-- Debe retornar al menos 9 tablas

-- Verificar datos de prueba
SELECT 'Estados' as Tabla, COUNT(*) as Registros FROM Estado
UNION ALL
SELECT 'TipoAlerta', COUNT(*) FROM TipoAlerta
UNION ALL
SELECT 'Prioridad', COUNT(*) FROM Prioridad
UNION ALL
SELECT 'EstadoAlerta', COUNT(*) FROM EstadoAlerta;
```

#### ✅ API (Backend)

1. **Verificar que la API esté corriendo:**
   - En Visual Studio, debe aparecer "Running" en la barra inferior
   - Navegador debe mostrar la página de inicio o Swagger

2. **Probar endpoint de prueba:**
   ```
   GET https://localhost:PUERTO/api/Estado
   ```
   Debe retornar JSON con estados de legajo

3. **Verificar CORS (Importante):**
   - Abrir DevTools del navegador (F12)
   - Ir a Console
   - No deben aparecer errores de CORS

#### ✅ Frontend

1. **Verificar carga de recursos:**
   - Abrir DevTools → Network
   - Recargar página
   - Verificar que todos los recursos carguen (status 200)
   - No deben aparecer errores 404 en CSS/JS

2. **Probar funcionalidades básicas:**
   - [ ] Dashboard carga con KPIs
   - [ ] Módulo Alertas muestra tabla
   - [ ] Módulo Legajos muestra tabla
   - [ ] Módulo Niños carga correctamente
   - [ ] Modal de crear alerta/legajo abre correctamente

3. **Verificar conexión API:**
   - Ir a cualquier módulo (ej: Niños)
   - Abrir DevTools → Network
   - Verificar que se hagan requests a `localhost:PUERTO_API`
   - Response debe ser status 200 con datos JSON

---

## 🐛 Solución de Problemas

### Problema 1: Error de Conexión a SQL Server

**Síntoma:**
```
Cannot connect to NOMBRE_PC\SQLEXPRESS
```

**Soluciones:**

1. **Verificar servicio corriendo:**
   ```powershell
   # En PowerShell como Administrador
   Get-Service | Where-Object {$_.Name -like "*SQL*"}
   ```
   Si está detenido:
   ```powershell
   Start-Service MSSQL$SQLEXPRESS
   ```

2. **Verificar nombre del servidor:**
   - Abrir SSMS
   - En la ventana de conexión, click en el dropdown "Nombre del servidor"
   - Seleccionar "Browse for more..." → "Database Engine"
   - Ver el nombre exacto de tu instancia

3. **Habilitar protocolos:**
   - SQL Server Configuration Manager
   - SQL Server Network Configuration → Protocols for SQLEXPRESS
   - Habilitar "Named Pipes" y "TCP/IP"
   - Reiniciar servicio

### Problema 2: Error CORS en el Frontend

**Síntoma:**
```
Access to fetch at 'https://localhost:44300/api/Nino' from origin 'http://localhost:5500' 
has been blocked by CORS policy
```

**Solución:**

1. **Verificar configuración CORS en la API:**
   - Abrir: `api/WebApi/App_Start/WebApiConfig.cs`
   - Debe contener:
     ```csharp
     config.EnableCors();
     ```

2. **Verificar decoradores en controladores:**
   - Abrir cualquier controlador (ej: `Controllers/NinoController.cs`)
   - Debe tener:
     ```csharp
     [EnableCors(origins: "*", headers: "*", methods: "*")]
     public class NinoController : ApiController
     ```

3. **Verificar paquete NuGet:**
   - En Visual Studio: Tools → NuGet Package Manager → Package Manager Console
   - Ejecutar:
     ```powershell
     Install-Package Microsoft.AspNet.WebApi.Cors -Version 5.3.0
     ```

4. **Reiniciar la API** después de cambios

### Problema 3: Frontend no Carga Datos

**Síntoma:**
- Tablas vacías
- Loading infinito
- No aparecen datos en el dashboard

**Diagnóstico:**

1. **Abrir DevTools (F12) → Console**
   - Ver si hay errores en rojo
   - Anotar mensajes de error

2. **Abrir DevTools → Network**
   - Recargar página
   - Ver requests a la API
   - Si están en rojo (failed), hacer click para ver detalles

**Soluciones:**

1. **API no está corriendo:**
   - Verificar que Visual Studio tenga el proyecto ejecutándose
   - Verificar puerto correcto en `http.js`

2. **URL incorrecta en `http.js`:**
   ```javascript
   // Verificar que la URL coincida con la API
   const API_BASE_URL = 'https://localhost:44300'; // Ajustar puerto
   ```

3. **Certificado SSL no confiable:**
   - En el navegador, navegar directamente a: `https://localhost:PUERTO/api/Nino`
   - Si aparece advertencia de seguridad, click en "Avanzado" → "Continuar de todos modos"
   - Volver al frontend y recargar

### Problema 4: Error al Compilar la API

**Síntoma:**
```
Build failed. Errors in Error List
```

**Soluciones:**

1. **Restaurar paquetes NuGet:**
   - Click derecho en solución → "Restore NuGet Packages"
   - Esperar a que termine
   - Build → Rebuild Solution

2. **Limpiar y recompilar:**
   - Build → Clean Solution
   - Build → Rebuild Solution

3. **Verificar versión de .NET Framework:**
   - Click derecho en proyecto "WebApi" → Properties
   - Target Framework debe ser: **.NET Framework 4.7.2**
   - Si es diferente, cambiar y aceptar

4. **Reinstalar paquetes problemáticos:**
   ```powershell
   # En Package Manager Console
   Update-Package -Reinstall
   ```

### Problema 5: Puerto Ocupado

**Síntoma:**
```
Port 5500 is already in use
```

**Soluciones:**

1. **Cerrar procesos usando el puerto:**
   ```powershell
   # Ver qué proceso usa el puerto
   netstat -ano | findstr :5500
   
   # Matar proceso (reemplazar PID)
   taskkill /PID NUMERO_PID /F
   ```

2. **Usar otro puerto:**
   ```bash
   # Con Python
   python -m http.server 8080
   
   # Acceder a: http://localhost:8080
   ```

### Problema 6: Swagger no Aparece

**Síntoma:**
- Al acceder a `/swagger` aparece error 404

**Solución:**

1. **Verificar instalación de Swashbuckle:**
   - Tools → NuGet Package Manager → Manage Packages
   - Buscar "Swashbuckle" (debe estar instalado)
   - Versión: 5.6.0

2. **Verificar archivo de configuración:**
   - Abrir: `App_Start/SwaggerConfig.cs`
   - Debe existir y tener configuración válida

3. **Acceder a URL correcta:**
   ```
   https://localhost:PUERTO/swagger/ui/index
   ```

---

## 📊 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      NAVEGADOR WEB                          │
│                  http://localhost:5500                      │
│                                                             │
│  ┌────────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐ │
│  │ Dashboard  │  │ Alertas  │  │ Legajos │  │  Niños   │ │
│  └────────────┘  └──────────┘  └─────────┘  └──────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ HTTP/HTTPS Requests
                          │ (Fetch API)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│               API REST (.NET Web API)                       │
│             https://localhost:44300/api                     │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐   │
│  │ Alerta   │  │ Legajo   │  │  Nino   │  │  Tutor   │   │
│  │Controller│  │Controller│  │Controller│ │Controller│   │
│  └──────────┘  └──────────┘  └─────────┘  └──────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Swagger UI Documentation                  │   │
│  │        https://localhost:44300/swagger              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ ADO.NET / Entity Framework
                          │ (Connection String)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│             SQL SERVER (SQLEXPRESS)                         │
│           NOMBRE_PC\SQLEXPRESS                              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            ResidenciaDB                              │  │
│  │                                                      │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │  │
│  │  │ Nino   │ │ Tutor  │ │ Legajo │ │ Alerta │      │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘      │  │
│  │  ┌────────┐ ┌──────────┐ ┌──────────────┐        │  │
│  │  │ Estado │ │TipoAlerta│ │ EstadoAlerta │        │  │
│  │  └────────┘ └──────────┘ └──────────────┘        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Credenciales y Configuración

### Base de Datos
```
Servidor: NOMBRE_PC\SQLEXPRESS
Autenticación: Windows Authentication (recomendado)
Base de datos: ResidenciaDB
```

### API
```
URL Local: https://localhost:PUERTO_DINAMICO
Swagger UI: https://localhost:PUERTO/swagger
CORS: Habilitado para http://localhost:5500
```

### Frontend
```
URL Local: http://localhost:5500
Servidor: Python HTTP Server / Live Server
```

---

## 📁 Estructura de Archivos Clave

```
ResidenciaApp/
│
├── db/
│   └── bd.sql                          # ⚠️ Script de base de datos
│
├── api/
│   ├── ResidenciaWebApp.sln            # ⚠️ Solución de Visual Studio
│   └── WebApi/
│       ├── Web.config                  # ⚠️ Configuración (Connection String)
│       ├── Controllers/                # Controladores API
│       ├── Models/                     # Modelos de datos
│       └── App_Start/
│           ├── WebApiConfig.cs         # ⚠️ Configuración CORS
│           └── SwaggerConfig.cs        # Configuración Swagger
│
└── frontend/
    ├── dashboard.html                  # Página principal
    ├── alertas.html                    # Módulo alertas
    ├── legajos.html                    # Módulo legajos
    ├── assets/
    │   └── js/
    │       └── utils/
    │           └── http.js             # ⚠️ URL de la API
    └── README.md                       # Documentación frontend

⚠️ = Archivos que requieren configuración
```

---

## 🚦 Orden de Inicio Recomendado

### Primera Vez (Instalación Completa)

1. ✅ **Instalar SQL Server + SSMS** (20-30 min)
2. ✅ **Ejecutar script `bd.sql`** (1-2 min)
3. ✅ **Instalar Visual Studio + .NET** (30-40 min)
4. ✅ **Abrir solución y restaurar paquetes** (5-10 min)
5. ✅ **Configurar `Web.config`** (2 min)
6. ✅ **Compilar y ejecutar API** (2-3 min)
7. ✅ **Configurar `http.js` en frontend** (1 min)
8. ✅ **Iniciar servidor web para frontend** (1 min)
9. ✅ **Verificar sistema completo** (5 min)

**Tiempo total estimado:** 1-2 horas (primera vez con instalaciones)

### Inicio Diario (Sistema Ya Configurado)

1. ✅ **Verificar SQL Server corriendo** (10 seg)
2. ✅ **Abrir Visual Studio y ejecutar API (F5)** (30-60 seg)
3. ✅ **Iniciar servidor frontend** (10 seg)
   ```bash
   cd frontend
   python -m http.server 5500
   ```
4. ✅ **Abrir navegador en `http://localhost:5500/dashboard.html`**

**Tiempo total:** 2-3 minutos

---

## 📞 Soporte y Recursos

### Documentación Adicional
- **Frontend:** `frontend/README.md`
- **Backend:** `frontend/BACKEND_SETUP.md`
- **Módulo Alertas:** `frontend/MODULO_ALERTAS_IMPLEMENTACION.md`
- **Base de Datos:** Comentarios en `db/bd.sql`

### Herramientas Útiles
- **SSMS:** Para gestionar base de datos
- **Postman:** Para probar endpoints de la API
- **Browser DevTools (F12):** Para debugging del frontend

### Comandos Útiles

```bash
# Ver puertos en uso
netstat -ano | findstr :5500
netstat -ano | findstr :44300

# Verificar servicios SQL Server
Get-Service | Where-Object {$_.Name -like "*SQL*"}

# Iniciar servicio SQL
net start MSSQL$SQLEXPRESS

# Detener servicio SQL
net stop MSSQL$SQLEXPRESS
```

---

## ✅ Checklist Final

### Antes de Empezar a Desarrollar

- [ ] SQL Server instalado y corriendo
- [ ] Base de datos `ResidenciaDB` creada con datos de prueba
- [ ] Visual Studio instalado con workload ASP.NET
- [ ] Solución `ResidenciaWebApp.sln` abre sin errores
- [ ] Cadena de conexión configurada en `Web.config`
- [ ] API compila sin errores (Build succeeded)
- [ ] API ejecuta y Swagger accesible
- [ ] Frontend accesible en `http://localhost:5500`
- [ ] URL de API configurada en `http.js`
- [ ] Dashboard carga correctamente con datos
- [ ] No hay errores de CORS en consola del navegador

---

## 🎉 ¡Sistema Listo!

Si completaste todos los pasos correctamente, deberías tener:

✅ **Base de datos operativa** con todas las tablas y datos de prueba  
✅ **API REST funcionando** con Swagger UI para documentación  
✅ **Frontend moderno** con todos los módulos operativos  
✅ **Integración completa** entre frontend y backend  
✅ **Sistema listo** para desarrollo y pruebas  

### Próximos Pasos

1. **Explorar Swagger UI** para conocer todos los endpoints disponibles
2. **Revisar módulos del frontend** (Dashboard, Alertas, Legajos, etc.)
3. **Probar funcionalidades CRUD** (Crear, Leer, Actualizar)
4. **Revisar documentación técnica** en carpeta `frontend/docs/`
5. **Comenzar a desarrollar** nuevas funcionalidades

---

**¿Problemas durante la instalación?** Revisa la sección [Solución de Problemas](#-solución-de-problemas) o consulta la documentación específica de cada componente.

---

**Desarrollado con ❤️ para facilitar la gestión de residencias infantiles**

*Última actualización: Octubre 2025*

