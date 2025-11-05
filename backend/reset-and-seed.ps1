# Script para reinicializar la base de datos con 3 niveles
Write-Host "=== Reinicializando Base de Datos ===" -ForegroundColor Cyan

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "`n1. Limpiando tablas existentes..." -ForegroundColor Yellow
# Ejecutar reset-database.sql en SQL Server
sqlcmd -S localhost -d EnglishExamDB -i "database\reset-database.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host "   Tablas eliminadas correctamente" -ForegroundColor Green
} else {
    Write-Host "   Error al eliminar tablas" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Creando nueva estructura..." -ForegroundColor Yellow
# Ejecutar schema.sql
sqlcmd -S localhost -d EnglishExamDB -i "database\schema.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host "   Estructura creada correctamente" -ForegroundColor Green
} else {
    Write-Host "   Error al crear estructura" -ForegroundColor Red
    exit 1
}

Write-Host "`n3. Poblando datos (80 preguntas, 3 niveles)..." -ForegroundColor Yellow
# Ejecutar seed
npm run seed

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Base de Datos Reinicializada ===" -ForegroundColor Green
    Write-Host "- 3 niveles: Basico (0-69%), Intermedio (70-84%), Avanzado (85-100%)" -ForegroundColor White
    Write-Host "- 80 preguntas distribuidas: Basico (30), Intermedio (30), Avanzado (20)" -ForegroundColor White
    Write-Host "- Practica: 20 preguntas, 5pts c/u, 5 intentos" -ForegroundColor White
    Write-Host "- Final: 40 preguntas, 2.5pts c/u, 2 intentos" -ForegroundColor White
    Write-Host "- Aprobacion: 70% o mas" -ForegroundColor White
} else {
    Write-Host "`n=== Error en el seed ===" -ForegroundColor Red
    exit 1
}
