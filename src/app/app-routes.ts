import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { UserRole } from './auth';

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
          import('./pages/customers/index/list').then(
            (m) => m.CustomersList
          ),
        title: 'Customers - Admin Panel',
        data: {
          breadcrumb: 'Customers',
          roles: ['admin', 'manager'] as UserRole[], // ✅ Tipado correcto
        },
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
