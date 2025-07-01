// dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-8 mb-8 text-white shadow-lg">
      <h2 class="text-3xl font-bold mb-2">¡Bienvenido al Dashboard!</h2>
      <p class="text-indigo-100">Gestiona tu aplicación desde este panel centralizado</p>
      @if (getCurrentUser()) {
        <p class="text-indigo-100 mt-2">
          Hola, <span class="font-semibold">{{ getCurrentUser()?.firstName }} {{ getCurrentUser()?.lastName }}</span>
        </p>
      }
    </div>

    <!-- User Information Card -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Información de Usuario</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">Nombre Completo:</p>
          <p class="text-lg text-gray-900">{{ getCurrentUser()?.firstName }} {{ getCurrentUser()?.lastName }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">Email:</p>
          <p class="text-lg text-gray-900">{{ getCurrentUser()?.email }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">Rol:</p>
          <span [class]="'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ' + getRoleClass(getCurrentUser()?.role)">
            {{ getCurrentUser()?.role }}
          </span>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">Estado:</p>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span class="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
            Activo
          </span>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Productos</p>
            <p class="text-2xl font-bold text-gray-900">1,234</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Ventas del Mes</p>
            <p class="text-2xl font-bold text-gray-900">$45,678</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Clientes</p>
            <p class="text-2xl font-bold text-gray-900">2,567</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pedidos Pendientes</p>
            <p class="text-2xl font-bold text-gray-900">42</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Role-based Access Cards -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Control de Acceso por Rol</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- General Dashboard Card -->
        <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">Dashboard General</h3>
              <p class="text-sm text-gray-500">Acceso para todos los usuarios</p>
            </div>
          </div>
        </div>

        <!-- Admin & Manager Card -->
        @if (hasAnyRole(['admin', 'manager'])) {
          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                    <path fill-rule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 011 1v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 1a1 1 0 000 2h4a1 1 0 100-2H8z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">Gestión de Productos</h3>
                <p class="text-sm text-gray-500">Solo para Admin y Manager</p>
              </div>
            </div>
          </div>
        }

        <!-- Admin Only Card -->
        @if (hasRole('admin')) {
          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">Configuración</h3>
                <p class="text-sm text-gray-500">Solo para Administradores</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a routerLink="/products" class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <div>
            <h3 class="font-semibold text-gray-900">Gestionar Productos</h3>
            <p class="text-sm text-gray-600">Agregar, editar o eliminar productos</p>
          </div>
        </a>

        <a routerLink="/sales" class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <div>
            <h3 class="font-semibold text-gray-900">Ver Ventas</h3>
            <p class="text-sm text-gray-600">Analizar reportes de ventas</p>
          </div>
        </a>

        <a routerLink="/customers" class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
          <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <div>
            <h3 class="font-semibold text-gray-900">Gestionar Clientes</h3>
            <p class="text-sm text-gray-600">Ver y administrar clientes</p>
          </div>
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {
  constructor(
    private authService: AuthService
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
}
