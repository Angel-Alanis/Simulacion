# ✅ CHECKLIST DE INSTALACIÓN Y VERIFICACIÓN
## English Exam Simulator - Guía Visual

---

## 📋 ANTES DE EMPEZAR

### ✅ Software Instalado
- [ ] Node.js v16+ instalado → `node --version`
- [ ] npm instalado → `npm --version`
- [ ] Angular CLI instalado → `ng version`
- [ ] SQL Server 2017+ instalado y corriendo
- [ ] SQL Server Management Studio (SSMS) instalado
- [ ] PowerShell 5.1+ disponible

**Comando de verificación rápida:**
```powershell
Write-Host "Node: $(node --version)"
Write-Host "NPM: $(npm --version)"
Write-Host "Angular: $(ng version --no-color | Select-String 'Angular CLI')"
```

---

## 🗄️ PASO 1: BASE DE DATOS

### ✅ Configurar SQL Server
- [ ] Abrir SQL Server Management Studio (SSMS)
- [ ] Conectar a instancia local (usualmente `localhost` o `.`)
- [ ] Crear base de datos:
  ```sql
  CREATE DATABASE EnglishExamDB;
  GO
  ```
- [ ] Verificar que se creó:
  ```sql
  SELECT name FROM sys.databases WHERE name = 'EnglishExamDB';
  ```

### ✅ Ejecutar Schema
- [ ] En SSMS, abrir archivo: `backend\database\schema.sql`
- [ ] Asegurar que estás en la BD correcta:
  ```sql
  USE EnglishExamDB;
  ```
- [ ] Ejecutar TODO el script (F5 o botón Execute)
- [ ] Verificar tablas creadas (deben ser 8):
  ```sql
  SELECT TABLE_NAME 
  FROM INFORMATION_SCHEMA.TABLES 
  WHERE TABLE_TYPE = 'BASE TABLE';
  ```
  
**Tablas esperadas:**
1. Levels
2. Questions  
3. ExamTypes
4. Users
5. Exams
6. ExamQuestions
7. UserAnswers
8. UserStatistics

---

## ⚙️ PASO 2: CONFIGURAR BACKEND

### ✅ Preparar Entorno
```powershell
cd Proyecto_ORDI\english-exam-simulator\backend
```

- [ ] Copiar archivo de configuración:
  ```powershell
  Copy-Item .env.example .env
  ```

- [ ] Editar `.env` con tus datos:
  ```powershell
  notepad .env
  ```

- [ ] Completar variables:
  ```env
  PORT=3000
  DB_SERVER=localhost
  DB_PORT=1433
  DB_USER=tu_usuario_aqui
  DB_PASSWORD=tu_password_aqui
  DB_NAME=EnglishExamDB
  JWT_SECRET=mi_secreto_super_seguro_123456
  NODE_ENV=development
  ```

### ✅ Instalar Dependencias
- [ ] Ejecutar instalación:
  ```powershell
  npm install
  ```

- [ ] Verificar instalación exitosa (debe crear carpeta `node_modules`)
- [ ] Verificar que no hay errores en la salida

**Paquetes principales que se instalan:**
- express (servidor web)
- mssql (driver SQL Server)
- bcryptjs (encriptación de passwords)
- jsonwebtoken (autenticación JWT)
- express-validator (validación de datos)
- cors (cross-origin resource sharing)

### ✅ Cargar Datos Iniciales (80 Preguntas)
- [ ] Ejecutar seed script:
  ```powershell
  npm run seed
  ```

- [ ] Verificar salida exitosa:
  ```
  Seeding database...
  ✓ Levels seeded successfully
  ✓ Exam types seeded successfully
  ✓ Questions seeded successfully (80 questions)
  Database seeded successfully!
  ```

- [ ] Verificar en SQL Server:
  ```sql
  USE EnglishExamDB;
  SELECT COUNT(*) as TotalQuestions FROM Questions;
  -- Debe retornar: 80
  
  SELECT COUNT(*) as TotalLevels FROM Levels;
  -- Debe retornar: 6
  
  SELECT * FROM ExamTypes;
  -- Debe mostrar: Practice y Final
  ```

### ✅ Iniciar Servidor Backend
- [ ] En una terminal PowerShell dedicada:
  ```powershell
  cd backend
  npm run dev
  ```

- [ ] Verificar que inicia correctamente:
  ```
  Server running on port 3000
  Database connected successfully
  ```

- [ ] Probar endpoint de salud:
  ```powershell
  # En OTRA terminal
  curl http://localhost:3000/api/users/test
  ```
  
  **Respuesta esperada:**
  ```json
  {"message":"API is working"}
  ```

**✅ BACKEND COMPLETADO** - Dejar esta terminal abierta

---

## 🎨 PASO 3: CONFIGURAR FRONTEND

### ✅ Preparar Frontend
```powershell
# Abrir NUEVA terminal PowerShell
cd Proyecto_ORDI\english-exam-simulator\frontend
```

### ✅ Instalar Dependencias
- [ ] Ejecutar instalación:
  ```powershell
  npm install
  ```

- [ ] Esperar 3-5 minutos (descarga muchos paquetes)
- [ ] Verificar que no hay errores críticos
- [ ] Verificar carpeta `node_modules` creada

**Paquetes principales:**
- @angular/core, @angular/common, etc. (framework)
- @angular/material (componentes UI)
- chart.js, ng2-charts (gráficos)
- jwt-decode (manejo de tokens)
- ngx-toastr (notificaciones)

### ✅ Verificar Configuración
- [ ] Revisar archivo de environment:
  ```powershell
  notepad src\environments\environment.ts
  ```

- [ ] Debe contener:
  ```typescript
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api'
  };
  ```

- [ ] Verificar que apunta al backend correcto (puerto 3000)

### ✅ Iniciar Servidor Frontend
- [ ] Ejecutar desarrollo:
  ```powershell
  ng serve --open
  ```

- [ ] Esperar compilación (1-2 minutos la primera vez)
- [ ] Verificar salida exitosa:
  ```
  ✔ Browser application bundle generation complete.
  ✔ Compiled successfully.
  ** Angular Live Development Server is listening on localhost:4200 **
  ```

- [ ] Navegador debe abrir automáticamente en `http://localhost:4200`

**✅ FRONTEND COMPLETADO** - Dejar esta terminal abierta

---

## 🧪 PASO 4: PRUEBAS DE FUNCIONALIDAD

### ✅ Test 1: Página de Login
- [ ] Abrir http://localhost:4200
- [ ] Debe mostrar formulario de login
- [ ] Debe tener campos: Email, Password
- [ ] Debe tener botón "Sign In"
- [ ] Debe tener link "Sign up here"

### ✅ Test 2: Registro de Usuario
- [ ] Click en "Sign up here"
- [ ] Llenar formulario:
  - Name: `Test User`
  - Email: `test@example.com`
  - Password: `test123`
  - Confirm Password: `test123`
- [ ] Click "Sign Up"
- [ ] Debe redirigir al Dashboard
- [ ] Debe mostrar mensaje de éxito (toast verde)

### ✅ Test 3: Dashboard Visible
- [ ] Debe ver barra superior con "Welcome, Test User!"
- [ ] Debe ver 4 tarjetas de estadísticas:
  - Current Level
  - Total Exams
  - Average Score
  - Best Score
- [ ] Debe ver 2 tarjetas de acción:
  - Practice Exam
  - Final Exam
- [ ] Debe ver sección de gráficos
- [ ] Debe ver "Recent Activity"

### ✅ Test 4: Backend Recibiendo Datos
- [ ] En terminal del backend, debe ver logs:
  ```
  POST /api/users/register 201
  POST /api/users/login 200
  GET /api/dashboard/stats 200
  ```

### ✅ Test 5: Base de Datos Actualizada
- [ ] En SSMS, ejecutar:
  ```sql
  USE EnglishExamDB;
  SELECT * FROM Users;
  ```
- [ ] Debe aparecer tu usuario recién creado
- [ ] Password debe estar encriptado (no legible)

### ✅ Test 6: Cerrar Sesión y Login
- [ ] En Dashboard, click en ícono de usuario (arriba derecha)
- [ ] Click en "Logout"
- [ ] Debe redirigir a página de login
- [ ] Iniciar sesión nuevamente:
  - Email: `test@example.com`
  - Password: `test123`
- [ ] Debe regresar al Dashboard

### ✅ Test 7: Navegación
- [ ] En menú superior, probar links:
  - Profile (debe mostrar página básica)
  - Exam History (debe mostrar página básica)
- [ ] Todos deben funcionar sin errores 404

---

## 🎯 PASO 5: VERIFICACIÓN COMPLETA

### ✅ Checklist Final

**Backend:**
- [ ] Servidor corriendo en puerto 3000
- [ ] Base de datos conectada
- [ ] 80 preguntas cargadas
- [ ] Endpoints respondiendo correctamente
- [ ] Logs mostrando peticiones

**Frontend:**
- [ ] Aplicación corriendo en puerto 4200
- [ ] Sin errores en consola del navegador (F12)
- [ ] Login funcional
- [ ] Registro funcional
- [ ] Dashboard mostrando datos
- [ ] Navegación funcionando

**Base de Datos:**
- [ ] 8 tablas creadas
- [ ] 80 preguntas en tabla Questions
- [ ] 6 niveles en tabla Levels
- [ ] 2 tipos de examen en ExamTypes
- [ ] Usuario de prueba creado

**Documentación:**
- [ ] README_EQUIPO.md leído
- [ ] GUIA_INSTALACION_COMPLETA.md disponible
- [ ] Scripts de ayuda conocidos

---

## 🐛 TROUBLESHOOTING RÁPIDO

### ❌ "Cannot connect to SQL Server"
```powershell
# Verificar servicio
Get-Service -Name 'MSSQL*' | Select-Object Name, Status

# Iniciar si está detenido
Start-Service -Name 'MSSQLSERVER'
```

### ❌ "Port 3000 already in use"
```powershell
# Opción 1: Matar proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Opción 2: Cambiar puerto en .env
notepad backend\.env  # Cambiar PORT=3001
```

### ❌ "Module not found" en Angular
```powershell
cd frontend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

### ❌ Página en blanco en navegador
```powershell
# F12 en navegador → Pestaña Console
# Buscar errores rojos
# Revisar que backend esté corriendo
curl http://localhost:3000/api/users/test
```

### ❌ "Unauthorized" o "Token expired"
- Cerrar sesión y volver a iniciar
- Borrar localStorage: F12 → Application → Local Storage → Clear All

---

## 🎉 ÉXITO - ¿QUÉ SIGUE?

Si todos los checkboxes están marcados, **¡felicidades!** El proyecto está completamente configurado.

### Próximos Pasos del Equipo:

1. **Familiarizarse con el código**
   - Revisar `backend/src/controllers/`
   - Revisar `frontend/src/app/core/services/`
   - Ver estructura de componentes

2. **Implementar componentes faltantes**
   - Exam Component (tomar examen)
   - Result Component (ver resultados)
   - Profile Component (editar perfil)
   - History Component (ver historial)

3. **Probar flujo completo**
   - Crear usuario
   - Tomar examen de práctica (20 preguntas)
   - Ver resultados
   - Tomar examen final (40 preguntas)
   - Revisar historial

4. **Documentar cambios**
   - Comentar código nuevo
   - Actualizar README si es necesario

---

## 📊 RESUMEN VISUAL

```
┌─────────────────────────────────────────────────────────┐
│                    TU PROYECTO                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  BACKEND (http://localhost:3000)                        │
│  ├── ✅ API REST funcionando                            │
│  ├── ✅ 80 Preguntas cargadas                           │
│  ├── ✅ Autenticación JWT                               │
│  └── ✅ Base de datos conectada                         │
│                                                         │
│  FRONTEND (http://localhost:4200)                       │
│  ├── ✅ Login/Register                                  │
│  ├── ✅ Dashboard completo                              │
│  ├── 🔧 Exam (base creada)                              │
│  ├── 🔧 Result (base creada)                            │
│  ├── 🔧 Profile (base creada)                           │
│  └── 🔧 History (base creada)                           │
│                                                         │
│  DOCUMENTACIÓN                                          │
│  ├── ✅ README_EQUIPO.md                                │
│  ├── ✅ GUIA_INSTALACION_COMPLETA.md                    │
│  ├── ✅ Este checklist                                  │
│  └── ✅ Scripts de ayuda                                │
│                                                         │
└─────────────────────────────────────────────────────────┘

Leyenda:
✅ = Completamente funcional
🔧 = Base implementada (expandir con UI)
```

---

**¡Mucho éxito con el proyecto!** 🚀

Si necesitas ayuda, revisa:
1. Este checklist primero
2. GUIA_INSTALACION_COMPLETA.md después
3. Comentarios en el código
4. Google/StackOverflow para dudas específicas de Angular/Node.js

---

**Fecha:** $(Get-Date -Format "yyyy-MM-dd HH:mm")  
**Versión:** 1.0.0
