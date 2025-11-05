# 📚 English Exam Simulator - ÍNDICE DE DOCUMENTACIÓN

## 🎯 Empezar Aquí

Bienvenido al **Simulador de Examen de Inglés Online** - Un proyecto completo Full Stack con Angular, Node.js y SQL Server.

---

## 📖 Guías Disponibles

### 1️⃣ Para Empezar (Todos)
📄 **[README_EQUIPO.md](./README_EQUIPO.md)**  
- Resumen ejecutivo del proyecto
- Estado actual (qué funciona y qué falta)
- Inicio rápido con 2 opciones
- Cumplimiento de requisitos (90/90 puntos)
- Próximos pasos para el equipo

**👉 Lee este primero si eres nuevo en el proyecto**

---

### 2️⃣ Instalación Paso a Paso (Setup)
📄 **[GUIA_INSTALACION_COMPLETA.md](./GUIA_INSTALACION_COMPLETA.md)**  
- Prerrequisitos detallados
- Instalación backend (Node.js + SQL Server)
- Instalación frontend (Angular + Material)
- Configuración de .env
- Carga de 80 preguntas
- Solución de problemas comunes
- Comandos útiles

**👉 Lee esto si vas a instalar el proyecto por primera vez**

---

### 3️⃣ Checklist Visual (Verificación)
📄 **[CHECKLIST_INSTALACION.md](./CHECKLIST_INSTALACION.md)**  
- Checklist interactivo con checkboxes
- Pasos de verificación para cada componente
- Tests de funcionalidad
- Troubleshooting rápido
- Resumen visual del proyecto

**👉 Lee esto mientras instalas para asegurar que todo funciona**

---

### 4️⃣ Guía Técnica (Desarrolladores)
📄 **[GUIA_TECNICA_DESARROLLADORES.md](./GUIA_TECNICA_DESARROLLADORES.md)**  
- Stack tecnológico completo
- Arquitectura del sistema
- Flujo de autenticación
- Modelos de datos
- Esquema de base de datos
- API routes con ejemplos
- Middleware y servicios
- Patrones y mejores prácticas
- Tips de performance y seguridad

**👉 Lee esto si vas a desarrollar nuevas features**

---

### 5️⃣ Banco de Preguntas (Contenido)
📄 **[BANCO_PREGUNTAS.md](./BANCO_PREGUNTAS.md)**  
- Las 80 preguntas completas
- Distribuidas en 6 niveles:
  - Beginner (1-10)
  - Elementary (11-25)
  - Pre-intermediate (26-40)
  - Intermediate (41-60)
  - Upper-intermediate (61-70)
  - Advanced (71-80)
- Con opciones A, B, C, D y respuesta correcta

**👉 Lee esto si quieres revisar las preguntas del examen**

---

### 6️⃣ Estrategia y Planificación (Project Management)
📄 **[ESTRATEGIA_Y_GANTT.md](./ESTRATEGIA_Y_GANTT.md)**  
- Estrategia de desarrollo
- Cronograma con Gantt Chart
- Fases del proyecto
- Asignación de tareas
- Entregables por semana

**👉 Lee esto si eres PM o quieres entender la planificación**

---

### 7️⃣ README Principal (General)
📄 **[README.md](./README.md)** (si existe en la raíz)  
- Descripción general del proyecto
- Links rápidos a las guías
- Screenshots (si los hay)
- Créditos y licencia

---

## 🚀 Scripts Automatizados

### 🎬 Inicio Automático
📜 **[start-project.ps1](./start-project.ps1)**  
Script de PowerShell que:
- Verifica e instala dependencias (npm install)
- Revisa archivo .env
- Valida base de datos
- Inicia backend en http://localhost:3000
- Inicia frontend en http://localhost:4200
- Abre navegador automáticamente

**Uso:**
```powershell
.\start-project.ps1
```

---

## 📂 Estructura de Archivos del Proyecto

```
english-exam-simulator/
│
├── 📄 README_EQUIPO.md                    ← Empieza aquí
├── 📄 GUIA_INSTALACION_COMPLETA.md        ← Para instalar
├── 📄 CHECKLIST_INSTALACION.md            ← Para verificar
├── 📄 GUIA_TECNICA_DESARROLLADORES.md     ← Para desarrollar
├── 📄 BANCO_PREGUNTAS.md                  ← Para revisar preguntas
├── 📄 ESTRATEGIA_Y_GANTT.md               ← Para planificar
├── 📄 INDICE.md                           ← Este archivo
├── 📜 start-project.ps1                   ← Script de inicio
│
├── backend/                                ← API REST
│   ├── database/
│   │   ├── schema.sql                     ← Ejecutar en SQL Server
│   │   └── seed.js                        ← npm run seed
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   ├── .env.example                       ← Copiar a .env
│   ├── .env                               ← Crear con tus datos
│   └── package.json
│
└── frontend/                               ← Aplicación Angular
    ├── src/
    │   ├── app/
    │   │   ├── core/
    │   │   ├── pages/
    │   │   ├── app.module.ts
    │   │   └── app-routing.module.ts
    │   ├── environments/
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.scss
    ├── angular.json
    ├── tsconfig.json
    └── package.json
```

---

## 🎯 Flujo Recomendado para Nuevos Miembros

### Día 1: Entender el Proyecto
1. ✅ Lee **README_EQUIPO.md** (10 min)
2. ✅ Lee **BANCO_PREGUNTAS.md** (5 min)
3. ✅ Revisa **ESTRATEGIA_Y_GANTT.md** (5 min)

### Día 2: Instalar y Correr
1. ✅ Lee **GUIA_INSTALACION_COMPLETA.md** (15 min)
2. ✅ Ejecuta instalación usando **CHECKLIST_INSTALACION.md** (30 min)
3. ✅ O usa script: `.\start-project.ps1` (5 min)
4. ✅ Prueba login, registro, dashboard

### Día 3: Empezar a Desarrollar
1. ✅ Lee **GUIA_TECNICA_DESARROLLADORES.md** (30 min)
2. ✅ Explora el código backend (30 min)
3. ✅ Explora el código frontend (30 min)
4. ✅ Elige un componente para trabajar

---

## 🔍 Búsqueda Rápida por Tema

### Instalación y Setup
- Prerrequisitos → **GUIA_INSTALACION_COMPLETA.md**
- Archivo .env → **GUIA_INSTALACION_COMPLETA.md** (Paso 2)
- Crear base de datos → **GUIA_INSTALACION_COMPLETA.md** (Paso 1)
- Cargar preguntas → **GUIA_INSTALACION_COMPLETA.md** (Paso 4)
- Script automático → **start-project.ps1**

### Arquitectura y Código
- Stack tecnológico → **GUIA_TECNICA_DESARROLLADORES.md** (Inicio)
- Arquitectura del sistema → **GUIA_TECNICA_DESARROLLADORES.md** (Arquitectura)
- Esquema de BD → **GUIA_TECNICA_DESARROLLADORES.md** (Esquema de Base de Datos)
- API endpoints → **GUIA_TECNICA_DESARROLLADORES.md** (API Routes)
- Servicios Angular → **GUIA_TECNICA_DESARROLLADORES.md** (Angular Services)

### Desarrollo
- Componentes pendientes → **README_EQUIPO.md** (Próximos Pasos)
- Implementar Exam → **GUIA_TECNICA_DESARROLLADORES.md** (Próximos Desarrollos)
- Implementar Result → **GUIA_TECNICA_DESARROLLADORES.md** (Próximos Desarrollos)
- Patrones → **GUIA_TECNICA_DESARROLLADORES.md** (Patrones y Mejores Prácticas)
- Testing → **GUIA_TECNICA_DESARROLLADORES.md** (Testing)

### Contenido
- 80 Preguntas → **BANCO_PREGUNTAS.md**
- Niveles de inglés → **BANCO_PREGUNTAS.md** (Distribución)
- Requisitos del proyecto → **README_EQUIPO.md** (Cumplimiento de Requisitos)

### Troubleshooting
- Problemas comunes → **GUIA_INSTALACION_COMPLETA.md** (Solución de Problemas)
- Verificación paso a paso → **CHECKLIST_INSTALACION.md**
- Debugging → **GUIA_TECNICA_DESARROLLADORES.md** (Debugging)

---

## 📊 Estado del Proyecto

### ✅ Completado (Listo para Usar)
- Backend API (15+ endpoints)
- Base de datos (8 tablas)
- 80 preguntas cargadas
- Autenticación JWT
- Login/Register (Frontend)
- Dashboard completo (Frontend)
- Servicios Angular (Auth, Exam, Dashboard, Question)
- Guards y Interceptors
- Documentación completa

### 🔧 Base Implementada (Expandir con UI)
- Exam Component (tomar examen)
- Result Component (ver resultados)
- Profile Component (perfil de usuario)
- History Component (historial de exámenes)

---

## 🎓 Recursos de Aprendizaje

### Angular
- [Angular Official Docs](https://angular.io/docs)
- [Angular Material Components](https://material.angular.io/components/categories)
- [RxJS Guide](https://rxjs.dev/guide/overview)

### Node.js / Express
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### SQL Server
- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/sql-server/)
- [T-SQL Tutorial](https://www.sqlservertutorial.net/)

### JWT
- [JWT.io](https://jwt.io/introduction)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

---

## 💬 Convenciones del Código

### Backend
- **Rutas:** kebab-case (`/api/exam-types`)
- **Archivos:** kebab-case (`user.controller.js`)
- **Funciones:** camelCase (`getUserProfile()`)
- **Constantes:** UPPER_SNAKE_CASE (`MAX_ATTEMPTS`)

### Frontend
- **Componentes:** PascalCase (`LoginComponent`)
- **Archivos:** kebab-case (`login.component.ts`)
- **Variables:** camelCase (`currentUser`)
- **Interfaces:** PascalCase (`User`, `ExamSession`)
- **Observables:** nombre$ (`currentUser$`)

---

## 🤝 Contribuir al Proyecto

### Workflow Sugerido
1. Elige un componente de **README_EQUIPO.md** (Próximos Pasos)
2. Lee la guía técnica en **GUIA_TECNICA_DESARROLLADORES.md**
3. Revisa el código existente como referencia
4. Implementa tu feature
5. Prueba localmente
6. Documenta cambios importantes

### Git Workflow (Opcional)
```bash
git checkout -b feature/exam-component
# Hacer cambios
git add .
git commit -m "feat: implement exam taking component"
git push origin feature/exam-component
# Create Pull Request
```

---

## 📞 Soporte

### Tengo un Problema con...
- **Instalación** → **CHECKLIST_INSTALACION.md** (Troubleshooting)
- **Backend no inicia** → **GUIA_INSTALACION_COMPLETA.md** (Solución de Problemas)
- **Frontend no compila** → **GUIA_INSTALACION_COMPLETA.md** (Solución de Problemas)
- **Base de datos** → **GUIA_INSTALACION_COMPLETA.md** (Paso 1)
- **No entiendo el código** → **GUIA_TECNICA_DESARROLLADORES.md**

### Recursos Adicionales
- Comentarios inline en el código
- Console logs en desarrollo
- Chrome DevTools (F12)
- SQL Server Management Studio para DB

---

## 🎉 ¡Éxito!

Si llegaste hasta aquí, estás listo para trabajar en el proyecto.

**Recuerda:**
1. Lee la documentación relevante antes de empezar
2. Usa el script `start-project.ps1` para inicio rápido
3. Revisa el código existente como referencia
4. Pregunta si tienes dudas (busca en las guías primero)
5. Documenta tus cambios

**¡Mucha suerte con el proyecto!** 🚀

---

## 📝 Historial de Cambios

- **v1.0.0** (Fecha actual) - Creación inicial del proyecto
  - Backend completo con 15+ endpoints
  - Frontend base con Login, Register, Dashboard
  - 80 preguntas cargadas en BD
  - Documentación completa
  - Scripts de automatización

---

**Creado con ❤️ para la materia de Simulación**  
**Universidad:** [Tu Universidad]  
**Fecha:** $(Get-Date -Format "yyyy-MM-dd HH:mm")
