# ============================================
# Script de Inicio Automático del Sistema
# Sistema de Gestión de Residencias
# ============================================

param(
    [switch]$SkipChecks = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INICIO DEL SISTEMA COMPLETO" -ForegroundColor Cyan
Write-Host "  Residencia App" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# ============================================
# FUNCIÓN: Verificar SQL Server
# ============================================
function Test-SqlServer {
    Write-Host "[1/3] Verificando SQL Server..." -ForegroundColor Yellow
    
    $sqlService = Get-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction SilentlyContinue
    
    if ($null -eq $sqlService) {
        Write-Host "  ❌ SQL Server Express no instalado`n" -ForegroundColor Red
        return $false
    }
    
    if ($sqlService.Status -ne "Running") {
        Write-Host "  ⚠️  SQL Server detenido. Iniciando..." -ForegroundColor Yellow
        try {
            Start-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction Stop
            Start-Sleep -Seconds 3
            Write-Host "  ✅ SQL Server iniciado`n" -ForegroundColor Green
        }
        catch {
            Write-Host "  ❌ No se pudo iniciar SQL Server (requiere admin)`n" -ForegroundColor Red
            Write-Host "     Ejecutar como Administrador o iniciar manualmente:`n" -ForegroundColor Gray
            Write-Host "     net start MSSQL`$SQLEXPRESS`n" -ForegroundColor White
            return $false
        }
    }
    else {
        Write-Host "  ✅ SQL Server está corriendo`n" -ForegroundColor Green
    }
    
    return $true
}

# ============================================
# FUNCIÓN: Iniciar API
# ============================================
function Start-ApiBackend {
    Write-Host "[2/3] Iniciando API Backend..." -ForegroundColor Yellow
    
    # Verificar si Visual Studio está instalado
    $vsWhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
    
    if (Test-Path $vsWhere) {
        $vsPath = & $vsWhere -latest -property productPath
        
        if ($vsPath -and (Test-Path $vsPath)) {
            Write-Host "  📂 Visual Studio encontrado" -ForegroundColor Gray
            
            $slnPath = Join-Path $PSScriptRoot "api\ResidenciaWebApp.sln"
            
            if (Test-Path $slnPath) {
                Write-Host "  🚀 Abriendo solución en Visual Studio..." -ForegroundColor Cyan
                Write-Host "     $slnPath`n" -ForegroundColor Gray
                
                Start-Process $vsPath -ArgumentList "`"$slnPath`""
                
                Write-Host "  ⏳ Esperando a que Visual Studio cargue (15 seg)..." -ForegroundColor Yellow
                Start-Sleep -Seconds 5
                
                Write-Host "`n  ⚠️  ACCIÓN REQUERIDA:" -ForegroundColor Yellow
                Write-Host "     En Visual Studio, presiona F5 para iniciar la API`n" -ForegroundColor White
                
                return $true
            }
            else {
                Write-Host "  ❌ No se encontró: $slnPath`n" -ForegroundColor Red
                return $false
            }
        }
    }
    
    Write-Host "  ⚠️  Visual Studio no encontrado automáticamente" -ForegroundColor Yellow
    Write-Host "     Abrir manualmente: api\ResidenciaWebApp.sln`n" -ForegroundColor Gray
    return $false
}

# ============================================
# FUNCIÓN: Iniciar Frontend
# ============================================
function Start-Frontend {
    Write-Host "[3/3] Iniciando Servidor Frontend..." -ForegroundColor Yellow
    
    $frontendPath = Join-Path $PSScriptRoot "frontend"
    
    if (-not (Test-Path $frontendPath)) {
        Write-Host "  ❌ Carpeta frontend no encontrada`n" -ForegroundColor Red
        return $false
    }
    
    # Verificar si Python está instalado
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if (-not $pythonCmd) {
        $pythonCmd = Get-Command py -ErrorAction SilentlyContinue
    }
    
    if ($pythonCmd) {
        Write-Host "  ✅ Python encontrado: $($pythonCmd.Source)" -ForegroundColor Green
        
        # Verificar si el puerto 5500 está en uso
        $portInUse = Get-NetTCPConnection -LocalPort 5500 -State Listen -ErrorAction SilentlyContinue
        
        if ($portInUse) {
            Write-Host "  ⚠️  Puerto 5500 ya está en uso" -ForegroundColor Yellow
            Write-Host "     El servidor frontend puede estar corriendo`n" -ForegroundColor Gray
        }
        else {
            Write-Host "  🚀 Iniciando servidor HTTP en puerto 5500..." -ForegroundColor Cyan
            Write-Host "     Carpeta: $frontendPath`n" -ForegroundColor Gray
            
            # Iniciar servidor en nueva ventana
            $pythonExe = $pythonCmd.Source
            Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🌐 Servidor Frontend corriendo en: http://localhost:5500' -ForegroundColor Green; Write-Host 'Presiona Ctrl+C para detener`n' -ForegroundColor Yellow; & '$pythonExe' -m http.server 5500"
            
            Start-Sleep -Seconds 2
        }
        
        # Abrir navegador
        Write-Host "  🌐 Abriendo navegador..." -ForegroundColor Cyan
        Start-Sleep -Seconds 3
        Start-Process "http://localhost:5500/dashboard.html"
        Write-Host "  ✅ Navegador abierto: http://localhost:5500/dashboard.html`n" -ForegroundColor Green
        
        return $true
    }
    else {
        Write-Host "  ⚠️  Python no encontrado" -ForegroundColor Yellow
        Write-Host "     Instalar Python o usar alternativa:" -ForegroundColor Gray
        Write-Host "     - VS Code con Live Server" -ForegroundColor White
        Write-Host "     - Node.js: npx serve -l 5500`n" -ForegroundColor White
        return $false
    }
}

# ============================================
# EJECUCIÓN PRINCIPAL
# ============================================

try {
    # Verificaciones
    if (-not $SkipChecks) {
        $sqlOk = Test-SqlServer
        if (-not $sqlOk) {
            Write-Host "❌ No se puede continuar sin SQL Server`n" -ForegroundColor Red
            Write-Host "Ejecutar primero: .\verificar-sistema.ps1`n" -ForegroundColor Yellow
            exit 1
        }
    }
    
    # Iniciar componentes
    $apiStarted = Start-ApiBackend
    Start-Sleep -Seconds 2
    
    $frontendStarted = Start-Frontend
    
    # Resumen final
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  ESTADO DEL SISTEMA" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    Write-Host "Base de Datos:  " -NoNewline
    if ($sqlOk) {
        Write-Host "✅ SQL Server corriendo" -ForegroundColor Green
    } else {
        Write-Host "❌ No verificado" -ForegroundColor Red
    }
    
    Write-Host "API Backend:    " -NoNewline
    if ($apiStarted) {
        Write-Host "⏳ Visual Studio abierto (presionar F5)" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  Abrir manualmente" -ForegroundColor Yellow
    }
    
    Write-Host "Frontend:       " -NoNewline
    if ($frontendStarted) {
        Write-Host "✅ Corriendo en http://localhost:5500" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Iniciar manualmente" -ForegroundColor Yellow
    }
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  ACCESOS RÁPIDOS" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    Write-Host "🌐 Frontend:  " -NoNewline -ForegroundColor Cyan
    Write-Host "http://localhost:5500/dashboard.html" -ForegroundColor White
    
    Write-Host "📡 API:       " -NoNewline -ForegroundColor Cyan
    Write-Host "https://localhost:[PUERTO]/api" -ForegroundColor White
    
    Write-Host "📚 Swagger:   " -NoNewline -ForegroundColor Cyan
    Write-Host "https://localhost:[PUERTO]/swagger" -ForegroundColor White
    
    Write-Host "`n💡 El puerto de la API se asigna automáticamente (ver Visual Studio)`n" -ForegroundColor Gray
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  PRÓXIMOS PASOS" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    Write-Host "1. ⚠️  En Visual Studio: Presionar F5 para iniciar la API" -ForegroundColor Yellow
    Write-Host "2. 📝 Copiar el puerto de la API desde el navegador" -ForegroundColor White
    Write-Host "3. ⚙️  Actualizar frontend\assets\js\utils\http.js con el puerto correcto" -ForegroundColor White
    Write-Host "4. 🔄 Recargar la página del frontend" -ForegroundColor White
    Write-Host "5. ✅ ¡Sistema listo para usar!`n" -ForegroundColor Green
    
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    Write-Host "Para detener el sistema:" -ForegroundColor Cyan
    Write-Host "  - Cerrar ventana del servidor frontend (Ctrl+C)" -ForegroundColor Gray
    Write-Host "  - Detener debugging en Visual Studio (Shift+F5)" -ForegroundColor Gray
    Write-Host "  - SQL Server puede quedarse corriendo`n" -ForegroundColor Gray
}
catch {
    Write-Host "`n❌ Error durante la inicialización:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

