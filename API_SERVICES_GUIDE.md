# 📡 Servicios API - Documentación

## 🎯 Servicios Creados

He creado servicios completos para conectar el frontend con tu backend:

### 1. **CustomersApiService** (`api.ts`)
- ✅ CRUD completo de clientes
- ✅ Filtros y paginación
- ✅ Búsqueda
- ✅ Estadísticas
- ✅ Exportar a CSV
- ✅ Historial de pedidos

### 2. **ProductsApiService** (`products-api.service.ts`)
- ✅ CRUD completo de productos
- ✅ Gestión de stock
- ✅ Categorías y marcas
- ✅ Upload de imágenes
- ✅ Estadísticas

### 3. **SalesApiService** (`sales-api.service.ts`)
- ✅ CRUD completo de ventas
- ✅ Estados de pago
- ✅ Reportes y estadísticas
- ✅ Facturas PDF
- ✅ Exportar datos

### 4. **BaseApiService** (`base-api.service.ts`)
- ✅ Funcionalidades comunes
- ✅ Manejo de errores centralizado
- ✅ Headers de autenticación automáticos
- ✅ Upload de archivos

### 5. **LoadingService** & **ApiInterceptor**
- ✅ Indicadores de carga automáticos
- ✅ Manejo de tokens JWT
- ✅ Interceptor para todas las llamadas API

## 🚀 Cómo Usar los Servicios

### Ejemplo: Listar Clientes

\`\`\`typescript
import { Component, OnInit } from '@angular/core';
import { CustomersApiService, Customer, CustomerFilters } from './api';

@Component({
  selector: 'app-customers',
  template: \`
    <div>
      <!-- Lista de clientes -->
      @for (customer of customers; track customer.id) {
        <div class="customer-card">
          <h3>{{ customer.firstName }} {{ customer.lastName }}</h3>
          <p>{{ customer.email }}</p>
          <p>Total gastado: {{ customer.totalSpent | currency }}</p>
        </div>
      }
    </div>
  \`
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 0;

  constructor(private customersApi: CustomersApiService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    
    // Filtros opcionales
    const filters: CustomerFilters = {
      isActive: true,
      search: 'john' // Buscar por nombre/email
    };

    this.customersApi.getCustomers(this.currentPage, 10, filters)
      .subscribe({
        next: (response) => {
          this.customers = response.customers;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error:', error.message);
          this.loading = false;
        }
      });
  }

  createCustomer() {
    const newCustomer = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      phone: '+1234567890'
    };

    this.customersApi.createCustomer(newCustomer)
      .subscribe({
        next: (customer) => {
          console.log('Cliente creado:', customer);
          this.loadCustomers(); // Recargar lista
        },
        error: (error) => {
          console.error('Error:', error.message);
        }
      });
  }
}
\`\`\`

### Ejemplo: Dashboard con Estadísticas

\`\`\`typescript
import { Component, OnInit } from '@angular/core';
import { CustomersApiService } from '../customers/api';
import { ProductsApiService } from '../products/products-api.service';
import { SalesApiService } from '../sales/sales-api.service';

@Component({
  selector: 'app-dashboard',
  template: \`
    <div class="dashboard">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Clientes</h3>
          <p>{{ customerStats?.total || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>Productos</h3>
          <p>{{ productStats?.total || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>Ventas del Mes</h3>
          <p>{{ salesStats?.totalRevenue || 0 | currency }}</p>
        </div>
      </div>
    </div>
  \`
})
export class DashboardComponent implements OnInit {
  customerStats: any;
  productStats: any;
  salesStats: any;

  constructor(
    private customersApi: CustomersApiService,
    private productsApi: ProductsApiService,
    private salesApi: SalesApiService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Cargar estadísticas en paralelo
    this.customersApi.getCustomerStats().subscribe(stats => {
      this.customerStats = stats;
    });

    this.productsApi.getProductStats().subscribe(stats => {
      this.productStats = stats;
    });

    this.salesApi.getSalesStats('month').subscribe(stats => {
      this.salesStats = stats;
    });
  }
}
\`\`\`

## 🔧 Configuración Necesaria

### 1. **Environment**
Ya creé los archivos de environment:
- \`src/environments/environment.ts\` (desarrollo)
- \`src/environments/environment.prod.ts\` (producción)

### 2. **App Config**
Añade estos providers a tu \`app.config.ts\`:

\`\`\`typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApiInterceptor } from './shared/interceptors/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    provideHttpClient(withInterceptors([ApiInterceptor])),
    // ... resto de providers
  ]
};
\`\`\`

### 3. **Loading Component**
Añade el componente de loading a tu layout principal:

\`\`\`typescript
// En main-layout.component.ts
import { LoadingComponent } from '../shared/components/loading/loading.component';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterModule, LoadingComponent],
  template: \`
    <!-- Tu layout actual -->
    <div class="layout">
      <!-- contenido -->
    </div>
    
    <!-- Loading overlay -->
    <app-loading></app-loading>
  \`
})
\`\`\`

## 🌐 Endpoints del Backend

Los servicios esperan estos endpoints en tu backend:

### Customers
- \`GET /api/customers\` - Lista con filtros
- \`GET /api/customers/:id\` - Cliente específico
- \`POST /api/customers\` - Crear cliente
- \`PUT /api/customers/:id\` - Actualizar cliente
- \`DELETE /api/customers/:id\` - Eliminar cliente
- \`GET /api/customers/stats\` - Estadísticas

### Products
- \`GET /api/products\` - Lista con filtros
- \`POST /api/products\` - Crear producto
- \`PUT /api/products/:id\` - Actualizar producto
- \`PATCH /api/products/:id/stock\` - Actualizar stock

### Sales
- \`GET /api/sales\` - Lista de ventas
- \`POST /api/sales\` - Crear venta
- \`PATCH /api/sales/:id/payment\` - Procesar pago
- \`GET /api/sales/stats\` - Estadísticas

## 🛡️ Características de Seguridad

- ✅ **Autenticación JWT** automática en todas las llamadas
- ✅ **Manejo de errores** centralizado
- ✅ **Logout automático** cuando el token expira
- ✅ **Loading states** automáticos
- ✅ **Type safety** con TypeScript
- ✅ **Validación de respuestas**

## 📝 Próximos Pasos

1. **Configurar el interceptor** en app.config.ts
2. **Añadir loading component** al layout
3. **Actualizar componentes** para usar los nuevos servicios
4. **Probar conexión** con tu backend
5. **Ajustar endpoints** según tu API

¡Los servicios están listos para conectar con tu backend! 🚀
