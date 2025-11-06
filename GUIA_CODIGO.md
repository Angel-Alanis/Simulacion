# Guía del Código - English Exam Simulator

## Estructura General del Proyecto

```
english-exam-simulator/
├── backend/           # API en Node.js + Express
├── frontend/          # Aplicación Angular
└── scripts de inicio  # INICIAR-PROYECTO.ps1
```

---

## 📁 BACKEND (Node.js + Express + SQL Server)

### Ubicación: `backend/`

### 1. **Punto de Entrada**
**Archivo:** `backend/src/server.js`
- **Líneas 1-6:** Importación de dependencias (express, cors, dotenv)
- **Línea 10-13:** Configuración de middlewares (CORS, JSON parser)
- **Línea 15-20:** Importación de rutas
- **Línea 22-25:** Registro de rutas en Express
- **Línea 27-30:** Endpoint de health check
- **Línea 32-38:** Middleware de manejo de errores
- **Línea 44-58:** Función que inicia el servidor y conecta a BD

### 2. **Configuración de Base de Datos**
**Archivo:** `backend/src/config/database.js`
- **Líneas 4-27:** Configuración de conexión a SQL Server
  - Lee variables de `.env`
  - Configura autenticación (Windows o SQL Server)
- **Línea 26-46:** Lógica de autenticación
- **Línea 50-61:** Función `getConnection()` - Obtiene pool de conexiones
- **Línea 63-73:** Función `closeConnection()` - Cierra conexión

### 3. **Modelos (Acceso a Datos)**

#### `backend/src/models/user.model.js`
- **Línea 5-26:** `create()` - Crea usuario con contraseña encriptada
- **Línea 28-40:** `findByUsername()` - Busca usuario por nombre
- **Línea 42-54:** `findByEmail()` - Busca usuario por email
- **Línea 56-73:** `findById()` - Busca usuario por ID
- **Línea 75-92:** `updateLevel()` - Actualiza nivel del usuario
- **Línea 94-97:** `verifyPassword()` - Compara contraseñas con bcrypt
- **Línea 99-125:** `getOrCreateStats()` - Obtiene/crea estadísticas

#### `backend/src/models/exam.model.js`
- **Línea 4-22:** `create()` - Crea nuevo examen
- **Línea 24-45:** `assignRandomQuestions()` - Asigna preguntas aleatorias
  - **IMPORTANTE:** Línea 30-36 usa `ORDER BY NEWID()` para aleatorizar
- **Línea 47-76:** `getExamQuestions()` - Obtiene preguntas del examen
- **Línea 78-109:** `saveAnswer()` - Guarda respuesta y verifica si es correcta
- **Línea 111-156:** `finalize()` - Calcula resultados y determina nivel
  - **Línea 133-143:** Determina nivel por porcentaje (AQUÍ ES EL CÁLCULO)
  - Básico: 0-69%, Intermedio: 70-84%, Avanzado: 85-100%
- **Línea 189-227:** `updateUserStatistics()` - Actualiza estadísticas del usuario

#### `backend/src/models/question.model.js`
- **Línea 4-26:** `getAll()` - Obtiene todas las preguntas
- **Línea 28-49:** `getByLevel()` - Filtra preguntas por nivel
- **Línea 51-71:** `findById()` - Busca pregunta específica
- **Línea 73-93:** `getAllLevels()` - Obtiene los 3 niveles

### 4. **Controladores (Lógica de Negocio)**

#### `backend/src/controllers/user.controller.js`
- **Línea 5-67:** `register()` - Registro de usuarios
  - Línea 10-18: Valida username único
  - Línea 20-28: Valida email único
  - Línea 30-35: Crea usuario en BD
  - Línea 37: Crea estadísticas iniciales
  - Línea 39-44: Genera token JWT
- **Línea 69-129:** `login()` - Inicio de sesión
  - Línea 76-79: Busca por username o email
  - Línea 91-97: Valida contraseña
  - Línea 100-105: Genera token JWT
- **Línea 131-163:** `getProfile()` - Obtiene perfil del usuario

#### `backend/src/controllers/exam.controller.js`
- **Línea 5-78:** `startExam()` - Inicia nuevo examen
  - Línea 11-19: Valida tipo de examen
  - Línea 20-28: Verifica intentos disponibles (5 práctica, 2 final)
  - Línea 29-35: Crea registro del examen
  - Línea 36-38: Asigna preguntas aleatorias
  - Línea 40-64: Obtiene preguntas SIN respuestas correctas
- **Línea 82-126:** `submitAnswer()` - Guarda respuesta
  - Línea 88-102: Valida que el examen es del usuario
  - Línea 104-110: Registra respuesta en BD
- **Línea 130-186:** `finishExam()` - Finaliza examen
  - Línea 136-150: Valida examen
  - Línea 152-184: Calcula puntaje y nivel alcanzado
- **Línea 188-207:** `getHistory()` - Historial de exámenes
- **Línea 209-237:** `getExamDetails()` - Detalles de un examen

#### `backend/src/controllers/question.controller.js`
- **Línea 4-21:** `getAll()` - Lista todas las preguntas
- **Línea 23-42:** `getByLevel()` - Filtra por nivel
- **Línea 44-62:** `getAllLevels()` - Obtiene los 3 niveles
- **Línea 63-88:** `getById()` - Busca pregunta específica

#### `backend/src/controllers/dashboard.controller.js`
- **Línea 4-120:** `getStatistics()` - Métricas del dashboard
  - Línea 10-13: Estadísticas generales del usuario
  - Línea 15-29: Comparación práctica vs final
  - Línea 31-47: Rendimiento por nivel
  - Línea 49-70: Comparación de primeros intentos
  - Línea 72-89: Últimos 10 exámenes
  - Línea 91-97: Tiempo promedio por pregunta
- **Línea 122-176:** `getProgressCharts()` - Datos para gráficas
- **Línea 178-246:** `getPracticeVsFinalAnalysis()` - Análisis de beneficio

### 5. **Rutas (Endpoints de la API)**

#### `backend/src/routes/user.routes.js`
- **Línea 7:** POST `/register` - Registro
- **Línea 8:** POST `/login` - Login
- **Línea 11:** GET `/profile` - Perfil (protegido con auth)

#### `backend/src/routes/exam.routes.js`
- **Línea 14:** POST `/start` - Iniciar examen
- **Línea 17:** POST `/answer` - Enviar respuesta
- **Línea 20:** POST `/finish` - Finalizar examen
- **Línea 23:** GET `/history` - Historial
- **Línea 26:** GET `/:examId` - Detalles de examen

#### `backend/src/routes/question.routes.js`
- **Línea 9:** GET `/levels` - Obtener niveles
- **Línea 12:** GET `/level/:levelName` - Por nivel
- **Línea 15:** GET `/:questionId` - Pregunta específica
- **Línea 18:** GET `/` - Todas las preguntas

#### `backend/src/routes/dashboard.routes.js`
- **Línea 9:** GET `/statistics` - Estadísticas
- **Línea 12:** GET `/progress` - Gráficas de progreso
- **Línea 15:** GET `/analysis` - Análisis práctica vs final

### 6. **Middleware**

#### `backend/src/middleware/auth.middleware.js`
- **Línea 3-46:** Función que valida token JWT
  - Línea 5-13: Extrae token del header Authorization
  - Línea 17-20: Verifica token con JWT
  - Línea 20: Guarda datos del usuario en `req.user`

### 7. **Base de Datos**

#### `backend/database/schema.sql`
**Tablas creadas:**
- **Línea 14-21:** `Levels` - 3 niveles con rangos de porcentaje
- **Línea 24-41:** `Questions` - 80 preguntas
- **Línea 44-53:** `Users` - Información de usuarios
- **Línea 56-64:** `ExamTypes` - Tipos de examen (Practice, Final)
- **Línea 67-81:** `Exams` - Registro de exámenes realizados
- **Línea 84-95:** `UserAnswers` - Respuestas de usuarios
- **Línea 98-108:** `ExamQuestions` - Preguntas por examen
- **Línea 111-125:** `UserStatistics` - Estadísticas agregadas
- **Línea 128-136:** Índices para rendimiento
- **Línea 139-160:** Vista `vw_DashboardStats`

#### `backend/database/seed.js`
- **Línea 4-10:** Define los 3 niveles con rangos de porcentaje
- **Línea 13-30:** Define tipos de examen (práctica y final)
- **Línea 33-600:** 80 preguntas distribuidas:
  - Básico: preguntas 1-30
  - Intermedio: preguntas 31-60
  - Avanzado: preguntas 61-80
- **Línea 615-628:** Inserta niveles en BD
- **Línea 631-650:** Inserta tipos de examen
- **Línea 653-684:** Inserta preguntas

---

## 📁 FRONTEND (Angular)

### Ubicación: `frontend/src/app/`

### 1. **Configuración Principal**

#### `frontend/src/app/app.module.ts`
- **Línea 1-20:** Importación de módulos de Angular
- **Línea 24-38:** Declaración de componentes
- **Línea 39-55:** Importación de módulos (Material, Charts, etc)
- **Línea 56-61:** Configuración de HTTP interceptors y providers

#### `frontend/src/app/app-routing.module.ts`
- **Línea 8-10:** Ruta `/login` → LoginComponent
- **Línea 11-13:** Ruta `/register` → RegisterComponent
- **Línea 14-19:** Ruta `/dashboard` → DashboardComponent (protegida)
- **Línea 20-25:** Ruta `/exam-selection` → ExamSelectionComponent (protegida)
- **Línea 26-31:** Ruta `/exam/:examId` → ExamComponent (protegida)
- **Línea 32-37:** Ruta `/result/:examId` → ResultComponent (protegida)
- **Línea 38-43:** Ruta `/history` → HistoryComponent (protegida)
- **Línea 44-49:** Ruta `/profile` → ProfileComponent (protegida)

### 2. **Core (Servicios y Seguridad)**

#### `frontend/src/app/core/services/auth.service.ts`
- **Línea 12-24:** Constructor e inicialización
- **Línea 26-29:** Getter del usuario actual
- **Línea 31-34:** Getter del token
- **Línea 36-45:** `login()` - Inicia sesión y guarda token
- **Línea 47-56:** `register()` - Registra usuario y guarda token
- **Línea 58-62:** `logout()` - Cierra sesión y limpia token
- **Línea 64-73:** `isAuthenticated()` - Verifica si token es válido
- **Línea 75-77:** `getUserProfile()` - Obtiene perfil del servidor
- **Línea 79-102:** `getUserFromToken()` - Decodifica token JWT

#### `frontend/src/app/core/services/exam.service.ts`
- **Línea 12-18:** `startExam()` - Inicia nuevo examen
- **Línea 20-26:** `submitAnswer()` - Envía respuesta al servidor
- **Línea 28-34:** `finishExam()` - Finaliza examen
- **Línea 36-40:** `getExamHistory()` - Obtiene historial
- **Línea 42-46:** `getExamDetails()` - Detalles de un examen

#### `frontend/src/app/core/services/question.service.ts`
- **Línea 12-16:** `getAllLevels()` - Obtiene los 3 niveles
- **Línea 18-22:** `getQuestionsByLevel()` - Preguntas por nivel

#### `frontend/src/app/core/services/dashboard.service.ts`
- **Línea 12-16:** `getStatistics()` - Estadísticas generales
- **Línea 18-22:** `getProgressCharts()` - Datos para gráficas
- **Línea 24-28:** `getPracticeVsFinalAnalysis()` - Análisis

#### `frontend/src/app/core/guards/auth.guard.ts`
- **Línea 14-22:** `canActivate()` - Protege rutas, redirige a login si no autenticado

#### `frontend/src/app/core/interceptors/auth.interceptor.ts`
- **Línea 19-40:** Intercepta requests HTTP
  - Línea 21-28: Añade token JWT en header Authorization
  - Línea 30-36: Maneja errores 401 (cierra sesión automáticamente)

### 3. **Páginas (Componentes)**

#### `frontend/src/app/pages/login/login.component.ts`
- **Línea 23-29:** Constructor - Redirige si ya está autenticado
- **Línea 31-38:** `ngOnInit()` - Inicializa formulario
- **Línea 40-43:** Getter de controles del formulario
- **Línea 45-60:** `onSubmit()` - Procesa login y redirige

#### `frontend/src/app/pages/dashboard/dashboard.component.ts`
- **Línea 17-26:** Variables para estadísticas y gráficas
- **Línea 58-63:** `ngOnInit()` - Carga datos al iniciar
- **Línea 65-104:** `loadDashboardData()` - Carga estadísticas
  - Línea 71-73: Mapea datos de historial
  - Línea 76-87: Calcula métricas (total exámenes, promedio, mejor score)
- **Línea 106-156:** `loadCharts()` - Carga datos para gráficas Chart.js

#### `frontend/src/app/pages/exam/exam.component.ts`
**Este es EL MÁS IMPORTANTE - Aquí está toda la lógica del examen**
- **Línea 1-27:** Interfaces de datos (Question, ExamSession)
- **Línea 38-60:** Variables del componente (session, timer, preguntas)
- **Línea 62-73:** Constructor
- **Línea 75-91:** `ngOnInit()` - Inicia examen al cargar
  - Línea 84-87: Carga examen desde servidor
  - Línea 88-91: Inicia timer automáticamente
- **Línea 93-107:** `loadExam()` - Carga datos del examen
- **Línea 109-125:** `startTimer()` - TIMER DE 1 MINUTO
  - Línea 111: Inicializa en 60 segundos
  - Línea 113-124: Intervalo que decrementa cada segundo
  - Línea 118-121: Cuando llega a 0, auto-avanza
- **Línea 127-139:** `selectAnswer()` - Guarda respuesta seleccionada
- **Línea 141-189:** `nextQuestion()` - Avanza a siguiente pregunta
  - Línea 154-159: Envía respuesta al backend
  - Línea 161-165: Si es última pregunta, finaliza examen
  - Línea 167-171: Si no, avanza y reinicia timer
- **Línea 191-207:** `previousQuestion()` - Retrocede pregunta
- **Línea 209-243:** `finishExam()` - Termina examen
  - Línea 215-227: Envía solicitud de finalización
  - Línea 228: Redirige a resultados
- **Línea 245-248:** `getCurrentQuestion()` - Obtiene pregunta actual
- **Línea 250-262:** `getOptionsArray()` - Convierte opciones a array
- **Línea 264-269:** Funciones de UI (progreso, formato tiempo, warnings)

#### `frontend/src/app/pages/result/result.component.ts`
- **Línea 22-28:** `ngOnInit()` - Obtiene ID del examen y carga resultados
- **Línea 30-65:** `loadExamResults()` - Carga y muestra resultados
  - Línea 39-51: Obtiene detalles del examen
  - Línea 53-63: Determina si aprobó (≥70%)

### 4. **Modelos (Interfaces TypeScript)**

#### `frontend/src/app/core/models/index.ts`
- **Línea 1-7:** `User` - Datos del usuario
- **Línea 9-17:** `LoginRequest` y `RegisterRequest` - DTOs de autenticación
- **Línea 19-26:** `AuthResponse` - Respuesta de login/register
- **Línea 28-34:** `ApiResponse<T>` - Respuesta genérica de API
- **Línea 36-56:** `DashboardStats` - Estadísticas del dashboard
- **Línea 58-68:** `ExamHistory` - Datos de historial
- **Línea 70-84:** `Level` - Nivel de inglés

### 5. **Módulos de Angular** (Son carpetas con archivos .module.ts)

Los siguientes son **módulos de Angular** (no confundir con carpetas normales):
- `frontend/src/app/pages/login/login.module.ts` - Módulo de Login
- `frontend/src/app/pages/register/register.module.ts` - Módulo de Registro
- `frontend/src/app/pages/dashboard/dashboard.module.ts` - Módulo de Dashboard
- `frontend/src/app/pages/exam/exam.module.ts` - Módulo de Examen
- `frontend/src/app/pages/result/result.module.ts` - Módulo de Resultados
- `frontend/src/app/pages/history/history.module.ts` - Módulo de Historial
- `frontend/src/app/pages/profile/profile.module.ts` - Módulo de Perfil

Cada módulo importa sus componentes, servicios y dependencias necesarias.

---

## 🔑 Puntos Clave para Explicar

### 1. **¿Dónde está el timer de 1 minuto?**
- **Archivo:** `frontend/src/app/pages/exam/exam.component.ts`
- **Líneas 109-125:** Función `startTimer()`
- Se inicializa en 60 segundos y decrementa cada segundo
- Al llegar a 0, llama a `nextQuestion()` automáticamente

### 2. **¿Dónde se determina el nivel alcanzado?**
- **Archivo:** `backend/src/models/exam.model.js`
- **Líneas 133-143:** Consulta SQL que busca nivel por porcentaje
- Básico: 0-69%, Intermedio: 70-84%, Avanzado: 85-100%

### 3. **¿Dónde se valida que no se repitan preguntas?**
- **Archivo:** `backend/src/models/exam.model.js`
- **Líneas 30-36:** Usa `ORDER BY NEWID()` para aleatorizar
- La tabla `ExamQuestions` tiene constraint único `(exam_id, question_id)`

### 4. **¿Dónde están los puntajes (5pts práctica, 2.5pts final)?**
- **Archivo:** `backend/database/seed.js`
- **Línea 16:** `pointsPerQuestion: 5.0` para práctica
- **Línea 25:** `pointsPerQuestion: 2.5` para final

### 5. **¿Dónde se calcula el porcentaje de aprobación?**
- **Archivo:** `backend/src/models/exam.model.js`
- **Líneas 125-129:** Calcula porcentaje y determina si pasó (≥70%)

### 6. **¿Dónde se limitan los intentos?**
- **Archivo:** `backend/src/controllers/exam.controller.js`
- **Líneas 20-28:** Verifica intentos antes de crear examen
- Práctica: máximo 5, Final: máximo 2

### 7. **¿Dónde está la autenticación JWT?**
- **Generación:** `backend/src/controllers/user.controller.js` líneas 39-44 y 100-105
- **Validación:** `backend/src/middleware/auth.middleware.js` línea 17-20
- **Interceptor:** `frontend/src/app/core/interceptors/auth.interceptor.ts` línea 21-28

### 8. **¿Dónde están las 80 preguntas?**
- **Archivo:** `backend/database/seed.js`
- **Líneas 33-600:** Todas las preguntas
- Distribuidas: Básico (1-30), Intermedio (31-60), Avanzado (61-80)

### 9. **¿Dónde está el dashboard con análisis?**
- **Backend:** `backend/src/controllers/dashboard.controller.js`
- **Frontend:** `frontend/src/app/pages/dashboard/dashboard.component.ts`
- **Gráficas:** Se usa Chart.js (ng2-charts) en líneas 106-156

---

## 📦 Dependencias Importantes

### Backend (package.json)
- `express` - Framework web
- `mssql` - Driver de SQL Server
- `bcryptjs` - Encriptación de contraseñas
- `jsonwebtoken` - Autenticación JWT
- `cors` - Permisos de origen cruzado
- `dotenv` - Variables de entorno

### Frontend (package.json)
- `@angular/core` - Framework Angular
- `@angular/material` - Componentes UI
- `chart.js` y `ng2-charts` - Gráficas
- `jwt-decode` - Decodificar tokens JWT
- `ngx-toastr` - Notificaciones

---

## 🎯 Flujo Completo de un Examen

1. Usuario hace login → `auth.service.ts` → guarda token
2. Va a exam-selection → selecciona tipo de examen
3. Click en "Iniciar" → `exam.service.ts` → POST `/api/exams/start`
4. Backend (`exam.controller.js`) crea examen y asigna preguntas aleatorias
5. Frontend carga preguntas → `exam.component.ts` inicia timer
6. Usuario responde → `nextQuestion()` → POST `/api/exams/answer`
7. Backend guarda respuesta y verifica si es correcta
8. Al terminar → `finishExam()` → POST `/api/exams/finish`
9. Backend calcula puntaje y determina nivel
10. Redirige a resultados → `result.component.ts` muestra resultados

---

Esta guía te permite navegar rápidamente a cualquier parte del código cuando te pregunten algo específico.
