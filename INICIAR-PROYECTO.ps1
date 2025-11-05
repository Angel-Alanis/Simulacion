# Iniciar proyecto completo
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SIMULADOR DE EXAMEN DE INGLES" -ForegroundColor Cyan
Write-Host "  3 Niveles: Basico, Intermedio, Avanzado" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

# Navegar al directorio del proyecto
$projectRoot = "c:\Users\alani\OneDrive\Documentos\Simulacion\Proyecto_ORDI\english-exam-simulator"

# Iniciar Backend
Write-Host "[1/2] Iniciando Backend..." -ForegroundColor Yellow
$backendPath = Join-Path $projectRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'BACKEND INICIADO' -ForegroundColor Green; node src/server.js"

Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "[2/2] Iniciando Frontend..." -ForegroundColor Yellow
$frontendPath = Join-Path $projectRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'FRONTEND INICIANDO...' -ForegroundColor Green; ng serve --port 4200 --open"

Start-Sleep -Seconds 3

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ✅ PROYECTO INICIADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:3000" -ForegroundColor White
Write-Host "Frontend: http://localhost:4200" -ForegroundColor White
Write-Host ""
Write-Host "Se abrirán 2 ventanas de PowerShell." -ForegroundColor Yellow
Write-Host "NO LAS CIERRES mientras uses la aplicación." -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
