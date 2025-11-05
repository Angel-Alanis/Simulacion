# ⚡ INSTALACIÓN RÁPIDA - PRERREQUISITOS

## 🎯 Lo que necesitas instalar ANTES de ejecutar el proyecto

### 1️⃣ Node.js (REQUERIDO)
**Descargar e instalar:**
https://nodejs.org/

**Recomendación:** Descarga la versión LTS (Long Term Support)

**Pasos:**
1. Abre el link en tu navegador
2. Click en "Download Node.js (LTS)"
3. Ejecuta el instalador descargado
4. Click "Next" en todas las opciones (usar configuración por defecto)
5. Reinicia PowerShell después de instalar

**Verificar instalación:**
```powershell
node --version
npm --version
```

Deberías ver algo como:
```
v20.x.x
10.x.x
```

---

### 2️⃣ Angular CLI (REQUERIDO para Frontend)
**Después de instalar Node.js, ejecuta:**
```powershell
npm install -g @angular/cli
```

**Verificar instalación:**
```powershell
ng version
```

---

### 3️⃣ SQL Server (REQUERIDO para Base de Datos)

**Opción A - SQL Server Express (Gratis, Recomendado):**
https://www.microsoft.com/sql-server/sql-server-downloads

1. Scroll hasta "Express"
2. Click "Download now"
3. Ejecutar instalador
4. Seleccionar "Basic" installation
5. Seguir wizard de instalación

**Opción B - SQL Server Developer Edition (Gratis, más completo):**
Mismo link, seleccionar "Developer"

**También necesitas SQL Server Management Studio (SSMS):**
https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms

---

## 🔧 DESPUÉS DE INSTALAR TODO

Reinicia PowerShell y ejecuta:

```powershell
# Verificar Node.js
node --version
npm --version

# Verificar Angular
ng version

# Verificar SQL Server (debería estar en servicios)
Get-Service -Name 'MSSQL*'
```

---

## ⏭️ SIGUIENTE PASO

Una vez que tengas todo instalado, ejecuta:

```powershell
cd Proyecto_ORDI\english-exam-simulator
.\start-project.ps1
```

---

## ⏱️ TIEMPO ESTIMADO

- Node.js: 5 minutos
- Angular CLI: 2 minutos
- SQL Server: 10-15 minutos
- **Total: ~20 minutos**

---

## 🆘 ¿NECESITAS AYUDA?

Si tienes problemas instalando algo, házmelo saber y te ayudo paso a paso.
