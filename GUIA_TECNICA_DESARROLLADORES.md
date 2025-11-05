# 🔧 GUÍA TÉCNICA RÁPIDA - Desarrolladores

## Stack Tecnológico

### Backend
- **Runtime:** Node.js v16+
- **Framework:** Express.js 4.18.2
- **Database:** SQL Server 2017+ (mssql driver 10.0.1)
- **Auth:** JWT (jsonwebtoken 9.0.2) + bcryptjs 2.4.3
- **Validation:** express-validator 7.0.1
- **CORS:** Habilitado para http://localhost:4200

### Frontend
- **Framework:** Angular 17.0.0
- **UI Library:** Angular Material 17.0.0 (indigo-pink theme)
- **Charts:** Chart.js 4.4.0 + ng2-charts 5.0.0
- **HTTP:** RxJS 7.8.0 + HttpClient
- **Toast:** ngx-toastr 18.0.0
- **JWT:** jwt-decode 4.0.0

---

## Arquitectura

```
┌──────────────┐      HTTP/REST      ┌──────────────┐
│   Angular    │ ◄─────────────────► │  Express.js  │
│  (Port 4200) │    JSON + JWT       │  (Port 3000) │
└──────────────┘                     └───────┬──────┘
                                             │
                                             │ mssql
                                             ▼
                                     ┌──────────────┐
                                     │  SQL Server  │
                                     │ EnglishExamDB│
                                     └──────────────┘
```

---

## Flujo de Autenticación

```typescript
// Frontend: Login
AuthService.login(email, password)
  → POST /api/users/login
  → Backend valida credenciales
  → Genera JWT (exp: 24h)
  → Frontend guarda en localStorage
  → BehaviorSubject emite nuevo User

// Requests subsecuentes
AuthInterceptor
  → Intercepta todas las requests HTTP
  → Agrega header: Authorization: Bearer <token>
  → Backend valida JWT en authMiddleware
  → Si válido: procesa request
  → Si inválido: 401 Unauthorized
```

---

## Modelos de Datos (TypeScript)

```typescript
// User
interface User {
  id: number;
  name: string;
  email: string;
  currentLevel: string;  // Beginner, Elementary, etc.
  createdAt: Date;
}

// Exam Session
interface ExamSession {
  examId: number;
  examType: 'practice' | 'final';
  status: 'in-progress' | 'completed';
  questions: Question[];
  startTime: Date;
  endTime?: Date;
  score?: number;
}

// Question
interface Question {
  id: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  level: number;
}
```

---

## Esquema de Base de Datos

```sql
-- 8 Tablas principales

Users (id, name, email, password, currentLevel, createdAt, updatedAt)
  ↓
Exams (id, userId, examTypeId, score, levelAchieved, passed, startTime, endTime)
  ↓
ExamQuestions (examId, questionId, sequenceNumber)
  ↓
Questions (id, levelId, text, optionA, optionB, optionC, optionD, correctAnswer)
  ↓
Levels (id, name, minScore, maxScore)

UserAnswers (id, examId, questionId, selectedAnswer, isCorrect, answeredAt)
UserStatistics (id, userId, totalExams, avgScore, bestScore, practiceAttempts, finalAttempts)
ExamTypes (id, name, questionsCount, maxAttempts, timePerQuestion)
```

**Relaciones:**
- Users 1:N Exams
- Exams N:M Questions (via ExamQuestions)
- Exams 1:N UserAnswers
- Users 1:1 UserStatistics

---

## API Routes

### Auth Routes (`/api/users`)
```javascript
POST   /register        // Crear usuario
POST   /login           // Autenticar
GET    /profile         // Obtener perfil (AUTH)
PUT    /profile         // Actualizar perfil (AUTH)
```

### Exam Routes (`/api/exams`)
```javascript
POST   /start           // Iniciar examen (AUTH)
POST   /answer          // Enviar respuesta (AUTH)
POST   /finish          // Finalizar examen (AUTH)
GET    /history         // Historial (AUTH)
GET    /:examId         // Detalle examen (AUTH)
```

### Dashboard Routes (`/api/dashboard`)
```javascript
GET    /stats           // Estadísticas generales (AUTH)
GET    /progress        // Datos para gráfico progreso (AUTH)
GET    /analysis        // Análisis practice vs final (AUTH)
```

### Question Routes (`/api/questions`)
```javascript
GET    /levels          // Obtener niveles
GET    /level/:levelId  // Preguntas por nivel (AUTH)
GET    /:id             // Detalle pregunta (AUTH)
```

---

## Middleware Stack

```javascript
// Backend: server.js
app.use(express.json());           // Parse JSON bodies
app.use(cors());                   // Enable CORS
app.use('/api/users', userRoutes); // User routes
app.use('/api/exams', authMiddleware, examRoutes); // Protected
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/questions', authMiddleware, questionRoutes);
```

---

## Angular Services

### AuthService
```typescript
class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  
  login(credentials): Observable<AuthResponse>
  register(userData): Observable<AuthResponse>
  logout(): void
  isAuthenticated(): boolean
  getUserFromToken(token: string): User | null
}
```

### ExamService
```typescript
class ExamService {
  startExam(examTypeId: number): Observable<ExamSession>
  submitAnswer(examId, questionId, answer): Observable<void>
  finishExam(examId: number): Observable<ExamResult>
  getExamHistory(): Observable<Exam[]>
  getExamById(id: number): Observable<Exam>
}
```

### DashboardService
```typescript
class DashboardService {
  getStatistics(): Observable<DashboardStats>
  getProgressCharts(): Observable<ChartData>
  getPracticeFinalAnalysis(): Observable<AnalysisData>
}
```

---

## Guards & Interceptors

### AuthGuard
```typescript
@Injectable()
class AuthGuard implements CanActivate {
  canActivate(route, state): boolean {
    if (authService.isAuthenticated()) {
      return true;
    }
    router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }
}
```

### AuthInterceptor
```typescript
@Injectable()
class AuthInterceptor implements HttpInterceptor {
  intercept(req, next): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          authService.logout();
        }
        return throwError(error);
      })
    );
  }
}
```

---

## Lógica de Negocio Clave

### Asignación Random de Preguntas
```javascript
// backend/src/models/exam.model.js
async assignRandomQuestions(examId, examTypeId) {
  const examType = await getExamType(examTypeId);
  const questionsCount = examType.questionsCount; // 20 o 40
  
  // Usar NEWID() de SQL Server para randomización
  const query = `
    SELECT TOP ${questionsCount} id 
    FROM Questions 
    ORDER BY NEWID()
  `;
  
  // Insertar en ExamQuestions con sequenceNumber
  // Garantiza NO repetición en misma prueba
}
```

### Cálculo de Score y Nivel
```javascript
// backend/src/models/exam.model.js
async finalize(examId) {
  // 1. Contar respuestas correctas
  const correctAnswers = await countCorrect(examId);
  
  // 2. Calcular score (Practice: 5pts, Final: 2.5pts)
  const score = correctAnswers * pointsPerQuestion;
  
  // 3. Determinar nivel basado en score
  const level = await determineLevelByScore(score);
  
  // 4. Verificar aprobado (>= 70%)
  const passed = score >= 70;
  
  // 5. Actualizar Exam y UserStatistics
  await updateExam(examId, { score, level, passed });
  await updateUserStatistics(userId);
  
  return { score, level, passed };
}
```

### Timer de Pregunta
```javascript
// Frontend: Implementación pendiente en ExamComponent
// Lógica sugerida:
class ExamComponent {
  private timer$: Subscription;
  timeRemaining = 60; // segundos
  
  startTimer() {
    this.timer$ = interval(1000).subscribe(() => {
      this.timeRemaining--;
      if (this.timeRemaining === 0) {
        this.autoSubmitAnswer(); // Timeout automático
        this.nextQuestion();
      }
    });
  }
  
  ngOnDestroy() {
    this.timer$?.unsubscribe();
  }
}
```

---

## Variables de Entorno

### Backend (.env)
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourPassword123
DB_NAME=EnglishExamDB

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h

# CORS
CORS_ORIGIN=http://localhost:4200
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## Comandos de Desarrollo

### Backend
```powershell
npm install              # Instalar dependencias
npm run dev              # Desarrollo con nodemon
npm start                # Producción
npm run seed             # Cargar datos iniciales
npm test                 # Ejecutar tests (si existen)
```

### Frontend
```powershell
npm install              # Instalar dependencias
ng serve                 # Desarrollo
ng serve --open          # Con auto-open en navegador
ng build                 # Build producción
ng build --prod          # Build optimizado
ng test                  # Ejecutar tests
ng lint                  # Linting
```

---

## Estructura de Carpetas

```
backend/
├── database/
│   ├── schema.sql          # DDL completo
│   └── seed.js             # Datos iniciales
├── src/
│   ├── config/
│   │   └── database.js     # Connection pooling
│   ├── controllers/        # Request handlers
│   │   ├── user.controller.js
│   │   ├── exam.controller.js
│   │   ├── question.controller.js
│   │   └── dashboard.controller.js
│   ├── models/             # Business logic
│   │   ├── user.model.js
│   │   ├── exam.model.js
│   │   └── question.model.js
│   ├── routes/             # Route definitions
│   │   ├── user.routes.js
│   │   ├── exam.routes.js
│   │   ├── question.routes.js
│   │   └── dashboard.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── validation.middleware.js
│   └── server.js           # Entry point
├── .env                    # Environment variables
├── .env.example            # Template
└── package.json

frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── models/
│   │   │   │   └── index.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       ├── exam.service.ts
│   │   │       ├── dashboard.service.ts
│   │   │       └── question.service.ts
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   ├── exam-selection/
│   │   │   ├── exam/
│   │   │   ├── result/
│   │   │   ├── profile/
│   │   │   └── history/
│   │   ├── app.module.ts
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── app.component.scss
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── tsconfig.json
└── package.json
```

---

## Testing

### Backend - Probar Endpoints con curl/Postman

```powershell
# Register
curl -X POST http://localhost:3000/api/users/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/users/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@test.com","password":"test123"}'
  
# Get Profile (con token)
curl http://localhost:3000/api/users/profile `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Frontend - Consola del Navegador

```javascript
// Obtener token almacenado
localStorage.getItem('token')

// Ver usuario actual
JSON.parse(localStorage.getItem('currentUser'))

// Limpiar localStorage
localStorage.clear()
```

---

## Debugging

### Backend
```javascript
// En cualquier archivo .js
console.log('Debug info:', variable);

// O usar debugger
debugger; // Pausará si tienes DevTools abierto
```

### Frontend
```typescript
// En cualquier archivo .ts
console.log('Debug info:', variable);

// O usar breakpoints en Chrome DevTools
// F12 → Sources → Seleccionar archivo → Click en número de línea
```

---

## Próximos Desarrollos Sugeridos

### 1. Exam Component (Prioridad: Alta)
```typescript
@Component({ selector: 'app-exam' })
export class ExamComponent implements OnInit, OnDestroy {
  examSession: ExamSession;
  currentQuestionIndex = 0;
  currentQuestion: Question;
  timeRemaining = 60;
  selectedAnswer: string | null = null;
  
  // Implementar:
  // - Cargar examen desde route params
  // - Mostrar pregunta actual
  // - Timer countdown
  // - Navegación prev/next
  // - Submit answer
  // - Auto-advance on timeout
  // - Finish exam
}
```

### 2. Result Component (Prioridad: Alta)
```typescript
@Component({ selector: 'app-result' })
export class ResultComponent implements OnInit {
  examResult: ExamResult;
  
  // Implementar:
  // - Mostrar score
  // - Mostrar nivel alcanzado
  // - Mostrar passed/failed
  // - Gráfico de respuestas correctas/incorrectas
  // - Botón volver a dashboard
  // - Botón ver detalles (si applicable)
}
```

### 3. Profile Component (Prioridad: Media)
```typescript
@Component({ selector: 'app-profile' })
export class ProfileComponent implements OnInit {
  user: User;
  editForm: FormGroup;
  
  // Implementar:
  // - Mostrar info del usuario
  // - Form para editar nombre
  // - Form para cambiar contraseña
  // - Estadísticas personales
  // - Gráfico de progreso
}
```

### 4. History Component (Prioridad: Media)
```typescript
@Component({ selector: 'app-history' })
export class HistoryComponent implements OnInit {
  exams: Exam[];
  displayedColumns = ['date', 'type', 'score', 'level', 'passed'];
  
  // Implementar:
  // - Tabla con MatTable
  // - Paginación
  // - Filtros por fecha/tipo
  // - Botón ver detalles
  // - Exportar a PDF (opcional)
}
```

---

## Patrones y Mejores Prácticas

### Backend
- ✅ Separación de concerns (routes → controllers → models)
- ✅ Middleware para auth y validación
- ✅ Connection pooling para DB
- ✅ Error handling centralizado
- ✅ Async/await en lugar de callbacks
- ✅ Validación de entrada con express-validator

### Frontend
- ✅ Lazy loading de módulos
- ✅ Servicios singleton (providedIn: 'root')
- ✅ Observables para async operations
- ✅ Guards para protección de rutas
- ✅ Interceptors para requests HTTP
- ✅ TypeScript strict mode
- ✅ Material Design components

---

## Performance Tips

### Backend
- Connection pool configurado (max: 10 connections)
- Índices en columnas frecuentemente consultadas
- Prepared statements para prevenir SQL injection
- JWT stateless (no sesiones en servidor)

### Frontend
- Lazy loading de rutas
- OnPush change detection (implementar si necesario)
- Unsubscribe en OnDestroy
- trackBy en *ngFor
- Build con --prod para optimización

---

## Seguridad

### Backend
- ✅ Passwords hasheados con bcrypt (10 rounds)
- ✅ JWT con expiración (24h)
- ✅ CORS configurado
- ✅ SQL parametrizado (no concatenación)
- ✅ Validación de entrada
- ✅ Rate limiting (implementar si necesario)

### Frontend
- ✅ JWT en localStorage (considerar httpOnly cookies)
- ✅ No exponer secretos en código
- ✅ Sanitización de HTML inputs
- ✅ HTTPS en producción (implementar)
- ✅ CSP headers (implementar)

---

## Deployment

### Backend (Ejemplo con Heroku)
```powershell
# Install Heroku CLI
heroku create english-exam-api
heroku config:set DB_SERVER=your-db-host
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

### Frontend (Ejemplo con Vercel)
```powershell
# Install Vercel CLI
vercel
vercel --prod
```

### Base de Datos (Ejemplo con Azure SQL)
- Crear Azure SQL Database
- Ejecutar schema.sql
- Ejecutar seed script
- Actualizar .env con connection string

---

## Recursos Útiles

- [Express.js Docs](https://expressjs.com/)
- [Angular Docs](https://angular.io/)
- [SQL Server T-SQL Reference](https://docs.microsoft.com/en-us/sql/t-sql/)
- [JWT.io](https://jwt.io/)
- [Angular Material](https://material.angular.io/)
- [Chart.js](https://www.chartjs.org/)

---

**Happy Coding! 🚀**
