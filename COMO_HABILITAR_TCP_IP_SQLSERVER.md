# ========================================
# GUÍA RÁPIDA: HABILITAR TCP/IP EN SQL SERVER EXPRESS
# ========================================

## Problema actual:
Tu SQL Server Express no tiene habilitado el protocolo TCP/IP, lo que impide que Node.js se conecte.

## SOLUCIÓN RÁPIDA (5 minutos):

### Opción 1: Usando SQL Server Configuration Manager

1. **Abrir SQL Server Configuration Manager:**
   - Presiona Windows + R
   - Escribe: `SQLServerManager16.msc` (o `SQLServerManager15.msc` si es otra versión)
   - Enter

2. **Habilitar TCP/IP:**
   - En el panel izquierdo, expande: **SQL Server Network Configuration**
   - Click en: **Protocols for SQLEXPRESS**
   - En el panel derecho, click derecho en **TCP/IP**
   - Selecciona **Enable**

3. **Configurar TCP/IP:**
   - Doble click en **TCP/IP**
   - Ve a la pestaña **IP Addresses**
   - Busca la sección **IPALL** (al final)
   - En **TCP Port**, escribe: `1433`
   - Click **OK**

4. **Reiniciar el servicio SQL Server:**
   - En el panel izquierdo, ve a: **SQL Server Services**
   - Click derecho en **SQL Server (SQLEXPRESS)**
   - Selecciona **Restart**

5. **Habilitar SQL Server Browser (Opcional pero recomendado):**
   - Click derecho en **SQL Server Browser**
   - **Properties** → Pestaña **Service** → **Start Mode**: **Automatic**
   - Click **OK**
   - Click derecho en **SQL Server Browser** → **Start**

---

### Opción 2: Usando PowerShell como Administrador

1. **Abrir PowerShell como Administrador:**
   - Click derecho en el ícono de Windows
   - Selecciona "Windows PowerShell (Admin)" o "Terminal (Admin)"

2. **Ejecutar estos comandos:**

```powershell
# Habilitar SQL Browser
Set-Service -Name "SQLBrowser" -StartupType Automatic
Start-Service -Name "SQLBrowser"

# Reiniciar SQL Server
Restart-Service -Name "MSSQL$SQLEXPRESS" -Force

# Verificar servicios
Get-Service | Where-Object {$_.Name -like "*SQL*"} | Select-Object Name, Status, StartType
```

---

### Opción 3: Usar Autenticación de Windows (MÁS FÁCIL)

Si no puedes habilitar TCP/IP, podemos usar autenticación de Windows que funciona con Named Pipes:

1. **Verificar que tu usuario de Windows tenga permisos en SQL Server:**
   - Abre SQL Server Management Studio (SSMS)
   - Conecta con: `ANGEL\SQLEXPRESS` usando Windows Authentication
   - Expande: **Security** → **Logins**
   - Verifica que tu usuario `ANGEL\alani` esté en la lista
   - Si no está, click derecho en **Logins** → **New Login** → Agrega tu usuario

2. **Modifica el archivo backend\.env:**
   ```
   DB_SERVER=ANGEL\\SQLEXPRESS
   DB_DATABASE=EnglishExamDB
   DB_USER=
   DB_PASSWORD=
   DB_ENCRYPT=false
   DB_TRUST_SERVER_CERTIFICATE=true
   DB_USE_WINDOWS_AUTH=true
   ```

3. **Modifica backend\src\config\database.js:**
   ```javascript
   const config = {
     server: process.env.DB_SERVER,
     database: process.env.DB_DATABASE,
     options: {
       encrypt: process.env.DB_ENCRYPT === 'true',
       trustServerCertificate: true,
       enableArithAbort: true,
       trustedConnection: true  // <-- AGREGAR ESTA LÍNEA
     },
     // Remover user y password si usas Windows Auth
     pool: {
       max: 10,
       min: 0,
       idleTimeoutMillis: 30000
     }
   };
   ```

---

## VERIFICAR QUE FUNCIONÓ:

Después de cualquiera de las opciones, ejecuta en el backend:

```powershell
cd c:\Users\alani\OneDrive\Documentos\Simulacion\Proyecto_ORDI\english-exam-simulator\backend
npm run seed
```

Si ves: `✅ Seed completado con éxito!` → Todo funcionó!

---

## COMANDOS ÚTILES PARA DIAGNÓSTICO:

```powershell
# Ver servicios de SQL Server
Get-Service | Where-Object {$_.Name -like "*SQL*"}

# Ver qué puerto usa SQL Server
Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL*.SQLEXPRESS\MSSQLServer\SuperSocketNetLib\Tcp"

# Probar conexión desde PowerShell
Test-NetConnection -ComputerName localhost -Port 1433
```

---

## ¿QUÉ OPCIÓN ELEGIR?

- **¿Tienes permisos de administrador?** → Opción 1 o 2 (más robusto)
- **¿No tienes permisos?** → Opción 3 (Windows Auth, más fácil)
- **¿Estás en una red corporativa?** → Consulta con TI primero

---

**IMPORTANTE:** Después de realizar cualquier cambio, **cierra y vuelve a abrir VS Code** para que cargue las nuevas variables de entorno.
