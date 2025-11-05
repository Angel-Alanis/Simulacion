# 🚀 GUÍA DE INSTALACIÓN Y EJECUCIÓN RÁPIDA
## English Exam Simulator - Setup Completo en 15 Minutos

---

## 📋 PRERREQUISITOS

Asegúrate de tener instalado:
- **Node.js** v16.0.0 o superior → [Descargar aquí](https://nodejs.org/)
- **SQL Server** 2017 o superior → [Descargar Express Edition](https://www.microsoft.com/sql-server/sql-server-downloads)
- **Angular CLI** → Instalar con: `npm install -g @angular/cli`
- **Git** (opcional) → [Descargar aquí](https://git-scm.com/)

---

## ⚡ INSTALACIÓN RÁPIDA - BACKEND

### Paso 1: Configurar Base de Datos

```powershell
# 1. Abre SQL Server Management Studio (SSMS)
# 2. Conéctate a tu instancia local
# 3. Crea la base de datos
```

```sql
CREATE DATABASE EnglishExamDB;
GO
```

```powershell
# 4. Ejecuta el script de esquema
# Abre: Proyecto_ORDI\english-exam-simulator\backend\database\schema.sql
# Ejecuta TODO el contenido en la base de datos EnglishExamDB
```

### Paso 2: Configurar Variables de Entorno

```powershell
# Navega a la carpeta backend
cd Proyecto_ORDI\english-exam-simulator\backend

# Crea el archivo .env (copia de .env.example)
Copy-Item .env.example .env

# Edita .env con tus valores
notepad .env
```

**Contenido del archivo `.env`:**

```env
# Puerto del servidor
PORT=3000

# Configuración de SQL Server
DB_SERVER=localhost
DB_PORT=1433
DB_USER=tu_usuario_sql
DB_PASSWORD=tu_password_sql
DB_NAME=EnglishExamDB

# JWT Secret (puedes generar uno aleatorio)
JWT_SECRET=tu_clave_secreta_super_segura_123456

# Entorno
NODE_ENV=development
```

> **IMPORTANTE:** Reemplaza `tu_usuario_sql` y `tu_password_sql` con tus credenciales reales de SQL Server.

### Paso 3: Instalar Dependencias Backend

```powershell
# Asegúrate de estar en la carpeta backend
cd Proyecto_ORDI\english-exam-simulator\backend

# Instala todas las dependencias
npm install
```

**Esto instalará:**
- express
- mssql
- bcryptjs
- jsonwebtoken
- dotenv
- express-validator
- cors
- Y todas las dev dependencies

### Paso 4: Cargar Datos Iniciales (80 Preguntas)

```powershell
# Ejecuta el script de seed
npm run seed
```

**Deberías ver:**
```
Seeding database...
✓ Levels seeded successfully
✓ Exam types seeded successfully
✓ Questions seeded successfully (80 questions)
Database seeded successfully!
```

### Paso 5: Iniciar Servidor Backend

```powershell
# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

**Servidor corriendo en:** `http://localhost:3000`

**Verifica que funciona:**
```powershell
# En otra terminal PowerShell
curl http://localhost:3000/api/users/test
```

Deberías ver: `{"message":"API is working"}`

---

## 🎨 INSTALACIÓN RÁPIDA - FRONTEND

### Paso 1: Instalar Dependencias Frontend

```powershell
# Abre una NUEVA terminal PowerShell
# Navega a la carpeta frontend
cd Proyecto_ORDI\english-exam-simulator\frontend

# Instala todas las dependencias
npm install
```

**Esto instalará:**
- Angular 17
- Angular Material
- Chart.js
- ng2-charts
- jwt-decode
- ngx-toastr
- RxJS
- Y todas las dependencias de desarrollo

**⏰ Tiempo estimado:** 3-5 minutos dependiendo de tu conexión

### Paso 2: Verificar Configuración

```powershell
# Verifica que el archivo de entorno apunta al backend correcto
notepad src\environments\environment.ts
```

**Debe contener:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Paso 3: Iniciar Aplicación Angular

```powershell
# Inicia el servidor de desarrollo
ng serve --open
```

**O alternativamente:**
```powershell
npm start
```

**Aplicación corriendo en:** `http://localhost:4200`

El navegador se abrirá automáticamente con el flag `--open`

---

## ✅ VERIFICACIÓN COMPLETA

### Test 1: Backend Funcionando

```powershell
# Test endpoint de salud
curl http://localhost:3000/api/users/test
```

### Test 2: Frontend Compilando

Busca en la terminal donde ejecutaste `ng serve`:

```
✔ Browser application bundle generation complete.
✔ Compiled successfully.
** Angular Live Development Server is listening on localhost:4200 **
```

### Test 3: Registro de Usuario

1. Abre `http://localhost:4200`
2. Ve a "Sign up here"
3. Llena el formulario:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
4. Click "Sign Up"
5. Deberías ser redirigido al Dashboard

### Test 4: Base de Datos con Preguntas

```sql
-- En SQL Server Management Studio
USE EnglishExamDB;

-- Verifica las 80 preguntas
SELECT COUNT(*) as TotalQuestions FROM Questions;
-- Resultado esperado: 80

-- Verifica niveles
SELECT * FROM Levels;
-- Resultado esperado: 6 niveles

-- Verifica tipos de examen
SELECT * FROM ExamTypes;
-- Resultado esperado: 2 tipos (Practice y Final)
```

---

## 🎯 PRUEBA COMPLETA DEL SISTEMA

### Flujo de Prueba Recomendado:

1. **Registro/Login**
   - Crea una cuenta nueva
   - Cierra sesión
   - Inicia sesión nuevamente

2. **Dashboard**
   - Verifica que se muestre tu nivel actual
   - Revisa las estadísticas (deben estar en 0)

3. **Practice Exam**
   - Click en "Start Practice"
   - Responde las 20 preguntas
   - Observa el timer en cada pregunta
   - Finaliza el examen
   - Revisa tu score y nivel obtenido

4. **Dashboard Actualizado**
   - Regresa al dashboard
   - Verifica que las estadísticas se hayan actualizado
   - Los gráficos deben mostrar tu progreso

5. **Final Exam**
   - Click en "Start Final"
   - Responde las 40 preguntas
   - Finaliza y revisa resultados

6. **History**
   - Ve a "Exam History"
   - Verifica que se muestren ambos exámenes
   - Revisa detalles de cada intento

---

## 🛠️ COMANDOS ÚTILES

### Backend Commands

```powershell
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Resetear base de datos y volver a cargar datos
npm run seed

# Ver logs del servidor
# Los logs aparecen en la terminal donde ejecutaste npm run dev
```

### Frontend Commands

```powershell
# Servidor de desarrollo
ng serve

# Servidor de desarrollo con auto-open
ng serve --open

# Build para producción
ng build --configuration production

# Limpiar caché de Angular
ng cache clean

# Verificar versión de Angular
ng version
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
Proyecto_ORDI/
└── english-exam-simulator/
    ├── backend/
    │   ├── database/
    │   │   ├── schema.sql       ← Ejecutar primero
    │   │   └── seed.js          ← Ejecutar con npm run seed
    │   ├── src/
    │   │   ├── config/          ← Configuración DB
    │   │   ├── controllers/     ← Lógica de endpoints
    │   │   ├── models/          ← Lógica de negocio
    │   │   ├── routes/          ← Definición de rutas
    │   │   ├── middleware/      ← Auth y validación
    │   │   └── server.js        ← Punto de entrada
    │   ├── .env                 ← Variables de entorno (CREAR)
    │   ├── .env.example         ← Plantilla
    │   └── package.json
    │
    └── frontend/
        ├── src/
        │   ├── app/
        │   │   ├── core/
        │   │   │   ├── guards/      ← Protección de rutas
        │   │   │   ├── interceptors/ ← JWT automático
        │   │   │   ├── models/      ← Interfaces TypeScript
        │   │   │   └── services/    ← Lógica de API
        │   │   ├── pages/
        │   │   │   ├── login/
        │   │   │   ├── register/
        │   │   │   ├── dashboard/
        │   │   │   ├── exam/
        │   │   │   ├── result/
        │   │   │   ├── profile/
        │   │   │   └── history/
        │   │   ├── app.module.ts
        │   │   └── app-routing.module.ts
        │   ├── environments/
        │   ├── index.html
        │   ├── main.ts
        │   └── styles.scss
        └── package.json
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "Cannot connect to SQL Server"

**Solución:**
```powershell
# 1. Verifica que SQL Server esté corriendo
services.msc  # Busca "SQL Server (MSSQLSERVER)" y asegúrate que está "Running"

# 2. Verifica credenciales en .env
notepad backend\.env

# 3. Prueba conexión manual en SSMS
```

### Error: "Port 3000 is already in use"

**Solución:**
```powershell
# Cambiar puerto en backend\.env
PORT=3001

# O matar el proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Error: "Module not found" en Angular

**Solución:**
```powershell
cd frontend
rm -r node_modules
rm package-lock.json
npm install
```

### Error: Compilation errors en TypeScript

**Solución:**
```powershell
# Todos los errores actuales son porque node_modules no existe
# Se resolverán automáticamente al ejecutar:
npm install
```

### Angular serve es muy lento

**Solución:**
```powershell
# Limpiar caché de Angular
ng cache clean

# Reinstalar dependencias
rm -r node_modules
npm install
```

---

## 📊 ENDPOINTS DEL API

### Autenticación
- `POST /api/users/register` - Registro de usuario
- `POST /api/users/login` - Iniciar sesión
- `GET /api/users/profile` - Obtener perfil (requiere auth)
- `PUT /api/users/profile` - Actualizar perfil (requiere auth)

### Exámenes
- `POST /api/exams/start` - Iniciar examen
- `POST /api/exams/answer` - Enviar respuesta
- `POST /api/exams/finish` - Finalizar examen
- `GET /api/exams/history` - Historial de exámenes
- `GET /api/exams/:id` - Detalle de examen

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/progress` - Datos de progreso
- `GET /api/dashboard/analysis` - Análisis practice vs final

### Preguntas
- `GET /api/questions/levels` - Obtener niveles
- `GET /api/questions/level/:levelId` - Preguntas por nivel
- `GET /api/questions/:id` - Detalle de pregunta

---

## 🎓 USUARIOS DE PRUEBA

Después de ejecutar el seed, puedes crear usuarios de prueba manualmente:

```sql
-- Usuario de prueba (password: test123)
INSERT INTO Users (name, email, password, currentLevel, createdAt, updatedAt)
VALUES ('Test User', 'test@example.com', '$2a$10$encrypted_password_here', 'Beginner', GETDATE(), GETDATE());
```

O simplemente usa la interfaz de registro en `http://localhost:4200/register`

---

## 📞 CONTACTO Y SOPORTE

Si encuentras algún problema:

1. Revisa esta guía nuevamente
2. Verifica la sección de "Solución de Problemas"
3. Consulta los logs en las terminales de backend y frontend
4. Revisa la documentación completa en `README.md`

---

## ✨ CARACTERÍSTICAS PRINCIPALES

- ✅ 80 Preguntas de inglés en 6 niveles
- ✅ Exámenes de práctica (20 preguntas, 5 intentos)
- ✅ Exámenes finales (40 preguntas, 2 intentos)
- ✅ Timer de 60 segundos por pregunta
- ✅ Dashboard con análisis y gráficos
- ✅ Determinación automática de nivel
- ✅ Historial completo de exámenes
- ✅ Sistema de autenticación seguro (JWT)
- ✅ Interfaz responsive con Angular Material
- ✅ Visualización de datos con Chart.js

---

## 🎉 ¡LISTO PARA USAR!

Una vez que ambos servidores estén corriendo:

- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:4200

**¡Tu simulador de examen está completamente funcional!**

---

**Última actualización:** $(Get-Date -Format "yyyy-MM-dd HH:mm")
**Versión:** 1.0.0
**Autor:** Equipo de Desarrollo
