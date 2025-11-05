# 🚀 Guía Rápida de Instalación y Ejecución

## ⚡ Instalación Rápida (15 minutos)

### Paso 1: Verificar Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

```powershell
# Verificar Node.js
node --version
# Debe mostrar v16.x.x o superior

# Verificar npm
npm --version

# Verificar Angular CLI
ng version
# Si no está instalado:
npm install -g @angular/cli

# Verificar SQL Server
# SQL Server debe estar corriendo
```

---

### Paso 2: Configurar Base de Datos

#### 2.1. Abrir SQL Server Management Studio (SSMS)

#### 2.2. Ejecutar el script de creación

1. Abrir el archivo: `backend/database/schema.sql`
2. Conectarte a tu instancia de SQL Server
3. Ejecutar el script completo (F5)
4. Verificar que se creó la base de datos `EnglishExamDB`

#### 2.3. Verificar conexión

```sql
USE EnglishExamDB;
GO

SELECT * FROM Levels;
-- Debe estar vacía por ahora
```

---

### Paso 3: Configurar Backend

```powershell
# Navegar a la carpeta del backend
cd c:\Users\alani\OneDrive\Documentos\Simulacion\Proyecto_ORDI\english-exam-simulator\backend

# Instalar dependencias
npm install

# Crear archivo .env (copiar del ejemplo)
copy .env.example .env

# IMPORTANTE: Editar .env con tus credenciales
notepad .env
```

#### Configurar `.env`:

```env
PORT=3000
NODE_ENV=development

# SQL Server Configuration - AJUSTAR ESTOS VALORES
DB_SERVER=localhost
DB_DATABASE=EnglishExamDB
DB_USER=sa
DB_PASSWORD=TU_PASSWORD_AQUI
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true

# JWT Secret - CAMBIAR EN PRODUCCIÓN
JWT_SECRET=mi_clave_secreta_super_segura_123
JWT_EXPIRES_IN=24h

# Exam Configuration
PRACTICE_QUESTIONS=20
PRACTICE_MAX_ATTEMPTS=5
FINAL_QUESTIONS=40
FINAL_MAX_ATTEMPTS=2
PASSING_SCORE=70
QUESTION_TIME_LIMIT=60
```

#### Poblar base de datos con 80 preguntas:

```powershell
npm run seed
```

Deberías ver:
```
✅ Conectado a SQL Server
🌱 Iniciando seed de la base de datos...
📊 Insertando niveles...
  ✓ Nivel Beginner insertado
  ✓ Nivel Elementary insertado
  ...
❓ Insertando 80 preguntas...
  ✓ 10 preguntas insertadas...
  ✓ 20 preguntas insertadas...
  ...
  ✓ 80 preguntas insertadas completamente
✅ Seed completado exitosamente!
```

#### Iniciar el servidor:

```powershell
npm run dev
```

Deberías ver:
```
✅ Conectado a SQL Server
🚀 Server running on port 3000
📡 API available at http://localhost:3000/api
🏥 Health check: http://localhost:3000/api/health
```

#### Probar que funciona:

Abrir en el navegador: `http://localhost:3000/api/health`

Deberías ver:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

### Paso 4: Configurar Frontend (Angular)

#### 4.1. Crear el proyecto Angular

```powershell
# Abrir una NUEVA terminal PowerShell
cd c:\Users\alani\OneDrive\Documentos\Simulacion\Proyecto_ORDI\english-exam-simulator

# Crear proyecto Angular
ng new frontend --routing --style=scss

# Cuando pregunte:
# ? Would you like to add Angular routing? --> Yes
# ? Which stylesheet format would you like to use? --> SCSS
```

#### 4.2. Instalar dependencias

```powershell
cd frontend

npm install @angular/material @angular/cdk
npm install chart.js ng2-charts
npm install jwt-decode
npm install ngx-toastr
npm install @angular/animations
```

#### 4.3. Configurar environment

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

#### 4.4. Iniciar el servidor de desarrollo

```powershell
ng serve --open
```

El navegador se abrirá automáticamente en `http://localhost:4200`

---

## 🧪 Probar la API con Postman

### 1. Crear un usuario

```http
POST http://localhost:3000/api/users/register
Content-Type: application/json

{
  "username": "estudiante1",
  "email": "estudiante@example.com",
  "password": "password123",
  "fullName": "Juan Pérez"
}
```

### 2. Login

```http
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "username": "estudiante1",
  "password": "password123"
}
```

Copiar el `token` de la respuesta.

### 3. Iniciar un examen de práctica

```http
POST http://localhost:3000/api/exams/start
Authorization: Bearer {TOKEN_AQUI}
Content-Type: application/json

{
  "examType": "Practice"
}
```

---

## 🔧 Solución de Problemas Comunes

### Error: "Login failed for user 'sa'"

**Solución:**
1. Verificar que SQL Server esté corriendo
2. Verificar usuario y contraseña en `.env`
3. Verificar que SQL Server permita autenticación mixta
4. Reiniciar SQL Server

### Error: "Cannot connect to SQL Server"

**Solución:**
```powershell
# Verificar que SQL Server está corriendo
Get-Service -Name MSSQLSERVER

# Iniciar si está detenido
Start-Service -Name MSSQLSERVER
```

### Error: "Port 3000 is already in use"

**Solución:**
```powershell
# Encontrar proceso en puerto 3000
netstat -ano | findstr :3000

# Matar proceso (reemplazar PID)
taskkill /PID <PID> /F

# O cambiar puerto en .env
PORT=3001
```

### Error: "ng: command not found"

**Solución:**
```powershell
# Instalar Angular CLI globalmente
npm install -g @angular/cli

# Reiniciar PowerShell
```

### Error al hacer seed: "Cannot insert duplicate key"

**Solución:**
```sql
-- Limpiar base de datos y volver a ejecutar seed
USE EnglishExamDB;
GO

DELETE FROM UserAnswers;
DELETE FROM ExamQuestions;
DELETE FROM Exams;
DELETE FROM Questions;
DELETE FROM ExamTypes;
DELETE FROM Levels;
GO
```

Luego ejecutar `npm run seed` nuevamente.

---

## 📝 Checklist de Instalación

- [ ] Node.js instalado (v16+)
- [ ] Angular CLI instalado
- [ ] SQL Server corriendo
- [ ] Base de datos creada (`schema.sql`)
- [ ] Backend: dependencias instaladas
- [ ] Backend: `.env` configurado
- [ ] Backend: seed ejecutado (80 preguntas)
- [ ] Backend: servidor corriendo en puerto 3000
- [ ] Frontend: proyecto Angular creado
- [ ] Frontend: dependencias instaladas
- [ ] Frontend: servidor corriendo en puerto 4200
- [ ] Postman: API probada

---

## 🎯 Próximos Pasos

Una vez que todo esté instalado y corriendo:

1. **Desarrollar Frontend:**
   - Ver `FRONTEND_SETUP.md` para comandos de generación
   - Crear componentes, servicios y guards
   - Implementar la UI

2. **Integrar:**
   - Conectar frontend con backend
   - Probar flujos completos
   - Corregir bugs

3. **Dashboard:**
   - Implementar gráficas con Chart.js
   - Crear análisis de estadísticas
   - Mostrar progreso del usuario

4. **Testing:**
   - Escribir tests unitarios
   - Hacer tests de integración
   - Probar casos límite

5. **Documentación:**
   - Completar manual de usuario
   - Crear video de demostración
   - Preparar presentación

---

## 📞 Ayuda Adicional

### Logs del Backend

Los logs se muestran en la terminal donde ejecutaste `npm run dev`

### Logs del Frontend

Los logs se muestran en la consola del navegador (F12)

### Base de Datos

Usa SQL Server Management Studio para:
- Ver tablas y datos
- Ejecutar queries de debug
- Verificar índices y constraints

---

## 🎉 ¡Listo!

Si llegaste hasta aquí, tu entorno de desarrollo está completamente configurado.

**Backend corriendo:** ✅ `http://localhost:3000`  
**Frontend corriendo:** ✅ `http://localhost:4200`  
**Base de datos poblada:** ✅ 80 preguntas

¡Ahora puedes comenzar a desarrollar! 🚀

---

**Última actualización:** 31 de Octubre, 2025
