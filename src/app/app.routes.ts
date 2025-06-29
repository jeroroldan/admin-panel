import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(
        (m) => m.DashboardComponent
      ),
    data: { breadcrumb: 'Dashboard' },
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products').then(
        (m) => m.ProductsComponent
      ),
    data: { breadcrumb: 'Products' },
  },
  // {
  //   path: 'products/:id',
  //   loadComponent: () =>
  //     import('./pages/products/product-detail').then(
  //       (m) => m.ProductDetailComponent
  //     ),
  //   data: { breadcrumb: 'Product Detail' },
  // },
  {
    path: 'sales',
    loadComponent: () =>
      import('./pages/sales/sales').then((m) => m.SalesComponent),
    data: { breadcrumb: 'Sales' },
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./pages/customers/customers').then(
        (m) => m.CustomersComponent
      ),
    data: { breadcrumb: 'Customers' },
  },
  // {
  //   path: 'settings',
  //   loadComponent: () =>
  //     import('./pages/settings/settings.component').then(
  //       (m) => m.SettingsComponent
  //     ),
  //   data: { breadcrumb: 'Settings' },
  // },
  {
    path: '**',
    loadComponent: () =>
      import('../app/shared/components/not-found/not-found').then(
        (m) => m.NotFoundComponent
      ),
  },
];
