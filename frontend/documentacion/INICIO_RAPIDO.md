# ⚡ Inicio Rápido - Sistema de Gestión de Residencias

> Guía condensada para desarrolladores experimentados. Para instalación detallada, ver `GUIA_INSTALACION_LOCAL.md`

---

## 🚀 Setup en 5 Minutos

### 1️⃣ Base de Datos (2 min)

```bash
# 1. Instalar SQL Server Express + SSMS
# 2. Abrir SSMS y conectar a: TU_PC\SQLEXPRESS
# 3. Ejecutar script:
```

```sql
-- Abrir y ejecutar: db/bd.sql
-- Crea ResidenciaDB con todas las tablas y datos de prueba
```

### 2️⃣ API - Backend (2 min)

```bash
# 1. Abrir solución
cd api
# Doble click en: ResidenciaWebApp.sln
```

**Configurar conexión en `WebApi/Web.config`:**
```xml
<connectionStrings>
  <add name="ResidenciaDB"
       connectionString="Data Source=TU_PC\SQLEXPRESS;Initial Catalog=ResidenciaDB;Integrated Security=True;MultipleActiveResultSets=True"
       providerName="System.Data.SqlClient" />
</connectionStrings>
```

**Ejecutar:**
- Presionar `F5` en Visual Studio
- Acceder a Swagger: `https://localhost:PUERTO/swagger`

### 3️⃣ Frontend (1 min)

**Configurar API en `frontend/assets/js/utils/http.js`:**
```javascript
const API_BASE_URL = 'https://localhost:44300'; // Ajustar puerto
```

**Iniciar servidor:**
```bash
cd frontend
python -m http.server 5500
```

**Acceder:** `http://localhost:5500/dashboard.html`

---

## 🎯 Verificación Rápida

### ✅ Checklist

```bash
# 1. SQL Server corriendo
Get-Service MSSQL$SQLEXPRESS  # PowerShell

# 2. Base de datos existe
sqlcmd -S TU_PC\SQLEXPRESS -Q "SELECT name FROM sys.databases WHERE name = 'ResidenciaDB'"

# 3. API responde
curl https://localhost:PUERTO/api/Estado

# 4. Frontend carga
curl http://localhost:5500/dashboard.html
```

### 🔍 Endpoints de Prueba

```
GET /api/Nino           - Listar niños
GET /api/Tutor          - Listar tutores  
GET /api/Estado         - Estados de legajo
GET /api/Alerta         - Alertas
GET /api/TipoAlerta     - Tipos de alerta
```

---

## 🐛 Troubleshooting Express

### Error CORS
```csharp
// En WebApiConfig.cs
config.EnableCors();

// En cada Controller
[EnableCors(origins: "*", headers: "*", methods: "*")]
```

### SQL Server no conecta
```powershell
# Iniciar servicio
net start MSSQL$SQLEXPRESS

# Verificar TCP/IP habilitado
# SQL Server Configuration Manager → Protocols → TCP/IP → Enable
```

### Puerto ocupado
```bash
# Ver qué usa el puerto
netstat -ano | findstr :5500

# Cambiar a otro puerto
python -m http.server 8080
```

---

## 📦 Stack Tecnológico

| Componente | Tecnología | Puerto |
|------------|------------|--------|
| **Base de Datos** | SQL Server Express | 1433 |
| **Backend API** | .NET Framework 4.7.2 + Web API | 44300-44399 |
| **Documentación** | Swagger UI | /swagger |
| **Frontend** | HTML5 + JS + Tailwind CSS | 5500 |
| **Gráficos** | Chart.js | - |

---

## 🔗 URLs Importantes

```
Backend API:   https://localhost:PUERTO/api
Swagger UI:    https://localhost:PUERTO/swagger
Frontend:      http://localhost:5500/dashboard.html
```

---

## 📂 Archivos Clave a Configurar

```
✅ api/WebApi/Web.config                    # Connection string
✅ frontend/assets/js/utils/http.js         # API URL
```

---

## 🎨 Módulos Disponibles

- `/dashboard.html` - Dashboard con KPIs y gráficos
- `/alertas.html` - Gestión de alertas y vencimientos
- `/legajos.html` - Administración de legajos
- `/ninos.html` - Catálogo de niños/adolescentes
- `/tutores.html` - Gestión de tutores
- `/reportes_alertas.html` - Reportes y exportación

---

## 📖 Documentación Completa

- `GUIA_INSTALACION_LOCAL.md` - Instalación paso a paso
- `frontend/README.md` - Documentación del frontend
- `frontend/BACKEND_SETUP.md` - Configuración del backend
- `frontend/MODULO_ALERTAS_IMPLEMENTACION.md` - Módulo alertas

---

## 🚦 Inicio Diario

```bash
# 1. Verificar SQL Server (PowerShell)
Get-Service MSSQL$SQLEXPRESS

# 2. Iniciar API (Visual Studio)
# Abrir ResidenciaWebApp.sln → F5

# 3. Iniciar Frontend
cd frontend
python -m http.server 5500

# 4. Abrir navegador
start http://localhost:5500/dashboard.html
```

---

## 💡 Tips Útiles

### DevTools para Debugging
```
F12 → Console    # Ver errores JavaScript
F12 → Network    # Ver requests HTTP/API
F12 → Application # LocalStorage, cookies
```

### Reiniciar API sin Visual Studio
```powershell
# Detener IIS Express
taskkill /IM iisexpress.exe /F

# Volver a ejecutar con F5 en VS
```

### Limpiar Base de Datos
```sql
USE master;
GO
ALTER DATABASE ResidenciaDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
DROP DATABASE ResidenciaDB;
GO

-- Volver a ejecutar bd.sql
```

---

**¿Primer setup?** → Ver `GUIA_INSTALACION_LOCAL.md`  
**¿Problemas con CORS?** → Verificar `WebApiConfig.cs` y decoradores en controllers  
**¿Frontend no carga datos?** → Verificar URL en `http.js` y que API esté corriendo  

---

*Actualizado: Octubre 2025*

