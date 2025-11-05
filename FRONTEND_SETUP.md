# Instrucciones para crear el Frontend con Angular

## Pasos para crear el proyecto Angular

### 1. Navegar a la carpeta del proyecto

```powershell
cd c:\Users\alani\OneDrive\Documentos\Simulacion\Proyecto_ORDI\english-exam-simulator
```

### 2. Crear el proyecto Angular

```powershell
ng new frontend --routing --style=scss
```

Cuando pregunte:
- Would you like to add Angular routing? **Yes**
- Which stylesheet format would you like to use? **SCSS**

### 3. Navegar al proyecto frontend

```powershell
cd frontend
```

### 4. Instalar dependencias adicionales

```powershell
npm install @angular/material @angular/cdk
npm install chart.js ng2-charts
npm install jwt-decode
npm install ngx-toastr
npm install @angular/animations
```

### 5. Estructura de archivos a crear

Después de la instalación, ejecutar estos comandos para generar los componentes:

```powershell
# Generar servicios
ng generate service core/services/auth
ng generate service core/services/exam
ng generate service core/services/question
ng generate service core/services/dashboard
ng generate service core/services/api

# Generar guards
ng generate guard core/guards/auth

# Generar interceptors
ng generate interceptor core/interceptors/auth

# Generar componentes de páginas
ng generate component pages/login
ng generate component pages/register
ng generate component pages/dashboard
ng generate component pages/exam-selection
ng generate component pages/exam-practice
ng generate component pages/exam-result
ng generate component pages/profile
ng generate component pages/history

# Generar componentes compartidos
ng generate component shared/navbar
ng generate component shared/timer
ng generate component shared/question-card
ng generate component shared/loading-spinner

# Generar modelos
mkdir src\app\core\models
```

### 6. Archivos que se crearán manualmente

Los siguientes archivos serán creados con contenido específico:

- `src/app/core/models/*.ts` - Modelos de datos
- `src/app/core/services/*.service.ts` - Servicios
- `src/app/core/guards/auth.guard.ts` - Guard de autenticación
- `src/app/core/interceptors/auth.interceptor.ts` - Interceptor HTTP
- `src/app/app-routing.module.ts` - Rutas de la aplicación
- `src/app/app.module.ts` - Módulo principal
- `src/environments/environment.ts` - Variables de entorno
- Todos los componentes con su HTML, SCSS y TypeScript

## 7. Ejecutar el proyecto

```powershell
ng serve --open
```

El proyecto estará disponible en: `http://localhost:4200`

---

## Notas Importantes

1. **Angular CLI**: Asegúrate de tener Angular CLI instalado globalmente:
   ```powershell
   npm install -g @angular/cli
   ```

2. **Versión de Node**: Se recomienda Node.js v16 o superior

3. **Backend**: El backend debe estar corriendo en `http://localhost:3000`

4. **CORS**: Ya está configurado en el backend con el middleware cors()

---

## Próximos pasos

Una vez creada la estructura base con los comandos anteriores, se procederá a:

1. Configurar el módulo principal y el routing
2. Implementar los servicios con llamadas a la API
3. Desarrollar los componentes de UI
4. Configurar Angular Material
5. Implementar el sistema de autenticación
6. Crear los componentes del examen con timer
7. Desarrollar el dashboard con gráficas
8. Agregar validaciones y manejo de errores
9. Optimizar la experiencia de usuario

