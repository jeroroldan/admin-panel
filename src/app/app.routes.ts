import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';

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
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
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

  // Rutas protegidas con layout principal
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/main-layout.component').then((m) => m.MainLayoutComponent),
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
          import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent),
        title: 'Dashboard - Admin Panel',
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'products',
        canActivate: [RoleGuard],
        loadComponent: () =>
          import('./pages/products/products').then((m) => m.ProductsComponent),
        title: 'Products - Admin Panel',
        data: { breadcrumb: 'Products', roles: ['admin', 'manager'] },
      },
      {
        path: 'sales',
        canActivate: [RoleGuard],
        loadComponent: () =>
          import('./pages/sales/sales').then((m) => m.SalesComponent),
        title: 'Sales - Admin Panel',
        data: { breadcrumb: 'Sales', roles: ['admin', 'manager', 'employee'] },
      },
      {
        path: 'customers',
        canActivate: [RoleGuard],
        loadComponent: () =>
          import('./pages/customers/customers').then((m) => m.CustomersComponent),
        title: 'Customers - Admin Panel',
        data: { breadcrumb: 'Customers', roles: ['admin', 'manager'] },
      },
      // Ruta futura para configuraciones
      // {
      //   path: 'settings',
      //   canActivate: [RoleGuard],
      //   loadComponent: () =>
      //     import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
      //   title: 'Settings - Admin Panel',
      //   data: { breadcrumb: 'Settings', roles: ['admin'] },
      // },
    ],
  },

  // Página de error 404
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found').then((m) => m.NotFoundComponent),
    title: 'Page Not Found - Admin Panel',
  },
];
