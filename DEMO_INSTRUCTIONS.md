# 🚀 Demo Instructions - Admin Panel Modernizado

## 📋 Cómo Probar la Nueva Estructura

### 🔑 Credenciales de Prueba (Modo Desarrollo)

Para probar diferentes roles, usa estas credenciales:

#### Admin (Acceso completo)
- **Email**: `admin@test.com`
- **Password**: cualquier contraseña

#### Manager (Acceso intermedio)
- **Email**: `manager@test.com` 
- **Password**: cualquier contraseña

#### Employee (Acceso básico)
- **Email**: `employee@test.com`
- **Password**: cualquier contraseña

### 🌐 URLs Principales

- **Login**: `http://localhost:4201/login`
- **Register**: `http://localhost:4201/register`
- **Dashboard**: `http://localhost:4201/dashboard` (requiere autenticación)

### 🎯 Qué Probar

1. **Pantallas de Autenticación Separadas**:
   - Ve a `/login` - verás solo la pantalla de login sin sidebar/navegación
   - Ve a `/register` - verás solo la pantalla de registro sin sidebar/navegación
   - Son pantallas completamente independientes con diseño moderno

2. **Dashboard con Layout Principal**:
   - Después del login exitoso, serás redirigido a `/dashboard`
   - Verás el **sidebar** con navegación en la izquierda
   - Verás el **header** con breadcrumbs y botón de logout arriba
   - El contenido del dashboard está **dentro** del layout (sin duplicar header/sidebar)

3. **Navegación por Roles**:
   - **Admin**: Ve todas las opciones (Dashboard, Productos, Ventas, Clientes)
   - **Manager**: Ve Dashboard, Productos, Ventas, Clientes
   - **Employee**: Ve Dashboard y Ventas solamente

4. **Responsive Design**:
   - En móvil/tablet: el sidebar se convierte en un menú hamburguesa
   - En desktop: el sidebar está fijo a la izquierda

### 🔄 Flujo de Navegación

```
Usuario no autenticado → /login (pantalla separada)
                            ↓
Login exitoso → /dashboard (dentro del layout con sidebar)
                            ↓
Navegación → /products, /sales, /customers (todos dentro del layout)
                            ↓
Logout → /login (pantalla separada)
```

### 🎨 Diferencias Visuales Clave

**ANTES**: 
- Dashboard tenía su propio header y navegación interna
- No había separación clara entre auth y contenido protegido

**AHORA**:
- **Auth** (login/register): Pantallas completamente separadas, sin navegación
- **Contenido protegido**: Todo dentro de un layout unificado con sidebar persistente
- **UX mejorada**: Navegación consistente en todas las páginas protegidas

### 🛠️ Tecnologías Implementadas

- ✅ Angular 18+ con standalone components
- ✅ Nueva sintaxis de Angular (`@if`, `@for`)
- ✅ Tailwind CSS para todo el styling
- ✅ Lazy loading para mejor rendimiento
- ✅ Guards para protección de rutas
- ✅ Role-based access control
- ✅ Responsive design moderno

## 🚀 Para Ejecutar

```bash
ng serve --port=4201
```

Luego ve a: `http://localhost:4201`
