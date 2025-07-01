import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Sidebar -->
      <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0"
           [class.translate-x-0]="sidebarOpen"
           [class.-translate-x-full]="!sidebarOpen">
        <div class="flex h-full flex-col">
          <!-- Logo -->
          <div class="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
            <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 px-4 py-6 space-y-1">
            <a routerLink="/dashboard"
               routerLinkActive="bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
               class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm0 0V9a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
              Dashboard
            </a>

            @if (hasAnyRole(['admin', 'manager'])) {
              <a routerLink="/products"
                 routerLinkActive="bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                 class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                Productos
              </a>
            }

            <a routerLink="/sales"
               routerLinkActive="bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
               class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              Ventas
            </a>

            @if (hasAnyRole(['admin', 'manager'])) {
              <a routerLink="/customers"
                 routerLinkActive="bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                 class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Clientes
              </a>
            }

            @if (hasRole('admin')) {
              <a routerLink="/settings"
                 routerLinkActive="bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                 class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Configuración
              </a>
            }
          </nav>

          <!-- User Info at Bottom -->
          <div class="flex-shrink-0 border-t border-gray-200 p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span class="text-sm font-medium text-indigo-600">
                    {{ getUserInitials() }}
                  </span>
                </div>
              </div>
              <div class="ml-3 flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ getCurrentUser()?.firstName }} {{ getCurrentUser()?.lastName }}
                </p>
                <p class="text-xs text-gray-500 truncate">{{ getCurrentUser()?.role }}</p>
              </div>
              <button
                (click)="logout()"
                class="ml-2 flex-shrink-0 p-1 text-gray-400 hover:text-gray-500">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile sidebar overlay -->
      @if (sidebarOpen) {
        <div class="fixed inset-0 z-40 lg:hidden">
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" (click)="toggleSidebar()"></div>
        </div>
      }

      <!-- Main content -->
      <div class="lg:pl-64">
        <!-- Top bar -->
        <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            (click)="toggleSidebar()">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <!-- Breadcrumbs -->
          <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div class="flex items-center">
              <nav class="flex" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-4">
                  <li>
                    <div>
                      <a routerLink="/dashboard" class="text-gray-400 hover:text-gray-500">
                        <svg class="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                        </svg>
                      </a>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center">
                      <svg class="h-5 w-5 flex-shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z"/>
                      </svg>
                      <span class="ml-4 text-sm font-medium text-gray-500 capitalize">
                        {{ getCurrentPageName() }}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <!-- User menu -->
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"></div>
            <div class="relative">
              <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                    [class]="getRoleClass(getCurrentUser()?.role)">
                {{ getCurrentUser()?.role }}
              </span>
            </div>
          </div>
        </div>

        <!-- Page content -->
        <main class="py-6">
          <div class="px-4 sm:px-6 lg:px-8">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent {
  sidebarOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role as any);
  }

  hasAnyRole(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles as any);
  }

  getRoleClass(role: string | undefined): string {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getUserInitials(): string {
    const user = this.getCurrentUser();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return 'U';
  }

  getCurrentPageName(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'dashboard';
    if (url.includes('/products')) return 'productos';
    if (url.includes('/sales')) return 'ventas';
    if (url.includes('/customers')) return 'clientes';
    if (url.includes('/settings')) return 'configuración';
    return 'inicio';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
