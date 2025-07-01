# Sistema de Autenticación Angular

Este proyecto incluye un sistema completo de autenticación con JWT para Angular, que incluye pantallas de login y registro con validaciones, guards de autorización, y gestión de roles.

## 🚀 Características

- ✅ **Pantallas de Login y Registro** con diseño moderno usando Tailwind CSS
- ✅ **Validaciones de formularios** con mensajes de error personalizados
- ✅ **Guards de Autenticación** para proteger rutas
- ✅ **Guards de Autorización** por roles (admin, manager, employee)
- ✅ **Interceptor HTTP** para manejo automático de tokens JWT
- ✅ **Gestión de estado** de autenticación
- ✅ **Manejo de errores** y redirecciones automáticas

## 🔧 Componentes Creados

### 1. Componentes de UI
- `LoginComponent` - Pantalla de inicio de sesión
- `RegisterComponent` - Pantalla de registro de usuarios

### 2. Servicios
- `AuthService` - Gestión de autenticación, tokens y estado

### 3. Guards
- `AuthGuard` - Protege rutas que requieren autenticación
- `RoleGuard` - Protege rutas por roles específicos

### 4. Interceptores
- `authInterceptor` - Agrega automáticamente el token JWT a las peticiones HTTP

## 🎨 Diseño con Tailwind CSS

Los componentes utilizan clases de Tailwind CSS para un diseño moderno y responsivo:

- **Gradientes**: `bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500`
- **Sombras**: `shadow-2xl`
- **Animaciones**: `hover:-translate-y-0.5 transition-all duration-200`
- **Estados de validación**: Colores dinámicos para errores (`border-red-500`, `bg-red-50`)

## 🛡️ Configuración de Rutas

### Rutas Públicas (sin autenticación)
```typescript
{
  path: 'auth',
  children: [
    { path: 'login', loadComponent: () => import('./auth/login/login') },
    { path: 'register', loadComponent: () => import('./auth/register/register.component') }
  ]
}
```

### Rutas Protegidas (con autenticación)
```typescript
{
  path: 'dashboard',
  canActivate: [AuthGuard],
  loadComponent: () => import('./pages/dashboard/dashboard')
}
```

### Rutas con Autorización por Roles
```typescript
{
  path: 'products',
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['admin', 'manager'] },
  loadComponent: () => import('./pages/products/products')
}
```

## 📋 Uso del Sistema

### 1. Autenticación Básica

```typescript
// En cualquier componente
constructor(private authService: AuthService) {}

// Verificar si está autenticado
if (this.authService.isAuthenticated()) {
  // Usuario autenticado
}

// Obtener datos del usuario
const user = this.authService.getCurrentUser();
```

### 2. Verificación de Roles

```typescript
// Verificar si tiene un rol específico
if (this.authService.hasRole('admin')) {
  // Usuario es administrador
}

// Verificar si tiene cualquiera de varios roles
if (this.authService.hasAnyRole(['admin', 'manager'])) {
  // Usuario es admin o manager
}
```

### 3. Protección de Rutas

```typescript
// Aplicar guards en las rutas
{
  path: 'admin',
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['admin'] },
  children: [
    // Rutas del admin
  ]
}
```

## 🔒 Seguridad

### Interceptor HTTP
- Agrega automáticamente el token JWT a todas las peticiones HTTP
- Maneja errores 401 (no autorizado) redirigiendo al login
- Limpia el token cuando es inválido

### Validaciones
- **Email**: Formato válido requerido
- **Contraseña**: Mínimo 6 caracteres
- **Confirmación**: Las contraseñas deben coincidir
- **Campos requeridos**: Validación en tiempo real

## 🎯 Estructura de Archivos

```
src/app/auth/
├── guards/
│   ├── auth.guard.ts          # Guard de autenticación
│   └── role.guard.ts          # Guard de autorización por roles
├── login/
│   └── login.ts               # Componente de login
├── register/
│   └── register.component.ts  # Componente de registro
├── models/
│   └── auth.interface.ts      # Interfaces y tipos
├── auth.service.ts            # Servicio principal de autenticación
├── auth-interceptor.ts        # Interceptor HTTP
└── auth.index.ts             # Exportaciones del módulo
```

## 🚦 Estados de la Aplicación

### Estados de Carga
- Botones deshabilitados durante las peticiones
- Spinners de carga
- Mensajes informativos

### Estados de Error
- Mensajes de error específicos
- Validaciones visuales en formularios
- Manejo de errores de red

### Estados de Éxito
- Confirmaciones de registro
- Redirecciones automáticas
- Mensajes de bienvenida

## 🔄 Flujo de Autenticación

1. **Usuario visita ruta protegida** → Redirigido a `/auth/login`
2. **Usuario ingresa credenciales** → Validación en frontend
3. **Envío al backend** → Verificación de credenciales
4. **Token recibido** → Almacenado en localStorage
5. **Redirección** → A la ruta original o dashboard
6. **Peticiones futuras** → Token incluido automáticamente

## 🛠️ Instalación y Configuración

El sistema está completamente configurado y listo para usar. Solo asegúrate de que:

1. **Tailwind CSS** esté configurado en el proyecto
2. **El backend NestJS** esté ejecutándose
3. **Las rutas** estén correctamente definidas en `app.routes.ts`

## 📝 Ejemplos de Uso

### Componente con Verificación de Roles

```typescript
@Component({...})
export class AdminComponent {
  constructor(private authService: AuthService) {}

  canEditUsers(): boolean {
    return this.authService.hasAnyRole(['admin', 'manager']);
  }

  canDeleteUsers(): boolean {
    return this.authService.hasRole('admin');
  }
}
```

### Template con Autorización

```html
<div *ngIf="authService.hasRole('admin')">
  <button>Panel de Administración</button>
</div>

<div *ngIf="authService.hasAnyRole(['admin', 'manager'])">
  <button>Gestionar Usuarios</button>
</div>
```

¡El sistema de autenticación está completo y listo para usar! 🎉
