# Script para iniciar Backend y Frontend con acceso en red local
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INICIANDO SIMULADOR (RED LOCAL)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$projectRoot = "c:\Users\alani\OneDrive\Documentos\Simulacion\Proyecto_ORDI\english-exam-simulator"

# Obtener IP local
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"}).IPAddress | Select-Object -First 1

Write-Host "Tu IP local es: $ip" -ForegroundColor Green
Write-Host ""

# Iniciar Backend
Write-Host "[1/2] Iniciando Backend..." -ForegroundColor Yellow
$backendPath = Join-Path $projectRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'BACKEND CORRIENDO' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 3

# Iniciar Frontend con acceso en red
Write-Host "[2/2] Iniciando Frontend (accesible en red)..." -ForegroundColor Yellow
$frontendPath = Join-Path $projectRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'FRONTEND CORRIENDO EN RED' -ForegroundColor Green; ng serve --host=0.0.0.0 --port=4200 --disable-host-check"

Start-Sleep -Seconds 5

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ✅ PROYECTO INICIADO EN RED LOCAL" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "ACCESO LOCAL:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:4200" -ForegroundColor White
Write-Host "  Backend:  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "ACCESO DESDE OTROS DISPOSITIVOS:" -ForegroundColor Yellow
Write-Host "  Frontend: http://${ip}:4200" -ForegroundColor Green
Write-Host "  Backend:  http://${ip}:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Nota: Los otros dispositivos deben estar en la misma red WiFi" -ForegroundColor Gray
Write-Host ""
Write-Host "Se abrieron 2 ventanas de PowerShell." -ForegroundColor Yellow
Write-Host "NO LAS CIERRES mientras uses la aplicación." -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
