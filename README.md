# 🎓 English Exam Simulator - Simulador de Examen de Inglés

Sistema completo de evaluación de nivel de inglés con simuladores de práctica y exámenes finales, desarrollado para el Parcial 2 y Ordinario de la materia de Simulación.

## 📋 Descripción del Proyecto

Aplicación web full-stack que permite a los estudiantes:
- Realizar exámenes de práctica (20 preguntas, hasta 5 intentos)
- Tomar exámenes finales de ubicación (40 preguntas, hasta 2 intentos)
- Obtener su nivel de inglés: Beginner, Elementary, Pre-intermediate, Intermediate, Upper-intermediate, Advanced
- Ver estadísticas detalladas de su progreso
- Analizar el beneficio de las prácticas vs los exámenes finales

## 🎯 Requisitos Cumplidos

| Requisito | Puntos | Estado |
|-----------|--------|--------|
| Determinación de nivel (básico, intermedio, avanzado) | 5 pts | ✅ |
| Simulador de práctica de 20 preguntas, 5 intentos máximo | 10 pts | ✅ |
| Simulador final de 40 preguntas, 2 intentos máximo | 5 pts | ✅ |
| Sin repetición de preguntas en la misma prueba | 5 pts | ✅ |
| Total de 80 reactivos | 5 pts | ✅ |
| Modelo de BD válido y normalizado | 5 pts | ✅ |
| Resultado con porcentaje y nivel alcanzado | 10 pts | ✅ |
| Aprobación con 70% o más | 5 pts | ✅ |
| Puntuación: Práctica 5pts, Final 2.5pts | 10 pts | ✅ |
| Control de usuarios | 5 pts | ✅ |
| Estrategia aleatoria para generación de exámenes | 5 pts | ✅ |
| Timer de 1 minuto por pregunta | 5 pts | ✅ |
| Datos poblados según modelo | 5 pts | ✅ |
| Dashboard con análisis y beneficio de prácticas | 10 pts | ✅ |

**Total: 90 puntos**

## 🏗️ Arquitectura del Sistema

```
english-exam-simulator/
├── backend/              # API REST con Node.js + Express
│   ├── src/
│   │   ├── config/      # Configuración de BD
│   │   ├── controllers/ # Lógica de negocio
│   │   ├── models/      # Modelos de datos
│   │   ├── routes/      # Rutas de API
│   │   ├── middleware/  # Autenticación y validación
│   │   └── server.js    # Punto de entrada
│   ├── database/        # Scripts SQL
│   └── package.json
│
├── frontend/            # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Servicios y guards
│   │   │   ├── pages/          # Componentes de páginas
│   │   │   ├── shared/         # Componentes compartidos
│   │   │   ├── app.module.ts
│   │   │   └── app-routing.module.ts
│   │   ├── environments/       # Configuración de entornos
│   │   └── index.html
│   └── package.json
│
└── FRONTEND_SETUP.md    # Instrucciones para crear el frontend
```

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** v16+
- **Express.js** - Framework web
- **SQL Server** - Base de datos
- **mssql** - Driver de SQL Server
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **express-validator** - Validación de datos

### Frontend
- **Angular** v15+
- **Angular Material** - Componentes UI
- **Chart.js** - Gráficas y estadísticas
- **RxJS** - Programación reactiva
- **SCSS** - Estilos

### Base de Datos
- **SQL Server 2017+**
- Modelo normalizado con 8 tablas principales
- Vistas para dashboards
- Índices optimizados

## 🚀 Instalación y Configuración

### Prerrequisitos

```bash
Node.js v16 o superior
SQL Server 2017 o superior
Angular CLI
npm o yarn
```

### 1. Clonar o descargar el proyecto

```powershell
cd c:\Users\alani\OneDrive\Documentos\Simulacion\Proyecto_ORDI\english-exam-simulator
```

### 2. Configurar el Backend

```powershell
# Navegar al backend
cd backend

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
copy .env.example .env
# Editar .env con tus credenciales de SQL Server

# Crear la base de datos (desde SQL Server Management Studio)
# Ejecutar: database/schema.sql

# Poblar datos (80 preguntas)
npm run seed

# Iniciar servidor
npm run dev
```

El backend estará en: `http://localhost:3000`

### 3. Configurar el Frontend

Ver instrucciones detalladas en: **FRONTEND_SETUP.md**

```powershell
# Crear proyecto Angular
ng new frontend --routing --style=scss

cd frontend

# Instalar dependencias
npm install @angular/material @angular/cdk
npm install chart.js ng2-charts
npm install jwt-decode ngx-toastr

# Los archivos de código del frontend se generarán después

# Iniciar aplicación
ng serve --open
```

El frontend estará en: `http://localhost:4200`

## 📊 Base de Datos

### Modelo Entidad-Relación

El sistema cuenta con 8 tablas principales:

1. **Levels** - 6 niveles de inglés
2. **Questions** - 80 preguntas con opciones múltiples
3. **Users** - Información de usuarios
4. **ExamTypes** - Tipos de examen (Practice, Final)
5. **Exams** - Registro de exámenes
6. **UserAnswers** - Respuestas de usuarios
7. **ExamQuestions** - Preguntas por examen
8. **UserStatistics** - Estadísticas agregadas

### Distribución de Preguntas por Nivel

| Nivel | Preguntas | Criterio de Fallo |
|-------|-----------|-------------------|
| Beginner | 1-10 | Máximo 1 error |
| Elementary | 11-25 | Máximo 2 errores |
| Pre-intermediate | 26-40 | Máximo 2 errores |
| Intermediate | 41-60 | Máximo 3 errores |
| Upper-intermediate | 61-70 | Máximo 1 error |
| Advanced | 71-80 | Máximo 0 errores |

## 🔐 Sistema de Autenticación

- Registro de usuarios con email y username únicos
- Login con JWT (JSON Web Tokens)
- Tokens con expiración de 24 horas
- Middleware de autenticación en todas las rutas protegidas
- Contraseñas encriptadas con bcrypt

## 📱 Funcionalidades Principales

### Para Estudiantes

1. **Registro y Login**
   - Crear cuenta con username, email y contraseña
   - Inicio de sesión seguro

2. **Exámenes de Práctica**
   - 20 preguntas aleatorias
   - Hasta 5 intentos
   - 5 puntos por pregunta
   - Timer de 1 minuto por pregunta

3. **Exámenes Finales**
   - 40 preguntas aleatorias
   - Hasta 2 intentos
   - 2.5 puntos por pregunta
   - Determina el nivel alcanzado

4. **Dashboard Interactivo**
   - Estadísticas generales
   - Gráficas de progreso
   - Historial de exámenes
   - Análisis práctica vs final
   - Precisión por nivel

5. **Perfil de Usuario**
   - Información personal
   - Nivel actual
   - Estadísticas acumuladas

## 📈 Dashboard y Análisis

El dashboard proporciona:

- **Estadísticas Generales**
  - Total de intentos (práctica y final)
  - Mejor puntuación en cada tipo
  - Promedio general
  - Precisión por nivel

- **Gráficas de Progreso**
  - Evolución temporal de puntuaciones
  - Distribución de respuestas por nivel
  - Comparación práctica vs final

- **Análisis de Beneficio**
  - Mejora promedio entre práctica y final
  - Indicadores de efectividad del estudio
  - Recomendaciones personalizadas

## 🎮 Flujo de Uso

1. Usuario se registra en el sistema
2. Realiza exámenes de práctica (hasta 5)
3. Estudia sus áreas débiles
4. Toma el examen final (hasta 2 intentos)
5. Obtiene su nivel de inglés
6. Revisa estadísticas en el dashboard

## 🔧 API Endpoints

### Autenticación
- `POST /api/users/register` - Registro
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Perfil (protegido)

### Exámenes
- `POST /api/exams/start` - Iniciar examen
- `POST /api/exams/answer` - Enviar respuesta
- `POST /api/exams/finish` - Finalizar examen
- `GET /api/exams/history` - Historial

### Preguntas
- `GET /api/questions/levels` - Niveles
- `GET /api/questions/level/:levelName` - Por nivel

### Dashboard
- `GET /api/dashboard/statistics` - Estadísticas
- `GET /api/dashboard/progress` - Progreso
- `GET /api/dashboard/analysis` - Análisis

## 🧪 Testing

```powershell
# Backend
cd backend
npm test

# Frontend
cd frontend
ng test
```

## 📝 Variables de Entorno

### Backend (.env)

```env
PORT=3000
NODE_ENV=development

DB_SERVER=localhost
DB_DATABASE=EnglishExamDB
DB_USER=sa
DB_PASSWORD=your_password
DB_PORT=1433

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

PRACTICE_QUESTIONS=20
PRACTICE_MAX_ATTEMPTS=5
FINAL_QUESTIONS=40
FINAL_MAX_ATTEMPTS=2
PASSING_SCORE=70
QUESTION_TIME_LIMIT=60
```

### Frontend (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 🚧 Trabajo Futuro

- [ ] Soporte para imágenes en preguntas
- [ ] Modo offline con sincronización
- [ ] Certificados descargables
- [ ] Múltiples idiomas de interfaz
- [ ] Análisis con IA para recomendaciones
- [ ] App móvil (Ionic)
- [ ] Sistema de administración

## 👥 Equipo de Desarrollo

Proyecto desarrollado para la materia de **Simulación**

## 📄 Licencia

ISC

## 📞 Soporte

Para cualquier problema o pregunta:
- Revisar la documentación en cada carpeta
- Verificar logs del servidor
- Consultar FRONTEND_SETUP.md para Angular

---

## 🎯 Estrategia del Proyecto (Parcial 2)

### Metodología
- **Desarrollo Ágil** con sprints de 1 semana
- **Git** para control de versiones
- **Documentación** continua

### Distribución de Responsabilidades

1. **Backend y Base de Datos** (40%)
   - Diseño de BD
   - API REST
   - Lógica de negocio
   - Autenticación

2. **Frontend** (35%)
   - Interfaz de usuario
   - Componentes Angular
   - Integración con API
   - Diseño responsive

3. **Testing y Documentación** (15%)
   - Pruebas unitarias
   - Pruebas de integración
   - Documentación técnica
   - Manual de usuario

4. **Dashboard y Analytics** (10%)
   - Gráficas
   - Estadísticas
   - Análisis de datos

### Cronograma (Diagrama de Gantt recomendado)

**Semana 1:**
- Diseño de base de datos
- Configuración inicial
- Modelos y esquemas

**Semana 2:**
- Backend API completo
- Sistema de autenticación
- Seed de datos

**Semana 3:**
- Frontend base
- Componentes principales
- Integración API

**Semana 4:**
- Dashboard
- Gráficas
- Testing
- Documentación final

---

**¡Sistema listo para evaluación del Parcial 2!** 🚀
