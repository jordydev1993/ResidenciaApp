# 🏥 Sistema de Gestión de Residencias

> Sistema integral para la gestión de residencias infantiles con módulos de legajos, alertas, reportes y dashboard analítico.

![Estado](https://img.shields.io/badge/estado-producción-green)
![Versión](https://img.shields.io/badge/versión-2.0-blue)
![Backend](https://img.shields.io/badge/backend-.NET_Framework_4.7.2-purple)
![Frontend](https://img.shields.io/badge/frontend-HTML5_+_JS_+_Tailwind-green)
![BD](https://img.shields.io/badge/database-SQL_Server-red)

---

## 📋 Descripción

Sistema completo para la gestión de residencias infantiles que permite:

- ✅ **Gestión de Legajos**: Registro completo de niños, niñas y adolescentes
- ✅ **Sistema de Alertas**: Control de vencimientos con indicadores visuales
- ✅ **Dashboard Analítico**: KPIs y gráficos en tiempo real
- ✅ **Reportes**: Exportación a PDF y Excel con filtros avanzados
- ✅ **Catálogos**: Configuración de estados, tipos, prioridades
- ✅ **Auditoría**: Trazabilidad completa de usuarios y fechas

---

## 🚀 Inicio Rápido

### Opción 1: Scripts Automatizados (Recomendado)

```powershell
# 1. Verificar que todo esté instalado
.\verificar-sistema.ps1

# 2. Iniciar todo el sistema automáticamente
.\iniciar-sistema.ps1
```

### Opción 2: Manual

```bash
# 1. Crear base de datos
# Abrir SSMS y ejecutar: db/bd.sql

# 2. Iniciar API
# Abrir api/ResidenciaWebApp.sln en Visual Studio → F5

# 3. Iniciar Frontend
cd frontend
python -m http.server 5500

# 4. Acceder
# http://localhost:5500/dashboard.html
```

---

## 📖 Documentación

### 🎯 Documentos Principales

| Documento | Descripción | Para Quién |
|-----------|-------------|------------|
| **[GUIA_INSTALACION_LOCAL.md](GUIA_INSTALACION_LOCAL.md)** | Guía completa paso a paso | Primera instalación |
| **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** | Setup condensado en 5 minutos | Desarrolladores experimentados |
| **[frontend/README.md](frontend/README.md)** | Documentación del frontend | Desarrollo frontend |
| **[frontend/BACKEND_SETUP.md](frontend/BACKEND_SETUP.md)** | Configuración del backend | Desarrollo backend |

### 🔧 Scripts de Utilidad

| Script | Descripción | Uso |
|--------|-------------|-----|
| `verificar-sistema.ps1` | Diagnóstico completo del sistema | `.\verificar-sistema.ps1` |
| `iniciar-sistema.ps1` | Inicio automático de todos los componentes | `.\iniciar-sistema.ps1` |

### 📚 Documentación Adicional

- **[MODULO_ALERTAS_IMPLEMENTACION.md](frontend/MODULO_ALERTAS_IMPLEMENTACION.md)** - Módulo de alertas
- **[IMPLEMENTACION_COMPLETA.md](frontend/IMPLEMENTACION_COMPLETA.md)** - Diseño moderno
- **[INFORME_ALCANCES_FUNCIONALES.md](frontend/INFORME_ALCANCES_FUNCIONALES.md)** - Alcances funcionales

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Puerto 5500)                   │
│   Dashboard │ Alertas │ Legajos │ Niños │ Tutores │ ...    │
│                                                             │
│   HTML5 + JavaScript ES6+ + Tailwind CSS + Chart.js        │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/HTTPS
                          │ Fetch API
                          ▼
┌─────────────────────────────────────────────────────────────┐
│               API REST (Puerto Dinámico)                    │
│        .NET Framework 4.7.2 + ASP.NET Web API               │
│                                                             │
│   Controllers: Alerta │ Legajo │ Nino │ Tutor │ ...        │
│   Swagger UI: /swagger                                      │
└─────────────────────────┬───────────────────────────────────┘
                          │ ADO.NET
                          │ SQL Client
                          ▼
┌─────────────────────────────────────────────────────────────┐
│           SQL SERVER EXPRESS (Puerto 1433)                  │
│                   NOMBRE_PC\SQLEXPRESS                      │
│                                                             │
│   Base de Datos: ResidenciaDB                               │
│   Tablas: Nino, Tutor, Legajo, Alerta, Estado, ...         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Estructura del Proyecto

```
ResidenciaApp/
│
├── 📄 README.md                          # Este archivo
├── 📄 GUIA_INSTALACION_LOCAL.md          # Guía completa de instalación
├── 📄 INICIO_RAPIDO.md                   # Setup rápido
├── 🔧 verificar-sistema.ps1              # Script de verificación
├── 🔧 iniciar-sistema.ps1                # Script de inicio automático
│
├── 📁 db/                                # Base de Datos
│   └── bd.sql                            # Script SQL completo
│
├── 📁 api/                               # Backend API
│   ├── ResidenciaWebApp.sln              # Solución Visual Studio
│   ├── packages/                         # Paquetes NuGet
│   └── WebApi/                           # Proyecto principal
│       ├── Web.config                    # ⚙️ Configuración
│       ├── Controllers/                  # Controladores API
│       ├── Models/                       # Modelos de datos
│       └── App_Start/                    # Configuración
│
└── 📁 frontend/                          # Frontend Web
    ├── README.md                         # Documentación frontend
    ├── dashboard.html                    # Dashboard principal
    ├── alertas.html                      # Módulo de alertas
    ├── legajos.html                      # Módulo de legajos
    ├── ninos.html                        # Catálogo de niños
    ├── tutores.html                      # Catálogo de tutores
    ├── reportes_alertas.html             # Reportes de alertas
    ├── reportes_legajos.html             # Reportes de legajos
    └── assets/
        ├── css/                          # Estilos
        └── js/                           # JavaScript modular
            ├── utils/                    # Utilidades
            ├── api/                      # Clientes API
            ├── alertas/                  # Módulo alertas
            ├── legajos/                  # Módulo legajos
            ├── dashboard/                # Dashboard
            └── reportes/                 # Reportes
```

---

## 🛠️ Stack Tecnológico

### Backend
- **.NET Framework 4.7.2**
- **ASP.NET Web API**
- **Swashbuckle** (Swagger UI)
- **ADO.NET** para acceso a datos
- **Newtonsoft.Json** para serialización

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Animaciones y Grid/Flexbox
- **JavaScript ES6+** - Módulos, async/await
- **Tailwind CSS 3.x** - Framework CSS
- **Bootstrap Icons** - Iconografía
- **Chart.js** - Gráficos interactivos
- **jsPDF + xlsx** - Exportación

### Base de Datos
- **SQL Server 2019+** (Express Edition)
- **SQL Server Management Studio** (SSMS)

---

## ⚙️ Requisitos del Sistema

### Software Requerido

| Software | Versión Mínima | Descarga |
|----------|----------------|----------|
| **SQL Server** | 2019 Express | [Link](https://www.microsoft.com/es-es/sql-server/sql-server-downloads) |
| **SSMS** | 18.0 | [Link](https://aka.ms/ssmsfullsetup) |
| **Visual Studio** | 2019 Community | [Link](https://visualstudio.microsoft.com/es/downloads/) |
| **Python** | 3.8+ | [Link](https://www.python.org/downloads/) |

### Especificaciones de Hardware

- **RAM:** 8 GB mínimo (16 GB recomendado)
- **Disco:** 10 GB libres
- **Procesador:** Intel Core i5 o equivalente

---

## 🌐 URLs del Sistema

Una vez iniciado, el sistema estará disponible en:

| Componente | URL | Descripción |
|------------|-----|-------------|
| **Frontend** | `http://localhost:5500` | Aplicación web |
| **Dashboard** | `http://localhost:5500/dashboard.html` | Panel principal |
| **API** | `https://localhost:[PUERTO]/api` | API REST |
| **Swagger** | `https://localhost:[PUERTO]/swagger` | Documentación API |

> El puerto de la API se asigna automáticamente por Visual Studio (usualmente 44300-44399)

---

## 📊 Módulos del Sistema

### 🏠 Dashboard
- KPIs visuales con gradientes
- Gráficos en tiempo real (Chart.js)
- Accesos rápidos a módulos principales

### 🔔 Alertas
- Registro de alertas por niño/legajo
- Sistema de vencimientos con indicadores visuales
- Clasificación por tipo, prioridad y estado
- Notificaciones automáticas

### 📋 Legajos
- Gestión completa de legajos
- Vinculación con niños y tutores
- Control de estados y seguimiento

### 👶 Niños
- Catálogo de niños/adolescentes
- Datos personales y documentación
- Vinculación con legajos y alertas

### 👨‍👩‍👧 Tutores
- Gestión de tutores y responsables
- Datos de contacto
- Vinculación con niños

### 📈 Reportes
- Exportación a PDF y Excel
- Filtros avanzados
- Gráficos estadísticos

---

## 🔧 Configuración Inicial

### 1. Base de Datos

**Archivo:** `api/WebApi/Web.config`

```xml
<connectionStrings>
  <add name="ResidenciaDB"
       connectionString="Data Source=TU_PC\SQLEXPRESS;Initial Catalog=ResidenciaDB;Integrated Security=True;MultipleActiveResultSets=True"
       providerName="System.Data.SqlClient" />
</connectionStrings>
```

**Reemplazar:** `TU_PC` con el nombre de tu computadora

### 2. URL de la API

**Archivo:** `frontend/assets/js/utils/http.js`

```javascript
const API_BASE_URL = 'https://localhost:44300'; // Ajustar puerto
```

**Reemplazar:** `44300` con el puerto de tu API

---

## ✅ Verificación del Sistema

### Checklist Básico

- [ ] SQL Server instalado y corriendo
- [ ] Base de datos `ResidenciaDB` creada
- [ ] Visual Studio instalado
- [ ] API compila sin errores
- [ ] API ejecutándose y Swagger accesible
- [ ] Frontend accesible en localhost:5500
- [ ] Dashboard carga con datos
- [ ] No hay errores CORS en consola

### Comandos de Verificación

```powershell
# Verificar SQL Server
Get-Service MSSQL$SQLEXPRESS

# Verificar puertos
netstat -ano | findstr :5500
netstat -ano | findstr :44300

# Script de diagnóstico completo
.\verificar-sistema.ps1
```

---

## 🐛 Solución de Problemas Comunes

### Error: Cannot connect to SQL Server
```powershell
# Iniciar servicio
net start MSSQL$SQLEXPRESS
```

### Error: CORS Policy
- Verificar `WebApiConfig.cs` tenga `config.EnableCors()`
- Verificar decoradores en controllers: `[EnableCors(origins: "*", ...)]`

### Frontend no carga datos
- Verificar que la API esté corriendo
- Verificar URL en `http.js` coincida con puerto de API
- Abrir DevTools (F12) → Console para ver errores

### Puerto ocupado
```powershell
# Ver proceso
netstat -ano | findstr :5500

# Usar otro puerto
python -m http.server 8080
```

---

## 📞 Soporte y Documentación

### 📖 Documentación
- Ver carpeta `frontend/` para docs del frontend
- Consultar comentarios en código fuente
- Revisar archivos `.md` en el proyecto

### 🔗 Recursos Útiles
- [Documentación .NET Web API](https://learn.microsoft.com/en-us/aspnet/web-api/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Chart.js](https://www.chartjs.org/docs/)
- [SQL Server](https://learn.microsoft.com/en-us/sql/sql-server/)

---

## 🚀 Inicio Diario (Sistema Configurado)

```powershell
# 1. Verificar SQL Server
Get-Service MSSQL$SQLEXPRESS

# 2. Iniciar todo automáticamente
.\iniciar-sistema.ps1

# O manualmente:
# - Abrir api\ResidenciaWebApp.sln → F5
# - cd frontend; python -m http.server 5500
# - Abrir: http://localhost:5500/dashboard.html
```

---

## 📝 Notas de Versión

### Versión 2.0 (Actual)
- ✅ Diseño moderno completo con Tailwind CSS
- ✅ Sistema de tooltips implementado
- ✅ Toast mejorado con barra de progreso
- ✅ 16 KPIs visuales con gradientes
- ✅ Dashboard con Chart.js
- ✅ Módulo de alertas completo
- ✅ Reportes con exportación
- ✅ 100% Responsive

### Versión 1.0
- Sistema base funcional
- CRUD de entidades principales
- API REST con Swagger

---

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] Edición y eliminación de alertas
- [ ] Notificaciones push
- [ ] Adjuntos de archivos
- [ ] Sistema de comentarios
- [ ] Modo oscuro (dark mode)
- [ ] PWA (Progressive Web App)

---

## 👥 Contribución

### Estándares de Código
- **Indentación:** 4 espacios
- **Nomenclatura:** camelCase (JS), PascalCase (C#)
- **Commits:** Español, descriptivos
- **Comentarios:** JSDoc para funciones públicas

### Estructura de Commits
```
feat: Nueva funcionalidad
fix: Corrección de bug
style: Cambios de estilo
docs: Documentación
refactor: Refactorización
```

---

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

---

## ✨ Características Destacadas

- 🎨 **Diseño Moderno**: UI/UX profesional con Tailwind CSS
- 📊 **Analytics**: Dashboard con gráficos en tiempo real
- 🔔 **Alertas Inteligentes**: Sistema de vencimientos automático
- 📈 **Reportes**: Exportación PDF/Excel con filtros
- 🔒 **Auditoría**: Trazabilidad completa de cambios
- 🚀 **Performance**: Optimizado y responsive
- 📱 **Responsive**: Mobile, tablet y desktop
- 🔄 **Modular**: Código organizado y mantenible

---

## 📞 Contacto

Para soporte técnico o consultas:
- Revisar documentación en carpeta `frontend/`
- Consultar issues en el repositorio
- Revisar sección de troubleshooting

---

**Sistema en Producción - Listo para Usar** ✅

*Desarrollado con ❤️ para mejorar la gestión de residencias infantiles*

---

*Última actualización: Octubre 2025 - v2.0*

