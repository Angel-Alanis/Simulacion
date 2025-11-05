# 📋 EVIDENCIAS DE AVANCE - PARCIAL 2
## Simulador de Exámenes de Inglés ORDI

**Equipo:** [Tu nombre] y [Nombre del otro integrante]  
**Fecha:** Octubre 2025  
**Estado:** Primer Avance - Diseño y Prototipado

---

## 1. ESTRATEGIA DE SIMULACIÓN DEL EXAMEN

### 1.1 Descripción de la Estrategia

Nuestra estrategia consiste en generar **exámenes personalizados** para cada aspirante mediante un algoritmo de selección aleatoria estratificada que garantiza:

- ✅ Diversidad de preguntas entre estudiantes
- ✅ Nivel de dificultad equilibrado
- ✅ Cobertura de todas las áreas del examen ORDI
- ✅ No repetición de preguntas en sesiones consecutivas del mismo usuario

### 1.2 Proceso de Generación de Exámenes

```
┌─────────────────────────────────────────────────────────────┐
│                    INICIO DEL PROCESO                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Usuario solicita examen   │
        │  - Tipo: Diagnóstico       │
        │  - Duración: 90 minutos    │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Sistema consulta         │
        │   Banco de Preguntas       │
        │   (Base de datos)          │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Algoritmo de Selección    │
        │  ┌──────────────────────┐  │
        │  │ POR CADA CATEGORÍA:  │  │
        │  │ - Grammar: 30 preg   │  │
        │  │ - Vocabulary: 20 preg│  │
        │  │ - Reading: 25 preg   │  │
        │  │ - Listening: 25 preg │  │
        │  └──────────────────────┘  │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Selección ALEATORIA      │
        │   dentro de cada categoría │
        │   (Evita preguntas usadas) │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Mezclar orden de:        │
        │   - Preguntas              │
        │   - Opciones de respuesta  │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Crear registro en DB      │
        │  - ID único del examen     │
        │  - Usuario asignado        │
        │  - Timestamp inicio        │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Presentar examen al       │
        │  estudiante en pantalla    │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Estudiante responde       │
        │  (Timer: 90 minutos)       │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Enviar respuestas         │
        │  al backend                │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Calificar automáticamente │
        │  - Comparar respuestas     │
        │  - Calcular puntuación     │
        │  - Por categoría           │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Generar reporte           │
        │  - Score total             │
        │  - Desglose por área       │
        │  - Recomendaciones         │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Mostrar resultados       │
        │   al estudiante            │
        └────────────────────────────┘
```

---

## 2. MODELO DE DATOS (UML)

### 2.1 Diagrama de Clases Principal

```
┌─────────────────────────────────────────┐
│              User                        │
├─────────────────────────────────────────┤
│ - id: INT (PK)                          │
│ - email: VARCHAR(100)                   │
│ - password: VARCHAR(255) [hashed]      │
│ - full_name: VARCHAR(100)              │
│ - created_at: TIMESTAMP                │
├─────────────────────────────────────────┤
│ + register()                            │
│ + login()                               │
│ + getExamHistory()                      │
└───────────┬─────────────────────────────┘
            │ 1
            │
            │ *
            │
┌───────────▼─────────────────────────────┐
│              Exam                        │
├─────────────────────────────────────────┤
│ - id: INT (PK)                          │
│ - user_id: INT (FK)                     │
│ - exam_type: ENUM                       │
│ - total_questions: INT                  │
│ - score: DECIMAL(5,2)                   │
│ - time_taken: INT (segundos)           │
│ - status: ENUM (in_progress, completed) │
│ - started_at: TIMESTAMP                │
│ - completed_at: TIMESTAMP              │
├─────────────────────────────────────────┤
│ + createExam()                          │
│ + submitAnswers()                       │
│ + calculateScore()                      │
│ + getResults()                          │
└───────────┬─────────────────────────────┘
            │ 1
            │
            │ *
            │
┌───────────▼─────────────────────────────┐
│         ExamQuestion                     │
├─────────────────────────────────────────┤
│ - id: INT (PK)                          │
│ - exam_id: INT (FK)                     │
│ - question_id: INT (FK)                 │
│ - question_order: INT                   │
│ - user_answer: CHAR(1)                  │
│ - is_correct: BOOLEAN                   │
│ - time_spent: INT                       │
├─────────────────────────────────────────┤
│ + recordAnswer()                        │
│ + checkCorrectness()                    │
└───────────┬─────────────────────────────┘
            │ *
            │
            │ 1
            │
┌───────────▼─────────────────────────────┐
│           Question                       │
├─────────────────────────────────────────┤
│ - id: INT (PK)                          │
│ - category: ENUM (grammar, vocab, etc)  │
│ - difficulty: ENUM (easy, medium, hard) │
│ - question_text: TEXT                   │
│ - option_a: VARCHAR(255)                │
│ - option_b: VARCHAR(255)                │
│ - option_c: VARCHAR(255)                │
│ - option_d: VARCHAR(255)                │
│ - correct_answer: CHAR(1)               │
│ - explanation: TEXT                     │
│ - times_used: INT                       │
├─────────────────────────────────────────┤
│ + getByCategory()                       │
│ + getRandomQuestions()                  │
│ + incrementUsage()                      │
└─────────────────────────────────────────┘

         RELACIONES:
         - User  ──1:N──  Exam
         - Exam  ──1:N──  ExamQuestion
         - Question ──1:N── ExamQuestion
```

---

## 3. BANCO DE REACTIVOS - MUESTRA

### 3.1 Categoría: GRAMMAR

**Reactivo #001**
- **Texto:** "She _____ to the store yesterday."
- **A)** go
- **B)** goes
- **C)** went ✅
- **D)** going
- **Dificultad:** Easy
- **Explicación:** Se usa el pasado simple "went" porque "yesterday" indica tiempo pasado.

**Reactivo #002**
- **Texto:** "If I _____ rich, I would travel the world."
- **A)** am
- **B)** was
- **C)** were ✅
- **D)** be
- **Dificultad:** Medium
- **Explicación:** En condicionales tipo 2 (situaciones hipotéticas), se usa "were" para todas las personas.

**Reactivo #003**
- **Texto:** "The report _____ by the manager tomorrow."
- **A)** will review
- **B)** will be reviewed ✅
- **C)** is reviewing
- **D)** reviews
- **Dificultad:** Medium
- **Explicación:** Voz pasiva en futuro: will be + participio pasado.

---

### 3.2 Categoría: VOCABULARY

**Reactivo #004**
- **Texto:** "The company decided to _____ the project due to budget constraints."
- **A)** abandon ✅
- **B)** continue
- **C)** expand
- **D)** celebrate
- **Dificultad:** Easy
- **Explicación:** "Abandon" significa dejar o abandonar, coherente con problemas de presupuesto.

**Reactivo #005**
- **Texto:** "His _____ remarks offended many people at the meeting."
- **A)** polite
- **B)** thoughtful
- **C)** derogatory ✅
- **D)** kind
- **Dificultad:** Hard
- **Explicación:** "Derogatory" significa despectivo u ofensivo.

---

### 3.3 Categoría: READING COMPREHENSION

**Contexto para reactivos #006-#008:**

> *The Industrial Revolution, which began in Britain in the late 18th century, transformed economies from agrarian to industrial. This period saw the introduction of machinery, factories, and new methods of production. While it led to economic growth and urbanization, it also resulted in poor working conditions, child labor, and environmental pollution.*

**Reactivo #006**
- **Texto:** "Where did the Industrial Revolution begin?"
- **A)** France
- **B)** Britain ✅
- **C)** United States
- **D)** Germany
- **Dificultad:** Easy
- **Explicación:** El texto menciona explícitamente "began in Britain".

**Reactivo #007**
- **Texto:** "What was a negative consequence of the Industrial Revolution?"
- **A)** Economic growth
- **B)** Urbanization
- **C)** Poor working conditions ✅
- **D)** New production methods
- **Dificultad:** Medium
- **Explicación:** El texto menciona "poor working conditions" como consecuencia negativa.

---

### 3.4 Categoría: LISTENING (Simulado con audio transcrito)

**Audio #001 - Conversación en aeropuerto**

> *"Excuse me, where is gate 24? I'm running late for my flight."*  
> *"Gate 24 is in Terminal B. You need to take the shuttle from here. It leaves every 5 minutes."*

**Reactivo #008**
- **Texto:** "Where is gate 24 located?"
- **A)** Terminal A
- **B)** Terminal B ✅
- **C)** Terminal C
- **D)** Not mentioned
- **Dificultad:** Easy
- **Explicación:** El empleado indica "Gate 24 is in Terminal B".

---

## 4. ARQUITECTURA DEL SISTEMA

### 4.1 Stack Tecnológico (En implementación)

```
┌─────────────────────────────────────┐
│         FRONTEND (Angular)          │
│  - TypeScript                       │
│  - Bootstrap/Material UI            │
│  - RxJS para manejo de estado       │
└────────────┬────────────────────────┘
             │ HTTP/REST API
             │
┌────────────▼────────────────────────┐
│         BACKEND (Node.js)           │
│  - Express.js                       │
│  - JWT para autenticación           │
│  - Bcrypt para contraseñas          │
└────────────┬────────────────────────┘
             │ SQL Queries
             │
┌────────────▼────────────────────────┐
│       BASE DE DATOS (MySQL)         │
│  - Tablas: users, questions,        │
│    exams, exam_questions            │
└─────────────────────────────────────┘
```

---

## 5. MOCKUPS INICIALES

### 5.1 Pantalla de Login

```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║           📚 ORDI English Exam Simulator             ║
║                                                       ║
║   ┌─────────────────────────────────────────────┐   ║
║   │  Email:                                     │   ║
║   │  [____________________________]             │   ║
║   │                                             │   ║
║   │  Password:                                  │   ║
║   │  [____________________________]             │   ║
║   │                                             │   ║
║   │         [  INICIAR SESIÓN  ]                │   ║
║   │                                             │   ║
║   │         ¿No tienes cuenta?                  │   ║
║   │         [   Registrarse   ]                 │   ║
║   └─────────────────────────────────────────────┘   ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

### 5.2 Dashboard Principal

```
╔═══════════════════════════════════════════════════════╗
║  [Logo] ORDI Simulator          Usuario: Juan Pérez  ║
║  [Inicio] [Exámenes] [Historial] [Perfil] [Salir]   ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║   📊 TUS ESTADÍSTICAS                                ║
║   ┌──────────────┬──────────────┬──────────────┐    ║
║   │ Exámenes     │ Promedio     │ Último exam  │    ║
║   │ realizados   │ general      │              │    ║
║   │      5       │    72.5%     │    15 Oct    │    ║
║   └──────────────┴──────────────┴──────────────┘    ║
║                                                       ║
║   🎯 NUEVO EXAMEN                                    ║
║   ┌───────────────────────────────────────────┐     ║
║   │  Tipo de examen:                          │     ║
║   │  ○ Diagnóstico completo (100 preguntas)  │     ║
║   │  ○ Práctica rápida (40 preguntas)        │     ║
║   │                                           │     ║
║   │  Duración: 90 minutos                     │     ║
║   │                                           │     ║
║   │        [ COMENZAR EXAMEN ]                │     ║
║   └───────────────────────────────────────────┘     ║
║                                                       ║
║   📈 HISTORIAL RECIENTE                              ║
║   ┌───────────────────────────────────────────┐     ║
║   │ 15/Oct - Diagnóstico - 75.0% - 85 min    │     ║
║   │ 12/Oct - Práctica    - 68.5% - 42 min    │     ║
║   │ 08/Oct - Diagnóstico - 71.0% - 88 min    │     ║
║   └───────────────────────────────────────────┘     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

### 5.3 Pantalla de Examen

```
╔═══════════════════════════════════════════════════════╗
║  Pregunta 15 de 100            ⏱️ Tiempo: 67:42      ║
║  Categoría: Grammar            [Finalizar Examen]    ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  She _____ to the store yesterday.                   ║
║                                                       ║
║  ○ A) go                                             ║
║  ○ B) goes                                           ║
║  ○ C) went                                           ║
║  ○ D) going                                          ║
║                                                       ║
║                                                       ║
║  [ ← Anterior ]              [ Siguiente → ]         ║
║                                                       ║
║  Navegación rápida:                                  ║
║  [1][2][3][4][5]...[●]...[50]                       ║
║  ● = Pregunta actual                                 ║
║  ✓ = Respondida                                      ║
║  ○ = Sin responder                                   ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

---

## 6. ESTADO ACTUAL DEL DESARROLLO

### ✅ Completado
- [x] Definición de la estrategia de simulación
- [x] Diseño del modelo de datos
- [x] Creación del banco de preguntas inicial (50 reactivos)
- [x] Mockups de las pantallas principales
- [x] Estructura base del proyecto (carpetas)

### 🚧 En Progreso
- [ ] Implementación del backend (Node.js + Express)
- [ ] Desarrollo del algoritmo de selección de preguntas
- [ ] Frontend básico (Angular - componentes principales)
- [ ] Sistema de autenticación

### 📝 Pendiente
- [ ] Sistema de calificación automatizada
- [ ] Generación de reportes y estadísticas
- [ ] Módulo de listening con audio
- [ ] Responsive design
- [ ] Testing y depuración
- [ ] Despliegue

---

## 7. ALGORITMO DE SELECCIÓN (Pseudocódigo)

```javascript
function generarExamen(userId, tipoExamen) {
  // 1. Definir distribución de preguntas
  const distribucion = {
    grammar: 30,
    vocabulary: 20,
    reading: 25,
    listening: 25
  };
  
  // 2. Obtener historial del usuario
  const preguntasUsadas = obtenerPreguntasUsadas(userId);
  
  // 3. Seleccionar preguntas por categoría
  const preguntasSeleccionadas = [];
  
  for (categoria in distribucion) {
    const cantidad = distribucion[categoria];
    
    // Obtener preguntas disponibles de la categoría
    const preguntasDisponibles = db.query(`
      SELECT * FROM questions 
      WHERE category = '${categoria}'
      AND id NOT IN (${preguntasUsadas})
      ORDER BY RAND()
      LIMIT ${cantidad}
    `);
    
    preguntasSeleccionadas.push(...preguntasDisponibles);
  }
  
  // 4. Mezclar orden de las preguntas
  shuffle(preguntasSeleccionadas);
  
  // 5. Crear registro del examen
  const examId = db.insert({
    user_id: userId,
    exam_type: tipoExamen,
    total_questions: preguntasSeleccionadas.length,
    started_at: now(),
    status: 'in_progress'
  });
  
  // 6. Asociar preguntas al examen
  preguntasSeleccionadas.forEach((pregunta, index) => {
    db.insertExamQuestion({
      exam_id: examId,
      question_id: pregunta.id,
      question_order: index + 1
    });
  });
  
  return examId;
}
```

---

## 8. PRÓXIMOS PASOS

1. **Implementar el backend completo** con todas las rutas API
2. **Conectar frontend con backend** mediante servicios HTTP
3. **Agregar más preguntas al banco** (objetivo: 500 preguntas)
4. **Implementar sistema de audio** para sección de listening
5. **Validar y probar** el algoritmo de generación de exámenes

---

## 9. CAPTURAS DE PANTALLA

*(Para el profesor: Aquí puedes agregar capturas de pantalla de:)*
- Diagrama de flujo impreso o dibujado a mano
- Código del backend en el editor VS Code
- Vista preliminar del frontend
- Base de datos con algunas tablas creadas
- Pruebas de las consultas SQL

---

**Nota:** Este es un avance del Parcial 2. El proyecto continúa en desarrollo siguiendo la metodología ágil con sprints semanales.

