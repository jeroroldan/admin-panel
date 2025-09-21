import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CustomersStore } from './customers.store';
import { CustomersCreateModalComponent } from './customers-create-modal';
import { CustomersViewModalComponent } from './customers-view-modal';
import { ButtonComponent } from '../../shared/components/button/button';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomersCreateModalComponent, CustomersViewModalComponent, ButtonComponent],
  template: `
    <div class="animate-fade-in min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Clientes
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestiona la información de tus clientes
          </p>
        </div>
        <div class="flex gap-3 mt-4 sm:mt-0">
          <app-button variant="primary" (clicked)="openNewCustomerModal()" ariaLabel="Crear nuevo cliente">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nuevo Cliente
          </app-button>
          <app-button variant="secondary" [disabled]="true" ariaLabel="Exportar datos">
            <svg class="w-4 h-4 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M7 21h10a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Exportar
          </app-button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-6">
        <form [formGroup]="searchForm" class="flex flex-col md:flex-row gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
            <input
              type="text"
              formControlName="search"
              placeholder="Buscar por nombre, apellido, email o teléfono..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              (input)="onSearchChange($event)"
            >
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
            <select
              formControlName="isActive"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              (change)="onFilterChange()"
            >
              <option [value]="undefined">Todos los estados</option>
              <option [value]="true">Activos</option>
              <option [value]="false">Inactivos</option>
            </select>
          </div>
          <app-button variant="primary" (clicked)="applyFilters()">
            Filtrar
          </app-button>
        </form>
      </div>

      <!-- Error Message -->
      <div *ngIf="store.hasError()" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
        <div class="text-sm text-red-700 dark:text-red-300">
          {{ store.error() }}
        </div>
      </div>

      <!-- Customer Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Clientes</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ store.customerStats().totalCustomers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Clientes Activos</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ store.customerStats().activeCustomers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Con Email</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ store.customerStats().customersWithEmail }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ store.customerStats().emailCoverage.toFixed(1) }}%</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Con Teléfono</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ store.customerStats().customersWithPhone }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ store.customerStats().phoneCoverage.toFixed(1) }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Customers Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative">
        <!-- Loading Overlay -->
        <div *ngIf="store.isLoading()" class="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 flex items-center justify-center z-10">
          <div class="flex items-center space-x-2">
            <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600 dark:text-gray-400">Cargando clientes...</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" role="table" aria-label="Lista de clientes">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr role="row">
                <th class="w-1/4 px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider" role="columnheader" scope="col">Nombre</th>
                <th class="w-1/4 px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider" role="columnheader" scope="col">Contacto</th>
                <th class="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider" role="columnheader" scope="col">Empresa</th>
                <th class="w-1/8 px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider" role="columnheader" scope="col">Estado</th>
                <th class="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider" role="columnheader" scope="col">Fecha Registro</th>
                <th class="w-1/3 px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider" role="columnheader" scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              <tr *ngFor="let customer of store.filteredCustomers(); trackBy: trackByCustomerId" class="hover:bg-gray-50 dark:hover:bg-gray-700" role="row">
                <td class="px-6 py-4 whitespace-nowrap" role="cell">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {{ customer.firstName.charAt(0) }}{{ customer.lastName.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ customer.firstName }} {{ customer.lastName }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" role="cell">
                  <div>
                    <div *ngIf="customer.email">{{ customer.email }}</div>
                    <div *ngIf="customer.phone" class="text-xs">{{ customer.phone }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" role="cell">
                  {{ customer.company || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap" role="cell">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [ngClass]="{
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100': customer.isActive,
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100': !customer.isActive
                        }"
                        [attr.aria-label]="'Estado: ' + (customer.isActive ? 'Activo' : 'Inactivo')">
                    {{ customer.isActive ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" role="cell" [attr.aria-label]="'Fecha de registro: ' + (customer.createdAt | date:'short')">
                  {{ customer.createdAt | date:'short' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" role="cell">
                  <div class="flex space-x-2">
                    <app-button variant="outline" size="sm" (clicked)="viewCustomer(customer)" ariaLabel="Ver detalles del cliente">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      Ver
                    </app-button>
                    <app-button variant="outline" size="sm" (clicked)="editCustomer(customer)" ariaLabel="Editar cliente">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Editar
                    </app-button>
                    <app-button variant="danger" size="sm" (clicked)="deleteCustomer(customer.id)" ariaLabel="Eliminar cliente">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Eliminar
                    </app-button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!store.isLoading() && store.customers().length === 0" class="text-center py-8">
                <td colspan="6" class="text-gray-500 dark:text-gray-400">No se encontraron clientes.</td>
              </tr>
              <tr *ngIf="store.isLoading()" class="text-center py-8">
                <td colspan="6" class="text-gray-500 dark:text-gray-400">Cargando clientes...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="store.totalPages() > 1" class="bg-white dark:bg-gray-800 rounded-lg shadow mt-6 p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <app-button variant="outline" size="sm" [disabled]="!store.hasPrevPage()" (clicked)="store.setPage(store.currentPage() - 1)">Anterior</app-button>
            <app-button variant="outline" size="sm" [disabled]="!store.hasNextPage()" (clicked)="store.setPage(store.currentPage() + 1)">Siguiente</app-button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Mostrando <span class="font-medium">{{ (store.currentPage() - 1) * store.pagination().limit + 1 }}</span> a
                <span class="font-medium">{{ store.currentPage() * store.pagination().limit > store.pagination().total ? store.pagination().total : store.currentPage() * store.pagination().limit }}</span> de
                <span class="font-medium">{{ store.pagination().total }}</span> resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <app-button
                  variant="outline"
                  size="sm"
                  [disabled]="store.currentPage() === 1"
                  (clicked)="store.setPage(1)"
                  ariaLabel="Primera página"
                  [icon]="true"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 111.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </app-button>
                <app-button
                  variant="outline"
                  size="sm"
                  [disabled]="!store.hasPrevPage()"
                  (clicked)="store.setPage(store.currentPage() - 1)"
                  ariaLabel="Página anterior"
                  [icon]="true"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </app-button>
                <span *ngFor="let page of getPages(store.currentPage(), store.totalPages())" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium">
                  <button
                    (click)="store.setPage(page)"
                    [class.bg-blue-50 text-blue-600 border-blue-500]="page === store.currentPage()"
                    [class.hover:bg-blue-100]="page === store.currentPage()"
                    [class.text-gray-500 hover:bg-gray-50 border-gray-300]="page !== store.currentPage()"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:z-20 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600"
                  >
                    {{ page }}
                  </button>
                </span>
                <button
                  (click)="store.setPage(store.currentPage() + 1)"
                  [disabled]="!store.hasNextPage()"
                  class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                >
                  <span class="sr-only">Siguiente</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                  (click)="store.setPage(store.totalPages())"
                  [disabled]="store.currentPage() === store.totalPages()"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                >
                  <span class="sr-only">Última</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586l5.293-5.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Customers Create Modal -->
      <app-customers-create-modal></app-customers-create-modal>

      <!-- Customers View Modal -->
      <app-customers-view-modal></app-customers-view-modal>
    </div>
  `,
})
export class CustomersComponent implements OnInit {
  store = inject(CustomersStore);
  private fb = inject(FormBuilder);

  @ViewChild(CustomersCreateModalComponent) createModal!: CustomersCreateModalComponent;

  searchForm!: FormGroup;

  ngOnInit() {
    this.initializeSearchForm();
    this.loadCustomers();
  }

  private initializeSearchForm() {
    this.searchForm = this.fb.group({
      search: [''],
      isActive: [undefined],
    });
  }

  private loadCustomers() {
    this.store.loadCustomers();
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value;
    this.store.setFilters({ search: searchTerm });
    this.loadCustomers();
  }

  onFilterChange() {
    const filters = this.searchForm.value;
    this.store.setFilters(filters);
    this.loadCustomers();
  }

  applyFilters() {
    const filters = this.searchForm.value;
    this.store.setFilters(filters);
    this.loadCustomers();
  }

  openNewCustomerModal() {
    this.store.openCreateModal();
  }

  viewCustomer(customer: any) {
    this.store.openViewModal(customer);
  }

  editCustomer(customer: any) {
    this.store.openEditModal(customer);
    // Populate the form after the modal state is set
    setTimeout(() => {
      if (this.createModal) {
        this.createModal.populateFormForEditing();
      }
    });
  }

  deleteCustomer(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      this.store.deleteCustomer(id);
    }
  }

  trackByCustomerId(index: number, customer: any): string {
    return customer.id;
  }

  getPages(currentPage: number, totalPages: number): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }
}
