import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { UserRole } from './auth';

import { CustomersComponent } from './pages/customers/customers';

export const routes: Routes = [
  // Rutas de autenticación (públicas, sin layout)
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then((m) => m.LoginComponent),
    title: 'Login - Admin Panel',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register').then((m) => m.Register),
    title: 'Register - Admin Panel',
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        redirectTo: '/login',
        pathMatch: 'full',
      },
      {
        path: 'register',
        redirectTo: '/register',
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/main-layout').then(
        (m) => m.MainLayout
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(
            (m) => m.Dashboard
          ),
        title: 'Dashboard - Admin Panel',
        data: { breadcrumb: 'Dashboard' },
        // ✅ Dashboard accesible para todos los roles autenticados
      },
      {
        path: 'products',
        canActivate: [RoleGuard],
        loadComponent: () =>
          import('./pages/products/products').then((m) => m.ProductsComponent),
        title: 'Products - Admin Panel',
        data: {
          breadcrumb: 'Products',
          roles: ['admin', 'manager'] as UserRole[], // ✅ Tipado correcto
        },
      },
      {
        path: 'sales',
        canActivate: [RoleGuard],
        loadComponent: () =>
          import('./pages/sales/sales').then((m) => m.SalesComponent),
        title: 'Sales - Admin Panel',
        data: {
          breadcrumb: 'Sales',
          roles: ['admin', 'manager', 'employee'] as UserRole[], // ✅ Tipado correcto
        },
      },
      {
        path: 'customers',
        canActivate: [RoleGuard],
        loadComponent: () =>
          import('./pages/customers/customers').then(
            (m) => m.CustomersComponent
          ),
        title: 'Clientes - Admin Panel',
        data: {
          breadcrumb: 'Clientes',
          roles: ['admin', 'manager'] as UserRole[], // ✅ Tipado correcto
        },
      },
      {
        path: 'sales',
        canActivate: [RoleGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/sales/sales').then((m) => m.SalesComponent),
            title: 'Sales - Admin Panel',
            data: {
              breadcrumb: 'Sales',
              roles: ['admin', 'manager', 'employee'] as UserRole[],
            },
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./pages/sales/sales-create').then((m) => m.SalesCreateComponent),
            title: 'Create Sale - Admin Panel',
            data: {
              breadcrumb: 'Create Sale',
              roles: ['admin', 'manager', 'employee'] as UserRole[],
            },
          },
        ],
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found').then(
        (m) => m.NotFoundComponent
      ),
    title: 'Page Not Found - Admin Panel',
  },
];
