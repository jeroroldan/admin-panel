import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomersIndexStore } from './index-store';
import { Customer } from './customer-model';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Clientes
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Administra tus relaciones con los clientes
          </p>
        </div>
        <div class="flex gap-3 mt-4 sm:mt-0">
          <button (click)="navigateToCreate()" class="btn-primary">
            <svg
              class="w-4 h-4 mr-2 -ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Agregar Cliente
          </button>
        </div>
      </div>

      <!-- Customer Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="card">
          <p class="text-sm text-gray-600 dark:text-gray-400">Total Clientes</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {{ store.stats().totalCustomers }}
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Clientes Activos
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {{ store.stats().activeCustomers }}
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Promedio Gastado
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {{ formatCurrency(store.stats().averageSpent) }}
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 dark:text-gray-400">Total Pedidos</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {{ store.stats().totalOrders }}
          </p>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="card mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                [value]="store.filters().search || ''"
                (input)="onSearchChange($event)"
                placeholder="Buscar clientes por nombre o email..."
                class="input-field pl-10"
              />
            </div>
          </div>
          <select
            [value]="
              store.filters().isActive !== undefined
                ? store.filters().isActive
                : ''
            "
            (change)="onStatusFilterChange($event)"
            class="input-field w-full lg:w-48"
          >
            <option value="">Todos los Estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
          <button
            (click)="clearFilters()"
            class="btn-secondary w-full lg:w-auto"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Error Message -->
      @if (store.error()) {
      <div
        class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
      >
        {{ store.error() }}
        <button
          (click)="store.clearError()"
          class="ml-2 text-red-600 hover:text-red-800"
        >
          ×
        </button>
      </div>
      }

      <!-- Loading State -->
      @if (store.isLoading()) {
      <div class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
        ></div>
        <span class="ml-2 text-gray-600 dark:text-gray-400"
          >Cargando clientes...</span
        >
      </div>
      }

      <!-- Customers Grid -->
      @if (!store.isLoading() && store.hasCustomers()) {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        @for (customer of store.customers(); track customer.id) {
        <div class="card hover:shadow-md transition-shadow duration-200">
          <div class="flex items-start space-x-4">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center"
              >
                <span class="text-white font-medium">{{
                  getInitials(customer.firstName + ' ' + customer.lastName)
                }}</span>
              </div>
            </div>

            <!-- Customer Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div>
                  <h3
                    class="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{ customer.firstName }} {{ customer.lastName }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ customer.email }}
                  </p>
                  @if (customer.phone) {
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ customer.phone }}
                  </p>
                  }
                </div>
                <span
                  [class]="
                    customer.isActive ? 'badge-success' : 'badge-warning'
                  "
                >
                  {{ customer.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </div>

              <!-- Customer Details -->
              <div class="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Total Gastado</p>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(customer.totalSpent) }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Pedidos</p>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ customer.totalOrders }}
                  </p>
                </div>
              </div>

              @if (customer.address || customer.city || customer.country) {
              <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <svg
                  class="inline w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {{ getCustomerAddress(customer) }}
              </div>
              }

              <!-- Actions -->
              <div class="mt-4 flex gap-2">
                <button
                  (click)="viewCustomer(customer.id)"
                  class="text-xs btn-secondary py-1 px-2"
                >
                  Ver Detalles
                </button>
                <button
                  (click)="editCustomer(customer.id)"
                  class="text-xs btn-primary py-1 px-2"
                >
                  Editar
                </button>
                <button
                  (click)="deleteCustomer(customer)"
                  class="text-xs bg-red-100 hover:bg-red-200 text-red-700 py-1 px-2 rounded-md transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
        }
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Mostrando {{ store.paginationInfo().showingFrom }} a
          {{ store.paginationInfo().showingTo }} de
          {{ store.paginationInfo().total }} clientes
        </div>
        <div class="flex gap-2">
          <button
            (click)="previousPage()"
            [disabled]="!store.paginationInfo().hasPreviousPage"
            class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
            Página {{ store.paginationInfo().page }} de
            {{ store.paginationInfo().totalPages }}
          </span>
          <button
            (click)="nextPage()"
            [disabled]="!store.paginationInfo().hasNextPage"
            class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
      }

      <!-- Empty State -->
      @if (!store.isLoading() && !store.hasCustomers()) {
      <div class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No se encontraron clientes
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          Comienza agregando tu primer cliente.
        </p>
        <button class="btn-primary" (click)="navigateToCreate()">
          Agregar Cliente
        </button>
      </div>
      }
    </div>
  `,
})
export class CustomersList implements OnInit {
  store = inject(CustomersIndexStore);
  private router = inject(Router);

  ngOnInit() {
    this.store.loadCustomers();
  }

  // Navigation methods
  navigateToCreate() {
    this.router.navigate(['/customers/create']);
  }

  viewCustomer(id: string) {
    this.router.navigate(['/customers', id]);
  }

  editCustomer(id: string) {
    this.router.navigate(['/customers', id, 'edit']);
  }

  // Filter methods
  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.store.updateFilter('search', target.value);
  }

  onStatusFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value === '' ? undefined : target.value === 'true';
    this.store.updateFilter('isActive', value);
  }

  clearFilters() {
    this.store.clearFilters();
  }

  // Pagination methods
  previousPage() {
    this.store.previousPage();
  }

  nextPage() {
    this.store.nextPage();
  }

  // Delete method
  deleteCustomer(customer: Customer) {
    if (
      confirm(
        `¿Estás seguro de que quieres eliminar a ${customer.firstName} ${customer.lastName}?`
      )
    ) {
      this.store.removeCustomerFromList(customer.id);
    }
  }

  // Utility methods
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  getCustomerAddress(customer: Customer): string {
    const parts = [customer.address, customer.city, customer.country].filter(
      Boolean
    );
    return parts.join(', ');
  }
}
