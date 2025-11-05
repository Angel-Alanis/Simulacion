# ============================================
# Script para habilitar TCP/IP en SQL Server Express
# EJECUTAR COMO ADMINISTRADOR
# ============================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " CONFIGURANDO SQL SERVER EXPRESS" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# 1. Habilitar y arrancar SQL Browser
Write-Host "[1/4] Habilitando SQL Server Browser..." -ForegroundColor Yellow
try {
    Set-Service -Name "SQLBrowser" -StartupType Automatic -ErrorAction Stop
    Start-Service -Name "SQLBrowser" -ErrorAction Stop
    Write-Host "✅ SQL Browser habilitado y arrancado" -ForegroundColor Green
} catch {
    Write-Host "⚠️  No se pudo arrancar SQL Browser: $_" -ForegroundColor Red
}

# 2. Verificar servicio SQL Server
Write-Host "`n[2/4] Verificando SQL Server Express..." -ForegroundColor Yellow
$sqlService = Get-Service -Name "MSSQL`$SQLEXPRESS" -ErrorAction SilentlyContinue
if ($sqlService) {
    Write-Host "✅ SQL Server Express encontrado - Estado: $($sqlService.Status)" -ForegroundColor Green
    if ($sqlService.Status -ne "Running") {
        Start-Service -Name "MSSQL`$SQLEXPRESS"
        Write-Host "✅ SQL Server Express iniciado" -ForegroundColor Green
    }
} else {
    Write-Host "❌ SQL Server Express no encontrado" -ForegroundColor Red
}

# 3. Habilitar TCP/IP usando WMI
Write-Host "`n[3/4] Habilitando protocolo TCP/IP..." -ForegroundColor Yellow
try {
    # Cargar el assembly de SMO
    [System.Reflection.Assembly]::LoadWithPartialName("Microsoft.SqlServer.SqlWmiManagement") | Out-Null
    
    $smo = New-Object Microsoft.SqlServer.Management.Smo.Wmi.ManagedComputer
    $instance = $smo.ServerInstances['SQLEXPRESS']
    
    if ($instance) {
        $tcp = $instance.ServerProtocols['Tcp']
        if ($tcp) {
            $tcp.IsEnabled = $true
            $tcp.Alter()
            Write-Host "✅ Protocolo TCP/IP habilitado" -ForegroundColor Green
            
            # Configurar el puerto 1433
            $ipAll = $tcp.IPAddresses['IPAll']
            $ipAll.IPAddressProperties['TcpPort'].Value = '1433'
            $tcp.Alter()
            Write-Host "✅ Puerto TCP 1433 configurado" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "⚠️  No se pudo habilitar TCP/IP automáticamente" -ForegroundColor Red
    Write-Host "    Debes hacerlo manualmente con SQL Server Configuration Manager" -ForegroundColor Yellow
}

# 4. Reiniciar SQL Server para aplicar cambios
Write-Host "`n[4/4] Reiniciando SQL Server Express..." -ForegroundColor Yellow
try {
    Restart-Service -Name "MSSQL`$SQLEXPRESS" -Force -ErrorAction Stop
    Write-Host "✅ SQL Server Express reiniciado" -ForegroundColor Green
} catch {
    Write-Host "⚠️  No se pudo reiniciar SQL Server: $_" -ForegroundColor Red
}

# 5. Verificar estado final
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host " ESTADO FINAL DE SERVICIOS" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

Get-Service | Where-Object {$_.Name -like "*SQL*"} | Format-Table Name, Status, StartType -AutoSize

# 6. Probar conectividad al puerto 1433
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host " PROBANDO CONECTIVIDAD" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

Write-Host "Probando conexión al puerto 1433..." -ForegroundColor Yellow
Start-Sleep -Seconds 3  # Esperar a que el servicio esté completamente arrancado

$testConnection = Test-NetConnection -ComputerName localhost -Port 1433 -WarningAction SilentlyContinue
if ($testConnection.TcpTestSucceeded) {
    Write-Host "✅ ¡ÉXITO! Puerto 1433 está abierto y escuchando" -ForegroundColor Green
    Write-Host "`nPuedes ejecutar ahora:" -ForegroundColor Cyan
    Write-Host "   cd backend" -ForegroundColor White
    Write-Host "   npm run seed" -ForegroundColor White
} else {
    Write-Host "⚠️  El puerto 1433 aún no responde" -ForegroundColor Yellow
    Write-Host "`nIntenta:" -ForegroundColor Cyan
    Write-Host "1. Abre SQL Server Configuration Manager" -ForegroundColor White
    Write-Host "2. Habilita TCP/IP manualmente" -ForegroundColor White
    Write-Host "3. Reinicia el servicio SQL Server" -ForegroundColor White
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
