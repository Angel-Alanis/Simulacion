# English Exam Simulator

Sistema de evaluación de nivel de inglés con exámenes de práctica y finales.

## Descripción

Aplicación web para realizar exámenes de inglés:
- Exámenes de práctica: 20 preguntas, 5 intentos
- Exámenes finales: 40 preguntas, 2 intentos
- 6 niveles: Beginner, Elementary, Pre-intermediate, Intermediate, Upper-intermediate, Advanced
- Estadísticas y dashboard con gráficas
- Timer de 1 minuto por pregunta

## Tecnologías

**Backend:** Node.js, Express, SQL Server, JWT  
**Frontend:** Angular, Angular Material, Chart.js  
**Base de Datos:** SQL Server con 8 tablas normalizadas

## Instalación

**Requisitos:** Node.js 16+, SQL Server 2017+, Angular CLI

### Backend
```powershell
cd backend
npm install
# Configurar .env con credenciales de SQL Server
# Ejecutar database/schema.sql en SQL Server
npm run seed
npm run dev
```

### Frontend
```powershell
cd frontend
npm install
ng serve
```

Acceso: Frontend en `http://localhost:4200`, Backend en `http://localhost:3000`

## Base de Datos

8 tablas: Levels, Questions, Users, ExamTypes, Exams, UserAnswers, ExamQuestions, UserStatistics  
80 preguntas distribuidas en 6 niveles

## Funcionalidades

- Registro y login con JWT
- Exámenes de práctica y finales con preguntas aleatorias
- Timer de 1 minuto por pregunta
- Dashboard con estadísticas y gráficas
- Historial de exámenes
- Cálculo automático de nivel alcanzado

## API Endpoints

**Auth:** `/api/users/register`, `/api/users/login`, `/api/users/profile`  
**Exams:** `/api/exams/start`, `/api/exams/answer`, `/api/exams/finish`, `/api/exams/history`  
**Questions:** `/api/questions/levels`, `/api/questions/level/:levelName`  
**Dashboard:** `/api/dashboard/statistics`, `/api/dashboard/progress`, `/api/dashboard/analysis`

## Configuración

Crear archivo `.env` en backend con:
```
PORT=3000
DB_SERVER=localhost
DB_DATABASE=EnglishExamDB
DB_USER=sa
DB_PASSWORD=tu_password
JWT_SECRET=tu_secret
```
