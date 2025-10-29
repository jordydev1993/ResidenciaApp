# 🔧 Comandos Útiles - Referencia Rápida

> Comandos más utilizados para gestión y troubleshooting del sistema

---

## 📋 Índice Rápido

- [SQL Server](#-sql-server)
- [Visual Studio / API](#-visual-studio--api)
- [Frontend](#-frontend)
- [PowerShell / CMD](#-powershell--cmd)
- [Git](#-git)
- [Debugging](#-debugging)

---

## 🗄️ SQL Server

### Gestión de Servicios

```powershell
# Ver estado de SQL Server
Get-Service | Where-Object {$_.Name -like "*SQL*"}

# Iniciar SQL Server
net start MSSQL$SQLEXPRESS
# o
Start-Service MSSQL$SQLEXPRESS

# Detener SQL Server
net stop MSSQL$SQLEXPRESS
# o
Stop-Service MSSQL$SQLEXPRESS

# Reiniciar SQL Server
Restart-Service MSSQL$SQLEXPRESS
```

### Conexión y Consultas

```powershell
# Conectar con sqlcmd
sqlcmd -S NOMBRE_PC\SQLEXPRESS -E

# Ejecutar query directamente
sqlcmd -S NOMBRE_PC\SQLEXPRESS -E -Q "SELECT name FROM sys.databases"

# Ejecutar script SQL
sqlcmd -S NOMBRE_PC\SQLEXPRESS -E -i "db\bd.sql"
```

### Queries Útiles

```sql
-- Ver todas las bases de datos
SELECT name, database_id, create_date 
FROM sys.databases;

-- Usar base de datos
USE ResidenciaDB;
GO

-- Ver todas las tablas
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Contar registros por tabla
SELECT 
    t.NAME AS TableName,
    p.rows AS RowCounts
FROM sys.tables t
INNER JOIN sys.partitions p ON t.object_id = p.object_id
WHERE p.index_id IN (0,1)
ORDER BY p.rows DESC;

-- Ver estructura de una tabla
sp_help 'dbo.Nino';

-- Ver datos de una tabla
SELECT TOP 10 * FROM dbo.Nino;
SELECT TOP 10 * FROM dbo.Alerta;

-- Limpiar una tabla
DELETE FROM dbo.Alerta;
DBCC CHECKIDENT ('dbo.Alerta', RESEED, 0);

-- Recrear base de datos completa
-- (ejecutar script db/bd.sql que lo hace automáticamente)
```

### Backup y Restore

```sql
-- Backup de base de datos
BACKUP DATABASE ResidenciaDB 
TO DISK = 'C:\Backup\ResidenciaDB.bak'
WITH FORMAT, NAME = 'Full Backup of ResidenciaDB';

-- Restore de base de datos
USE master;
GO
ALTER DATABASE ResidenciaDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
RESTORE DATABASE ResidenciaDB 
FROM DISK = 'C:\Backup\ResidenciaDB.bak'
WITH REPLACE;
ALTER DATABASE ResidenciaDB SET MULTI_USER;
```

---

## 💻 Visual Studio / API

### Compilación

```powershell
# Compilar desde línea de comandos (si MSBuild está en PATH)
msbuild api\ResidenciaWebApp.sln /t:Build /p:Configuration=Debug

# Limpiar compilación
msbuild api\ResidenciaWebApp.sln /t:Clean
```

### Atajos de Teclado en Visual Studio

| Atajo | Acción |
|-------|--------|
| `F5` | Iniciar con debugging |
| `Ctrl+F5` | Iniciar sin debugging |
| `Shift+F5` | Detener debugging |
| `Ctrl+Shift+B` | Compilar solución |
| `Ctrl+.` | Quick actions (arreglar errores) |
| `F9` | Establecer breakpoint |
| `F10` | Step over (debugging) |
| `F11` | Step into (debugging) |

### NuGet Package Manager

```powershell
# Abrir Package Manager Console en VS: Tools → NuGet Package Manager → Console

# Restaurar paquetes
Update-Package -Reinstall

# Instalar paquete específico
Install-Package Newtonsoft.Json -Version 13.0.3

# Actualizar paquete
Update-Package Newtonsoft.Json

# Ver paquetes instalados
Get-Package
```

### IIS Express

```powershell
# Ver procesos de IIS Express
Get-Process -Name "iisexpress"

# Matar todos los procesos IIS Express
Get-Process -Name "iisexpress" | Stop-Process -Force

# Limpiar configuración de IIS Express
Remove-Item "$env:USERPROFILE\Documents\IISExpress\config\applicationhost.config" -Force
```

---

## 🌐 Frontend

### Servidor HTTP

```bash
# Python - Opción 1 (recomendado)
cd frontend
python -m http.server 5500

# Python - Opción 2 (alternativa en Windows)
py -m http.server 5500

# Node.js con serve
npx serve -l 5500 frontend

# Node.js con http-server
npx http-server frontend -p 5500

# PHP (si está instalado)
cd frontend
php -S localhost:5500
```

### Live Server (VS Code)

```json
// Configuración en settings.json
{
  "liveServer.settings.port": 5500,
  "liveServer.settings.root": "/frontend",
  "liveServer.settings.CustomBrowser": "chrome"
}
```

### Limpiar Caché del Navegador

```javascript
// En consola del navegador (F12)
location.reload(true); // Recarga forzada

// O simplemente
// Ctrl + Shift + R (Chrome/Edge)
// Ctrl + F5 (Firefox)
```

---

## 🔧 PowerShell / CMD

### Gestión de Puertos

```powershell
# Ver puertos en uso
netstat -ano

# Ver proceso específico en un puerto
netstat -ano | findstr :5500
netstat -ano | findstr :44300
netstat -ano | findstr :1433

# Matar proceso por PID
taskkill /PID 12345 /F

# Ver qué proceso usa un puerto (requiere admin)
Get-NetTCPConnection -LocalPort 5500
```

### Información del Sistema

```powershell
# Nombre del computador
$env:COMPUTERNAME

# Usuario actual
$env:USERNAME

# Ver versión de Windows
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"

# Ver versión de PowerShell
$PSVersionTable.PSVersion

# Ver variables de entorno
Get-ChildItem Env:

# Ver PATH
$env:PATH -split ';'
```

### Navegación y Archivos

```powershell
# Directorio actual
pwd
# o
Get-Location

# Listar archivos
ls
# o
Get-ChildItem

# Buscar archivos
Get-ChildItem -Recurse -Filter "*.config"

# Buscar texto en archivos
Select-String -Path "*.cs" -Pattern "connectionString"

# Copiar archivo
Copy-Item "Web.config" "Web.config.backup"

# Editar archivo
notepad Web.config
# o
code Web.config  # Si tienes VS Code
```

---

## 🔀 Git

### Comandos Básicos

```bash
# Ver estado
git status

# Ver cambios
git diff

# Agregar archivos
git add .
git add archivo.cs

# Commit
git commit -m "feat: agregar nueva funcionalidad"

# Push
git push origin main

# Pull
git pull origin main

# Ver historial
git log --oneline
git log --graph --oneline --all
```

### Branches

```bash
# Ver branches
git branch

# Crear branch
git branch feature/nueva-funcionalidad

# Cambiar a branch
git checkout feature/nueva-funcionalidad

# Crear y cambiar (shortcut)
git checkout -b feature/nueva-funcionalidad

# Merge branch
git checkout main
git merge feature/nueva-funcionalidad

# Eliminar branch
git branch -d feature/nueva-funcionalidad
```

### Deshacer Cambios

```bash
# Descartar cambios en archivo
git checkout -- archivo.cs

# Descartar todos los cambios
git checkout -- .

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer último commit (descartar cambios)
git reset --hard HEAD~1

# Ver commits para revert
git log --oneline

# Revertir commit específico
git revert abc1234
```

### Stash

```bash
# Guardar cambios temporalmente
git stash

# Ver stashes
git stash list

# Recuperar último stash
git stash pop

# Aplicar stash específico
git stash apply stash@{0}

# Eliminar stash
git stash drop stash@{0}
```

---

## 🔍 Debugging

### Browser DevTools (F12)

```javascript
// Console

// Ver todas las variables globales
console.log(window);

// Ver datos de la API
console.table(data);

// Medir tiempo de ejecución
console.time('loadData');
// ... código ...
console.timeEnd('loadData');

// Agrupar logs
console.group('API Calls');
console.log('Request 1');
console.log('Request 2');
console.groupEnd();

// Limpiar consola
console.clear();
```

### Network Tab (DevTools)

```
F12 → Network

Filtros útiles:
- XHR: Ver llamadas AJAX/Fetch
- All: Ver todos los recursos
- Status: Filtrar por código (200, 404, 500)

Click en request → Ver:
- Headers (request/response)
- Preview (datos formateados)
- Response (raw)
- Timing (performance)
```

### Application Tab (DevTools)

```
F12 → Application

Ver:
- Local Storage
- Session Storage
- Cookies
- Cache Storage

Acciones:
- Clear storage
- Ver valores
- Editar valores
```

### SQL Server Profiler (Avanzado)

```sql
-- Ver queries en ejecución
SELECT 
    session_id,
    start_time,
    status,
    command,
    database_id,
    blocking_session_id,
    wait_type,
    wait_time,
    cpu_time,
    total_elapsed_time,
    reads,
    writes,
    logical_reads
FROM sys.dm_exec_requests
WHERE database_id = DB_ID('ResidenciaDB');

-- Ver últimas queries ejecutadas
SELECT TOP 10
    qt.text,
    qs.execution_count,
    qs.total_elapsed_time,
    qs.last_execution_time
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
ORDER BY qs.last_execution_time DESC;
```

---

## 🚨 Troubleshooting Rápido

### SQL Server no arranca

```powershell
# Ver logs de error
Get-Content "C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\Log\ERRORLOG"

# Verificar configuración
Get-Service MSSQL$SQLEXPRESS | Select-Object *

# Reparar instalación (requiere admin)
# Ejecutar instalador de SQL Server → Repair
```

### API no compila

```powershell
# Limpiar y recompilar
cd api
msbuild ResidenciaWebApp.sln /t:Clean
msbuild ResidenciaWebApp.sln /t:Restore
msbuild ResidenciaWebApp.sln /t:Build

# Eliminar bin y obj
Remove-Item -Recurse -Force WebApi\bin
Remove-Item -Recurse -Force WebApi\obj

# Restaurar paquetes NuGet
nuget restore ResidenciaWebApp.sln
```

### Frontend no conecta con API

```javascript
// En consola del navegador (F12):

// Ver URL base configurada
console.log(API_BASE_URL);

// Probar endpoint manualmente
fetch('https://localhost:44300/api/Nino')
  .then(r => r.json())
  .then(d => console.table(d))
  .catch(e => console.error('Error:', e));

// Verificar CORS
// Si hay error de CORS, verificar:
// 1. API está corriendo
// 2. WebApiConfig.cs tiene EnableCors()
// 3. Controllers tienen decorador [EnableCors]
```

---

## 📦 Scripts de Utilidad

### Script: Backup Completo

```powershell
# backup-completo.ps1
$fecha = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "C:\Backup\ResidenciaApp\$fecha"

# Crear directorio
New-Item -ItemType Directory -Path $backupDir -Force

# Backup base de datos
sqlcmd -S "$env:COMPUTERNAME\SQLEXPRESS" -E -Q "BACKUP DATABASE ResidenciaDB TO DISK = '$backupDir\ResidenciaDB.bak'"

# Copiar archivos código
Copy-Item -Recurse "api" "$backupDir\api"
Copy-Item -Recurse "frontend" "$backupDir\frontend"

Write-Host "Backup completo en: $backupDir" -ForegroundColor Green
```

### Script: Limpiar Sistema

```powershell
# limpiar-sistema.ps1

Write-Host "Limpiando archivos temporales..." -ForegroundColor Yellow

# Limpiar bin/obj
Get-ChildItem -Recurse -Include bin,obj | Remove-Item -Recurse -Force

# Limpiar caché NuGet local (opcional)
# dotnet nuget locals all --clear

# Limpiar IIS Express
taskkill /IM iisexpress.exe /F 2>$null

Write-Host "Limpieza completada" -ForegroundColor Green
```

### Script: Resetear Base de Datos

```powershell
# resetear-bd.ps1
$server = "$env:COMPUTERNAME\SQLEXPRESS"

Write-Host "Reseteando base de datos..." -ForegroundColor Yellow
sqlcmd -S $server -E -i "db\bd.sql"

Write-Host "Base de datos reseteada correctamente" -ForegroundColor Green
```

---

## 🔗 URLs de Referencia Rápida

```
# Local
Frontend:    http://localhost:5500/dashboard.html
API:         https://localhost:PUERTO/api
Swagger:     https://localhost:PUERTO/swagger

# Documentación
.NET:        https://learn.microsoft.com/en-us/dotnet/
SQL Server:  https://learn.microsoft.com/en-us/sql/
Tailwind:    https://tailwindcss.com/docs
Chart.js:    https://www.chartjs.org/docs/
```

---

## 💡 Tips Rápidos

### Performance

```sql
-- Reconstruir índices
USE ResidenciaDB;
EXEC sp_MSforeachtable @command1="DBCC DBREINDEX ('?')";

-- Actualizar estadísticas
EXEC sp_updatestats;
```

### Seguridad

```sql
-- Crear usuario SQL Server
USE master;
CREATE LOGIN dev_user WITH PASSWORD = 'Password123!';
USE ResidenciaDB;
CREATE USER dev_user FOR LOGIN dev_user;
EXEC sp_addrolemember 'db_owner', 'dev_user';
```

### Monitoreo

```powershell
# Ver uso de CPU por proceso
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10

# Ver uso de memoria
Get-Process | Sort-Object WS -Descending | Select-Object -First 10

# Monitorear puerto en tiempo real
while ($true) { 
    Clear-Host
    netstat -ano | findstr :5500
    Start-Sleep -Seconds 2
}
```

---

**Tip:** Guarda este archivo en favoritos para acceso rápido a comandos útiles 🔖

---

*Última actualización: Octubre 2025*

