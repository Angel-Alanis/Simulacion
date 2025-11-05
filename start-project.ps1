# ============================================
# SCRIPT DE INICIO AUTOMATIZADO
# English Exam Simulator - Full Stack
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  English Exam Simulator - Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Obtener ruta base del proyecto
$projectRoot = Split-Path -Parent $PSScriptRoot
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"

# ============================================
# PASO 1: Verificar Instalación de Dependencias
# ============================================

Write-Host "[1/4] Verificando dependencias..." -ForegroundColor Yellow

# Verificar Backend
if (!(Test-Path (Join-Path $backendPath "node_modules"))) {
    Write-Host "  >> Instalando dependencias del backend..." -ForegroundColor Magenta
    Push-Location $backendPath
    npm install
    Pop-Location
    Write-Host "  >> Backend dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "  >> Backend dependencies OK" -ForegroundColor Green
}

# Verificar Frontend
if (!(Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "  >> Instalando dependencias del frontend..." -ForegroundColor Magenta
    Push-Location $frontendPath
    npm install
    Pop-Location
    Write-Host "  >> Frontend dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "  >> Frontend dependencies OK" -ForegroundColor Green
}

Write-Host ""

# ============================================
# PASO 2: Verificar Archivo .env
# ============================================

Write-Host "[2/4] Verificando configuración..." -ForegroundColor Yellow

$envPath = Join-Path $backendPath ".env"
if (!(Test-Path $envPath)) {
    Write-Host "  >> ADVERTENCIA: Archivo .env no encontrado!" -ForegroundColor Red
    Write-Host "  >> Copiando .env.example a .env..." -ForegroundColor Magenta
    
    $envExamplePath = Join-Path $backendPath ".env.example"
    Copy-Item $envExamplePath $envPath
    
    Write-Host ""
    Write-Host "  !! ACCIÓN REQUERIDA !!" -ForegroundColor Red
    Write-Host "  Edita el archivo .env con tus credenciales de SQL Server:" -ForegroundColor Yellow
    Write-Host "  $envPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Presiona ENTER cuando hayas terminado de editar..." -ForegroundColor Yellow
    
    # Abrir el archivo .env en notepad
    Start-Process notepad $envPath
    
    Read-Host
} else {
    Write-Host "  >> Archivo .env encontrado" -ForegroundColor Green
}

Write-Host ""

# ============================================
# PASO 3: Verificar Base de Datos
# ============================================

Write-Host "[3/4] Verificando base de datos..." -ForegroundColor Yellow

Write-Host "  >> NOTA: Asegúrate de haber ejecutado:" -ForegroundColor Cyan
Write-Host "     1. Creado la base de datos 'EnglishExamDB'" -ForegroundColor White
Write-Host "     2. Ejecutado backend/database/schema.sql" -ForegroundColor White
Write-Host "     3. Ejecutado 'npm run seed' en backend/" -ForegroundColor White
Write-Host ""

$dbReady = Read-Host "  ¿La base de datos está lista? (y/n)"

if ($dbReady -ne "y") {
    Write-Host ""
    Write-Host "  >> Por favor, completa la configuración de la base de datos:" -ForegroundColor Red
    Write-Host ""
    Write-Host "     1. Abre SQL Server Management Studio" -ForegroundColor Yellow
    Write-Host "     2. Ejecuta: CREATE DATABASE EnglishExamDB;" -ForegroundColor Yellow
    Write-Host "     3. Ejecuta el script: $backendPath\database\schema.sql" -ForegroundColor Yellow
    Write-Host "     4. En PowerShell, ejecuta: cd $backendPath; npm run seed" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Presiona ENTER para continuar cuando esté listo..." -ForegroundColor Cyan
    Read-Host
}

Write-Host "  >> Base de datos lista" -ForegroundColor Green
Write-Host ""

# ============================================
# PASO 4: Iniciar Servidores
# ============================================

Write-Host "[4/4] Iniciando servidores..." -ForegroundColor Yellow
Write-Host ""

# Iniciar Backend en nueva ventana
Write-Host "  >> Iniciando Backend en http://localhost:3000..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '=== BACKEND SERVER ===' -ForegroundColor Green; npm run dev"

# Esperar un momento para que el backend inicie
Start-Sleep -Seconds 3

# Iniciar Frontend en nueva ventana
Write-Host "  >> Iniciando Frontend en http://localhost:4200..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '=== FRONTEND SERVER ===' -ForegroundColor Cyan; ng serve --open"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ Servidores iniciados correctamente" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:3000" -ForegroundColor White
Write-Host "Frontend: http://localhost:4200" -ForegroundColor White
Write-Host ""
Write-Host "El navegador se abrirá automáticamente..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Para detener los servidores:" -ForegroundColor Cyan
Write-Host "  - Cierra las ventanas de PowerShell que se abrieron" -ForegroundColor White
Write-Host "  - O presiona Ctrl+C en cada ventana" -ForegroundColor White
Write-Host ""
Write-Host "Presiona ENTER para cerrar este script..." -ForegroundColor Gray
Read-Host
