# Admin Panel Backend

Backend API REST construido con NestJS para un sistema de gestión comercial.

## 🚀 Características

- **Autenticación JWT** - Sistema de login y registro seguro
- **Gestión de Usuarios** - CRUD completo con roles (Admin, Manager, Employee)
- **Catálogo de Productos** - Gestión completa de inventario
- **Gestión de Clientes** - Base de datos de clientes con historial
- **Sistema de Pedidos** - Procesamiento completo de órdenes
- **Documentación API** - Swagger UI integrado
- **Base de Datos** - PostgreSQL con TypeORM
- **Validaciones** - Validación automática de datos
- **CORS** - Configurado para frontend Angular

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar e instalar dependencias:**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env con tu configuración
   ```

3. **Configurar base de datos PostgreSQL:**
   - Crear una base de datos PostgreSQL
   - Actualizar las credenciales en `.env`

4. **Ejecutar migraciones y seeds:**
   ```bash
   npm run seed
   ```

5. **Iniciar el servidor:**
   ```bash
   npm run start:dev
   ```

## 🌐 URLs Importantes

- **API Base:** `http://localhost:3000`
- **Documentación Swagger:** `http://localhost:3000/api/docs`
- **Health Check:** `http://localhost:3000/health`

## 📚 API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `GET /auth/profile` - Obtener perfil
- `GET /auth/validate` - Validar token

### Usuarios
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `GET /users/:id` - Obtener usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Productos
- `GET /products` - Listar productos
- `POST /products` - Crear producto
- `GET /products/:id` - Obtener producto
- `PATCH /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto
- `GET /products/low-stock` - Productos con stock bajo

### Clientes
- `GET /clients` - Listar clientes
- `POST /clients` - Crear cliente
- `GET /clients/:id` - Obtener cliente
- `PATCH /clients/:id` - Actualizar cliente
- `DELETE /clients/:id` - Eliminar cliente
- `GET /clients/:id/stats` - Estadísticas del cliente

### Pedidos
- `GET /orders` - Listar pedidos
- `POST /orders` - Crear pedido
- `GET /orders/:id` - Obtener pedido
- `PATCH /orders/:id` - Actualizar pedido
- `DELETE /orders/:id` - Eliminar pedido
- `GET /orders/stats` - Estadísticas de pedidos

## 🔐 Autenticación

Todas las rutas (excepto `/auth/login` y `/auth/register`) requieren autenticación JWT.

### Headers requeridos:
```
Authorization: Bearer <jwt_token>
```

### Roles de usuario:
- **ADMIN**: Acceso completo al sistema
- **MANAGER**: Gestión de productos, clientes y pedidos
- **EMPLOYEE**: Consulta y procesamiento de pedidos

## 🎯 Usuarios de Prueba

Después de ejecutar `npm run seed`:

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@admin.com | admin123 | ADMIN |
| manager@admin.com | manager123 | MANAGER |
| employee@admin.com | employee123 | EMPLOYEE |

## 🗃️ Estructura del Proyecto

```
src/
├── auth/              # Módulo de autenticación
├── users/             # Gestión de usuarios
├── products/          # Catálogo de productos
├── clients/           # Gestión de clientes
├── orders/            # Sistema de pedidos
├── common/            # Utilidades compartidas
├── database/          # Configuración y seeds
├── app.module.ts      # Módulo principal
└── main.ts           # Punto de entrada
```

## 🔧 Scripts Disponibles

- `npm run start:dev` - Servidor en modo desarrollo
- `npm run start:prod` - Servidor en producción
- `npm run build` - Compilar proyecto
- `npm run seed` - Ejecutar seeds de datos
- `npm run test` - Ejecutar tests
- `npm run lint` - Verificar código

## 🐳 Docker (Opcional)

Si prefieres usar Docker:

```bash
# Construir imagen
docker build -t admin-backend .

# Ejecutar contenedor
docker run -p 3000:3000 admin-backend
```

## 📊 Monitoring y Logs

El servidor incluye:
- Logs detallados en desarrollo
- Validación automática de requests
- Manejo de errores centralizado
- Respuestas estandarizadas

## 🤝 Integración con Frontend

El backend está configurado para trabajar con Angular:
- CORS habilitado para `http://localhost:4200`
- Respuestas en formato JSON estándar
- Documentación Swagger disponible

## 🚨 Troubleshooting

### Error de conexión a base de datos:
1. Verificar que PostgreSQL esté ejecutándose
2. Validar credenciales en `.env`
3. Confirmar que la base de datos existe

### Error de JWT:
1. Verificar que `JWT_SECRET` esté configurado
2. Asegurar que el token no haya expirado
3. Validar formato del header Authorization

## 📝 Changelog

- **v1.0.0** - Release inicial con funcionalidades base
  - Autenticación JWT
  - CRUD completo para todas las entidades
  - Documentación Swagger
  - Sistema de seeds
