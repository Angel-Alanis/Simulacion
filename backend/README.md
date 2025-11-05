# English Exam Simulator - Backend

Backend API REST desarrollado con Node.js, Express y SQL Server para el simulador de examen de inglés.

## 🚀 Características

- **Autenticación JWT**: Sistema seguro de autenticación y autorización
- **Gestión de Exámenes**: Simuladores de práctica (20 preguntas) y finales (40 preguntas)
- **80 Preguntas**: Base de datos con 80 preguntas distribuidas en 6 niveles
- **Sistema de Niveles**: Beginner, Elementary, Pre-intermediate, Intermediate, Upper-intermediate, Advanced
- **Preguntas Aleatorias**: Cada examen tiene preguntas únicas sin repetición
- **Timer por Pregunta**: 1 minuto por pregunta, respuesta automática en timeout
- **Dashboard Estadístico**: Análisis completo de rendimiento y progreso
- **Base de Datos Normalizada**: Diseño óptimo con SQL Server

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- SQL Server 2017 o superior
- npm o yarn

## 🛠️ Instalación

### 1. Clonar el repositorio o navegar a la carpeta del backend

```bash
cd backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo `.env.example` a `.env`:

```bash
copy .env.example .env
```

Editar `.env` con tus configuraciones:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# SQL Server Configuration
DB_SERVER=localhost
DB_DATABASE=EnglishExamDB
DB_USER=sa
DB_PASSWORD=TuPasswordAqui
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true

# JWT Secret
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRES_IN=24h

# Exam Configuration
PRACTICE_QUESTIONS=20
PRACTICE_MAX_ATTEMPTS=5
FINAL_QUESTIONS=40
FINAL_MAX_ATTEMPTS=2
PASSING_SCORE=70
QUESTION_TIME_LIMIT=60
```

### 4. Crear la base de datos

Ejecutar el script SQL para crear el esquema:

```bash
# Opción 1: Desde SQL Server Management Studio
# Abrir y ejecutar: database/schema.sql

# Opción 2: Desde línea de comandos (si tienes sqlcmd)
sqlcmd -S localhost -U sa -P TuPassword -i database/schema.sql
```

### 5. Poblar la base de datos con las 80 preguntas

```bash
npm run seed
```

## 🚀 Ejecutar el Servidor

### Modo Desarrollo (con nodemon)

```bash
npm run dev
```

### Modo Producción

```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 Documentación de API

### Autenticación

#### Registro
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "estudiante1",
  "email": "estudiante@example.com",
  "password": "password123",
  "fullName": "Juan Pérez"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "username": "estudiante1",
  "password": "password123"
}
```

#### Obtener Perfil
```http
GET /api/users/profile
Authorization: Bearer {token}
```

### Exámenes

#### Iniciar Examen
```http
POST /api/exams/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "examType": "Practice"  // o "Final"
}
```

#### Enviar Respuesta
```http
POST /api/exams/answer
Authorization: Bearer {token}
Content-Type: application/json

{
  "examId": 1,
  "questionId": 15,
  "selectedAnswer": "a",  // o "b", "c", "d", "x" (timeout)
  "timeTakenSeconds": 45
}
```

#### Finalizar Examen
```http
POST /api/exams/finish
Authorization: Bearer {token}
Content-Type: application/json

{
  "examId": 1
}
```

#### Obtener Historial
```http
GET /api/exams/history
Authorization: Bearer {token}
```

### Preguntas

#### Obtener Niveles
```http
GET /api/questions/levels
Authorization: Bearer {token}
```

#### Obtener Preguntas por Nivel
```http
GET /api/questions/level/Beginner
Authorization: Bearer {token}
```

### Dashboard

#### Obtener Estadísticas
```http
GET /api/dashboard/statistics
Authorization: Bearer {token}
```

#### Obtener Progreso
```http
GET /api/dashboard/progress
Authorization: Bearer {token}
```

#### Obtener Análisis Práctica vs Final
```http
GET /api/dashboard/analysis
Authorization: Bearer {token}
```

## 📊 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de SQL Server
│   ├── controllers/
│   │   ├── user.controller.js   # Lógica de usuarios
│   │   ├── exam.controller.js   # Lógica de exámenes
│   │   ├── question.controller.js
│   │   └── dashboard.controller.js
│   ├── models/
│   │   ├── user.model.js        # Modelo de usuarios
│   │   ├── exam.model.js        # Modelo de exámenes
│   │   └── question.model.js
│   ├── routes/
│   │   ├── user.routes.js       # Rutas de usuarios
│   │   ├── exam.routes.js       # Rutas de exámenes
│   │   ├── question.routes.js
│   │   └── dashboard.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # Middleware de autenticación
│   │   └── validation.middleware.js
│   └── server.js                # Punto de entrada
├── database/
│   ├── schema.sql               # Esquema de base de datos
│   └── seed.js                  # Script para poblar datos
├── .env.example                 # Ejemplo de variables de entorno
├── .gitignore
└── package.json
```

## 🗄️ Modelo de Base de Datos

### Tablas Principales

- **Users**: Información de usuarios
- **Levels**: 6 niveles de inglés
- **Questions**: 80 preguntas con opciones y respuestas
- **ExamTypes**: Tipos de examen (Practice, Final)
- **Exams**: Registro de exámenes realizados
- **UserAnswers**: Respuestas de usuarios
- **ExamQuestions**: Preguntas asignadas a cada examen
- **UserStatistics**: Estadísticas agregadas por usuario

## 🎯 Reglas de Negocio Implementadas

1. ✅ **Simulador de Práctica**: 20 preguntas, máximo 5 intentos
2. ✅ **Simulador Final**: 40 preguntas, máximo 2 intentos
3. ✅ **80 Preguntas Totales**: Distribuidas en 6 niveles
4. ✅ **Preguntas Aleatorias**: Sin repetición en el mismo examen
5. ✅ **Timer de 1 Minuto**: Por pregunta
6. ✅ **Puntuación**: Práctica 5pts/pregunta, Final 2.5pts/pregunta
7. ✅ **Aprobación**: 70% o más
8. ✅ **Niveles**: Determinación automática según criterios
9. ✅ **Dashboard**: Estadísticas y análisis de rendimiento

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación JWT
- Validación de entrada con express-validator
- Protección contra SQL injection (mssql parameterized queries)
- Variables de entorno para datos sensibles

## 📝 Scripts Disponibles

- `npm start`: Iniciar servidor en modo producción
- `npm run dev`: Iniciar servidor con nodemon (desarrollo)
- `npm run seed`: Poblar base de datos con preguntas

## 🐛 Troubleshooting

### Error de conexión a SQL Server

1. Verificar que SQL Server esté corriendo
2. Verificar credenciales en `.env`
3. Si usas autenticación de Windows, ajustar la configuración
4. Verificar firewall y puertos

### Error al ejecutar seed

1. Asegurarte de que la base de datos exista
2. Ejecutar primero `schema.sql`
3. Verificar permisos del usuario de BD

## 👥 Autores

Proyecto desarrollado para la materia de Simulación

## 📄 Licencia

ISC
