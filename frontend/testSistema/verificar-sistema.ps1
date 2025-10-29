# ============================================
# Script de Verificación del Sistema
# Sistema de Gestión de Residencias
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICACIÓN DEL SISTEMA" -ForegroundColor Cyan
Write-Host "  Residencia App - Diagnóstico" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$errores = 0
$advertencias = 0

# ============================================
# 1. VERIFICAR SQL SERVER
# ============================================
Write-Host "[1/5] Verificando SQL Server..." -ForegroundColor Yellow

try {
    $sqlService = Get-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction SilentlyContinue
    
    if ($null -eq $sqlService) {
        Write-Host "  ❌ SQL Server Express no está instalado" -ForegroundColor Red
        Write-Host "     Descargar de: https://www.microsoft.com/es-es/sql-server/sql-server-downloads`n" -ForegroundColor Gray
        $errores++
    }
    elseif ($sqlService.Status -eq "Running") {
        Write-Host "  ✅ SQL Server Express está corriendo`n" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠️  SQL Server está instalado pero detenido" -ForegroundColor Yellow
        Write-Host "     Intentando iniciar servicio..." -ForegroundColor Gray
        
        try {
            Start-Service -Name "MSSQL`$SQLEXPRESS"
            Write-Host "  ✅ Servicio iniciado correctamente`n" -ForegroundColor Green
        }
        catch {
            Write-Host "  ❌ No se pudo iniciar el servicio (requiere permisos de administrador)" -ForegroundColor Red
            Write-Host "     Ejecutar: net start MSSQL`$SQLEXPRESS`n" -ForegroundColor Gray
            $errores++
        }
    }
}
catch {
    Write-Host "  ❌ Error al verificar SQL Server: $($_.Exception.Message)`n" -ForegroundColor Red
    $errores++
}

# ============================================
# 2. VERIFICAR BASE DE DATOS
# ============================================
Write-Host "[2/5] Verificando Base de Datos..." -ForegroundColor Yellow

try {
    $serverName = "$env:COMPUTERNAME\SQLEXPRESS"
    $query = "SELECT name FROM sys.databases WHERE name = 'ResidenciaDB'"
    
    # Intentar conexión
    $result = sqlcmd -S $serverName -Q $query -h -1 2>&1
    
    if ($result -match "ResidenciaDB") {
        Write-Host "  ✅ Base de datos 'ResidenciaDB' existe" -ForegroundColor Green
        
        # Verificar tablas
        $tableQuery = "USE ResidenciaDB; SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
        $tableCount = sqlcmd -S $serverName -Q $tableQuery -h -1 2>&1
        
        if ($tableCount -match '\d+' -and [int]$tableCount -gt 5) {
            Write-Host "  ✅ Tablas creadas correctamente ($tableCount tablas)`n" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️  Base de datos existe pero parece vacía" -ForegroundColor Yellow
            Write-Host "     Ejecutar script: db\bd.sql en SSMS`n" -ForegroundColor Gray
            $advertencias++
        }
    }
    else {
        Write-Host "  ❌ Base de datos 'ResidenciaDB' no existe" -ForegroundColor Red
        Write-Host "     Ejecutar script: db\bd.sql en SSMS`n" -ForegroundColor Gray
        $errores++
    }
}
catch {
    Write-Host "  ❌ No se pudo conectar a SQL Server" -ForegroundColor Red
    Write-Host "     Verificar que SQL Server esté corriendo" -ForegroundColor Gray
    Write-Host "     Servidor esperado: $env:COMPUTERNAME\SQLEXPRESS`n" -ForegroundColor Gray
    $errores++
}

# ============================================
# 3. VERIFICAR ARCHIVOS DE LA API
# ============================================
Write-Host "[3/5] Verificando archivos de la API..." -ForegroundColor Yellow

$apiFiles = @(
    "api\ResidenciaWebApp.sln",
    "api\WebApi\Web.config",
    "api\WebApi\Global.asax.cs"
)

$apiOk = $true
foreach ($file in $apiFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ Falta: $file" -ForegroundColor Red
        $apiOk = $false
        $errores++
    }
}

if ($apiOk) {
    Write-Host "`n  📝 Verificar configuración en: api\WebApi\Web.config" -ForegroundColor Cyan
    Write-Host "     Connection String debe apuntar a: $env:COMPUTERNAME\SQLEXPRESS`n" -ForegroundColor Gray
}
else {
    Write-Host ""
}

# ============================================
# 4. VERIFICAR ARCHIVOS DEL FRONTEND
# ============================================
Write-Host "[4/5] Verificando archivos del Frontend..." -ForegroundColor Yellow

$frontendFiles = @(
    "frontend\dashboard.html",
    "frontend\alertas.html",
    "frontend\legajos.html",
    "frontend\assets\js\utils\http.js"
)

$frontendOk = $true
foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ Falta: $file" -ForegroundColor Red
        $frontendOk = $false
        $errores++
    }
}

if ($frontendOk) {
    Write-Host "`n  📝 Verificar URL de API en: frontend\assets\js\utils\http.js" -ForegroundColor Cyan
    Write-Host "     Debe coincidir con el puerto de la API (ej: https://localhost:44300)`n" -ForegroundColor Gray
}
else {
    Write-Host ""
}

# ============================================
# 5. VERIFICAR PUERTOS
# ============================================
Write-Host "[5/5] Verificando puertos en uso..." -ForegroundColor Yellow

# Puerto Frontend (5500)
$frontendPort = Get-NetTCPConnection -LocalPort 5500 -State Listen -ErrorAction SilentlyContinue
if ($frontendPort) {
    Write-Host "  ✅ Puerto 5500 (Frontend) está en uso - Servidor corriendo" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  Puerto 5500 (Frontend) libre - Iniciar servidor" -ForegroundColor Yellow
    Write-Host "     Ejecutar: cd frontend; python -m http.server 5500" -ForegroundColor Gray
    $advertencias++
}

# Buscar IIS Express (API)
$iisExpress = Get-Process -Name "iisexpress" -ErrorAction SilentlyContinue
if ($iisExpress) {
    Write-Host "  ✅ IIS Express está corriendo (API activa)`n" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  IIS Express no está corriendo" -ForegroundColor Yellow
    Write-Host "     Abrir api\ResidenciaWebApp.sln en Visual Studio y presionar F5`n" -ForegroundColor Gray
    $advertencias++
}

# ============================================
# RESUMEN
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE VERIFICACIÓN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($errores -eq 0 -and $advertencias -eq 0) {
    Write-Host "`n✅ Sistema verificado correctamente" -ForegroundColor Green
    Write-Host "   Todo está listo para usar`n" -ForegroundColor Green
}
elseif ($errores -eq 0) {
    Write-Host "`n⚠️  Verificación completada con advertencias" -ForegroundColor Yellow
    Write-Host "   $advertencias advertencia(s) encontrada(s)" -ForegroundColor Yellow
    Write-Host "   El sistema puede funcionar pero revisa los puntos marcados`n" -ForegroundColor Yellow
}
else {
    Write-Host "`n❌ Verificación completada con errores" -ForegroundColor Red
    Write-Host "   $errores error(es) crítico(s)" -ForegroundColor Red
    Write-Host "   $advertencias advertencia(s)" -ForegroundColor Red
    Write-Host "   Revisar los puntos marcados antes de continuar`n" -ForegroundColor Red
}

# ============================================
# PRÓXIMOS PASOS
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PRÓXIMOS PASOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($errores -eq 0 -and $advertencias -eq 0) {
    Write-Host "`n🚀 Para iniciar el sistema:" -ForegroundColor Cyan
    Write-Host "   1. Abrir Visual Studio con api\ResidenciaWebApp.sln" -ForegroundColor White
    Write-Host "   2. Presionar F5 para iniciar la API" -ForegroundColor White
    Write-Host "   3. En otra terminal: cd frontend; python -m http.server 5500" -ForegroundColor White
    Write-Host "   4. Abrir navegador: http://localhost:5500/dashboard.html`n" -ForegroundColor White
}
else {
    Write-Host "`n📖 Consultar documentación:" -ForegroundColor Cyan
    Write-Host "   - GUIA_INSTALACION_LOCAL.md (Guía completa)" -ForegroundColor White
    Write-Host "   - INICIO_RAPIDO.md (Setup rápido)" -ForegroundColor White
    Write-Host "   - frontend\README.md (Frontend)`n" -ForegroundColor White
}

Write-Host "========================================`n" -ForegroundColor Cyan

# Pausar al final
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

