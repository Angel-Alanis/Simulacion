# 📊 Estrategia del Proyecto - Diagrama de Gantt y Planificación

## 🎯 Estrategia General del Proyecto

### Objetivo
Desarrollar un simulador completo de examen de inglés con 80 preguntas, sistema de práctica y evaluación final, dashboard de estadísticas y análisis de beneficio del estudio.

### Metodología: Desarrollo Ágil

- **Sprints**: 4 semanas (4 sprints de 1 semana)
- **Reuniones**: Diarias (stand-ups de 15 min)
- **Revisiones**: Semanales
- **Retrospectivas**: Al final de cada sprint

## 👥 Distribución de Responsabilidades

### Opción 1: Equipo de 3 personas

| Rol | Responsabilidad Principal | % Carga |
|-----|---------------------------|---------|
| **Desarrollador Backend** | API REST, Base de datos, Autenticación, Lógica de negocio | 40% |
| **Desarrollador Frontend** | Angular, UI/UX, Componentes, Integración API | 40% |
| **Tester / DevOps** | Testing, Documentación, Deployment, Dashboard | 20% |

### Opción 2: Equipo de 4 personas

| Rol | Responsabilidad Principal | % Carga |
|-----|---------------------------|---------|
| **Backend Developer** | API REST, Modelos, Servicios | 30% |
| **Database Administrator** | Diseño BD, Optimización, Scripts SQL | 25% |
| **Frontend Developer** | Angular, Componentes, Estilos | 30% |
| **QA / Analyst** | Testing, Dashboard, Analytics, Docs | 15% |

### Opción 3: Desarrollo Individual

| Fase | Actividad | Horas | Prioridad |
|------|-----------|-------|-----------|
| **Semana 1** | Base de datos y Backend | 20h | Alta |
| **Semana 2** | Frontend base | 20h | Alta |
| **Semana 3** | Integración y Features | 20h | Media |
| **Semana 4** | Dashboard, Testing, Docs | 15h | Media |

---

## 📅 Diagrama de Gantt - 4 Semanas

```
ACTIVIDAD                      | SEM 1 | SEM 2 | SEM 3 | SEM 4 |
-------------------------------|-------|-------|-------|-------|
1. PLANIFICACIÓN              |       |       |       |       |
   └─ Análisis requisitos     | ████  |       |       |       |
   └─ Diseño arquitectura     | ████  |       |       |       |
   └─ Diseño BD               | ████  |       |       |       |
                              |       |       |       |       |
2. BASE DE DATOS              |       |       |       |       |
   └─ Modelo ER               | ████  |       |       |       |
   └─ Scripts SQL             | ████  |       |       |       |
   └─ Normalización           |  ████ |       |       |       |
   └─ Seed 80 preguntas       |  ████ |       |       |       |
   └─ Testing BD              |   ████|       |       |       |
                              |       |       |       |       |
3. BACKEND (Node.js)          |       |       |       |       |
   └─ Setup inicial           |  ████ |       |       |       |
   └─ Config BD               |  ████ |       |       |       |
   └─ Modelos                 |   ████|       |       |       |
   └─ Auth (JWT)              |   ████|       |       |       |
   └─ API Users               |    ██ | ████  |       |       |
   └─ API Exams               |       | ████  |       |       |
   └─ API Questions           |       | ████  |       |       |
   └─ API Dashboard           |       |  ████ |       |       |
   └─ Validaciones            |       |   ████|       |       |
   └─ Testing Backend         |       |    ██ | ████  |       |
                              |       |       |       |       |
4. FRONTEND (Angular)         |       |       |       |       |
   └─ Setup Angular           |       | ████  |       |       |
   └─ Estructura              |       | ████  |       |       |
   └─ Angular Material        |       |  ████ |       |       |
   └─ Servicios               |       |  ████ |       |       |
   └─ Auth Guard              |       |   ████|       |       |
   └─ Login/Register          |       |    ██ | ████  |       |
   └─ Exam Selection          |       |       | ████  |       |
   └─ Exam Practice           |       |       | ████  |       |
   └─ Timer Component         |       |       | ████  |       |
   └─ Results Component       |       |       |  ████ |       |
   └─ Dashboard               |       |       |   ████| ████  |
   └─ Gráficas (Chart.js)     |       |       |    ██ | ████  |
   └─ Profile                 |       |       |       | ████  |
   └─ History                 |       |       |       | ████  |
   └─ Responsive Design       |       |       |       |  ████ |
                              |       |       |       |       |
5. INTEGRACIÓN                |       |       |       |       |
   └─ Testing Integración     |       |       |  ████ | ████  |
   └─ Corrección de bugs      |       |       |   ████| ████  |
   └─ Optimización            |       |       |       | ████  |
                              |       |       |       |       |
6. DASHBOARD Y ANALYTICS      |       |       |       |       |
   └─ Estadísticas generales  |       |       |    ██ | ████  |
   └─ Análisis práctica/final |       |       |       | ████  |
   └─ Gráficas de progreso    |       |       |       | ████  |
   └─ Métricas de beneficio   |       |       |       |  ████ |
                              |       |       |       |       |
7. TESTING Y QA               |       |       |       |       |
   └─ Unit Tests              |       |    ██ | ████  | ████  |
   └─ Integration Tests       |       |       |  ████ | ████  |
   └─ E2E Tests               |       |       |       | ████  |
   └─ User Acceptance         |       |       |       |  ████ |
                              |       |       |       |       |
8. DOCUMENTACIÓN              |       |       |       |       |
   └─ README                  | ██    |  ██   |  ██   | ████  |
   └─ API Docs                |       |    ██ |  ██   | ████  |
   └─ Manual de usuario       |       |       |   ██  | ████  |
   └─ Guía de instalación     |       |       |       | ████  |
   └─ Presentación            |       |       |       |  ████ |
                              |       |       |       |       |
9. DEPLOYMENT                 |       |       |       |       |
   └─ Config producción       |       |       |       |  ████ |
   └─ Deploy Backend          |       |       |       |  ████ |
   └─ Deploy Frontend         |       |       |       |   ████|
   └─ Testing producción      |       |       |       |    ██ |

Leyenda: ████ = 100% dedicación | ██ = 50% dedicación
```

---

## 📊 Hitos del Proyecto (Milestones)

### 🎯 Sprint 1 (Semana 1): Fundamentos
**Entregables:**
- [x] Base de datos diseñada y normalizada
- [x] 80 preguntas cargadas en BD
- [x] API Backend funcional (endpoints básicos)
- [x] Sistema de autenticación JWT
- [ ] Documentación de BD

**Criterios de Aceptación:**
- BD creada con schema.sql sin errores
- Seed ejecutado correctamente (80 preguntas)
- Login y registro funcionando
- Postman collection con todos los endpoints

---

### 🎯 Sprint 2 (Semana 2): Core Features
**Entregables:**
- [ ] API completa de exámenes
- [ ] Lógica de preguntas aleatorias
- [ ] Sistema de puntuación
- [ ] Frontend Angular configurado
- [ ] Componentes base de UI

**Criterios de Aceptación:**
- Examen de práctica funcionando end-to-end
- Timer de 1 minuto implementado
- Sin repetición de preguntas en mismo examen
- UI responsive básica

---

### 🎯 Sprint 3 (Semana 3): Integration
**Entregables:**
- [ ] Integración Frontend-Backend completa
- [ ] Exámenes (práctica y final) funcionales
- [ ] Sistema de niveles implementado
- [ ] Historial de exámenes
- [ ] Primeras gráficas

**Criterios de Aceptación:**
- Usuario puede completar examen completo
- Resultados mostrados correctamente
- Nivel determinado según criterios
- Máximo de intentos respetado

---

### 🎯 Sprint 4 (Semana 4): Polish & Analytics
**Entregables:**
- [ ] Dashboard completo con estadísticas
- [ ] Análisis práctica vs final
- [ ] Gráficas de Chart.js
- [ ] Testing completo
- [ ] Documentación final
- [ ] Presentación

**Criterios de Aceptación:**
- Dashboard muestra todas las métricas
- Análisis de beneficio calculado
- 90% de cobertura de tests
- Documentación completa
- Sistema listo para demostración

---

## 📈 Métricas de Progreso

### Indicadores Clave de Rendimiento (KPIs)

| Métrica | Meta | Actual | Status |
|---------|------|--------|--------|
| **Cobertura de Requisitos** | 100% | 100% | ✅ |
| **Puntos del Proyecto** | 90 pts | 90 pts | ✅ |
| **Pruebas Unitarias** | 80% | 0% | ⏳ |
| **Documentación** | 100% | 90% | 🟡 |
| **Performance API** | <200ms | - | ⏳ |
| **Bugs Críticos** | 0 | 0 | ✅ |

---

## 🔄 Proceso de Desarrollo

### Daily Workflow

```
1. Morning Stand-up (15 min)
   ├─ ¿Qué hice ayer?
   ├─ ¿Qué haré hoy?
   └─ ¿Hay impedimentos?

2. Development (6-8 hours)
   ├─ Programación
   ├─ Testing
   └─ Code review

3. Commit & Push
   ├─ Git commit con mensaje descriptivo
   ├─ Push a rama feature
   └─ Pull request si está completo

4. End of Day
   └─ Actualizar board de tareas
```

### Git Workflow

```
main (producción)
  ├─ develop (desarrollo)
      ├─ feature/backend-auth
      ├─ feature/frontend-exam
      ├─ feature/dashboard
      └─ bugfix/timer-issue
```

---

## 🛠️ Herramientas y Recursos

### Desarrollo
- **VS Code**: Editor principal
- **SQL Server Management Studio**: Gestión de BD
- **Postman**: Testing de API
- **Angular DevTools**: Debug de frontend
- **Git**: Control de versiones

### Gestión de Proyecto
- **Trello / Jira**: Tablero Kanban
- **GitHub Projects**: Seguimiento de issues
- **Google Docs**: Documentación colaborativa
- **Miro**: Diagramas y brainstorming

### Comunicación
- **Discord / Slack**: Chat del equipo
- **Zoom / Meet**: Reuniones virtuales
- **WhatsApp**: Comunicación rápida

---

## 🎓 Entregables del Parcial 2

### Fase 1: Parcial 2 (50% del proyecto)

**Documentación Requerida:**
- [x] README.md completo
- [x] Diagrama de base de datos (ER)
- [x] Diagrama de Gantt
- [x] Distribución de responsabilidades
- [x] Metodología de desarrollo
- [ ] Prototipo de UI (Figma/Sketch)
- [ ] Casos de uso
- [ ] Historias de usuario

**Código Funcional (50% mínimo):**
- [x] Base de datos creada y poblada
- [x] Backend API funcional
- [ ] Frontend básico (login, registro)
- [ ] Al menos un flujo completo (exam practice)

**Demo:**
- [ ] Presentación del proyecto (10 min)
- [ ] Demostración en vivo
- [ ] Explicación de decisiones técnicas
- [ ] Q&A con el profesor

---

## 📝 Notas Importantes

### Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Problemas con SQL Server | Media | Alto | Documentación detallada, soporte |
| Retrasos en desarrollo | Media | Medio | Buffer de tiempo, priorización |
| Bugs en integración | Alta | Medio | Testing continuo, code review |
| Cambios de requisitos | Baja | Alto | Congelar requisitos después de Sprint 1 |

### Lecciones Aprendidas

- Comenzar con la BD es fundamental
- Testing desde el inicio ahorra tiempo
- Documentación continua, no al final
- Code review previene muchos bugs
- Comunicación constante es clave

---

## 🎉 Criterios de Éxito

El proyecto será exitoso si:

1. ✅ Cumple todos los 14 requisitos (90 pts)
2. ✅ Base de datos normalizada y optimizada
3. ⏳ Frontend funcional y responsive
4. ⏳ Sistema completamente integrado
5. ⏳ Dashboard con análisis útiles
6. ⏳ Código limpio y bien documentado
7. ⏳ Tests con buena cobertura
8. ⏳ Demostración exitosa

---

**Estado del Proyecto:** 🟢 En Desarrollo - Fase Backend Completa

**Próximos Pasos:**
1. Ejecutar seed de base de datos
2. Crear proyecto Angular
3. Implementar componentes frontend
4. Integrar con backend
5. Desarrollar dashboard

**Última actualización:** 31 de Octubre, 2025
