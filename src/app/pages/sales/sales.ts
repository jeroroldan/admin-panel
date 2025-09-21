// sales.component.ts
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { SalesStore, Sale, SaleStatus, PaymentMethod } from './sales.store';
import { SalesCreateModalComponent } from './sales-create-modal';
import { SalesViewModalComponent } from './sales-view-modal';
import { ButtonComponent } from '../../shared/components/button/button';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SalesCreateModalComponent, SalesViewModalComponent, ButtonComponent],
  template: `
    <div class="animate-fade-in min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Ventas
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Realiza un seguimiento y gestiona tus pedidos de ventas
          </p>
        </div>
        <div class="flex gap-3 mt-4 sm:mt-0">
          <app-button variant="primary" (clicked)="openNewSaleModal()" ariaLabel="Crear nueva venta">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nueva Venta
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
              placeholder="Buscar por cliente, producto o ID..."
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              (input)="onSearchChange($event)"
            >
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
            <select
              formControlName="status"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              (change)="onFilterChange()"
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
              <option value="refunded">Reembolsada</option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Método de Pago</label>
            <select
              formControlName="paymentMethod"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              (change)="onFilterChange()"
            >
              <option value="">Todos los métodos</option>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
          <app-button variant="primary" type="button" (clicked)="applyFilters()">
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

      <!-- Sales Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Ventas</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ store.salesStats().totalSales }}</p>
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
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Ventas Completadas</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ store.salesStats().completedSales }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Ingresos</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ store.salesStats().totalRevenue | number:'1.2-2' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Promedio por Venta</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ store.salesStats().averageSale | number:'1.2-2' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative">
        <!-- Loading Overlay -->
        <div *ngIf="store.isLoading()" class="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 flex items-center justify-center z-10">
          <div class="flex items-center space-x-2">
            <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600 dark:text-gray-400">Cargando ventas...</span>
          </div>
        </div>

        <!-- Sales Create Modal -->
        <app-sales-create-modal></app-sales-create-modal>

        <!-- Sales View Modal -->
        <app-sales-view-modal></app-sales-view-modal>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" role="table" aria-label="Lista de ventas">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr role="row">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" role="columnheader" scope="col">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" role="columnheader" scope="col">Cliente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" role="columnheader" scope="col">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" role="columnheader" scope="col">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" role="columnheader" scope="col">Método de Pago</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" role="columnheader" scope="col">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" role="columnheader" scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              <tr *ngFor="let sale of store.filteredSales(); trackBy: trackBySaleId" class="hover:bg-gray-50 dark:hover:bg-gray-700" role="row">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white" role="cell">{{ sale.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" role="cell">{{ sale.customer.firstName }} {{ sale.customer.lastName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" role="cell" [attr.aria-label]="'Total: ' + (sale.amount | number:'1.2-2') + ' pesos'">{{ sale.amount | number:'1.2-2' }}</td>
                <td class="px-6 py-4 whitespace-nowrap" role="cell">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [ngClass]="{
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100': sale.status === 'completed',
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100': sale.status === 'pending',
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100': sale.status === 'cancelled' || sale.status === 'refunded'
                        }"
                        [attr.aria-label]="'Estado: ' + (sale.status | titlecase)">
                    {{ sale.status | titlecase }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" role="cell" [attr.aria-label]="'Método de pago: ' + (sale.paymentMethod | titlecase)">{{ sale.paymentMethod | titlecase }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" role="cell" [attr.aria-label]="'Fecha: ' + (sale.saleDate | date:'short')">{{ sale.saleDate | date:'short' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" role="cell">
                  <button class="text-indigo-600 hover:text-indigo-900 mr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1" (click)="viewSale(sale)" aria-label="Ver detalles de la venta">Ver</button>
                  <button class="text-indigo-600 hover:text-indigo-900 mr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1" (click)="editSale(sale)" aria-label="Editar venta">Editar</button>
                  <button class="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded px-2 py-1" (click)="deleteSale(sale.id)" aria-label="Eliminar venta">Eliminar</button>
                </td>
              </tr>
              <tr *ngIf="!store.isLoading() && store.sales().length === 0" class="text-center py-8">
                <td colspan="7" class="text-gray-500 dark:text-gray-400">No se encontraron ventas.</td>
              </tr>
              <tr *ngIf="store.isLoading()" class="text-center py-8">
                <td colspan="7" class="text-gray-500 dark:text-gray-400">Cargando ventas...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="store.totalPages() > 1" class="bg-white dark:bg-gray-800 rounded-lg shadow mt-6 p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button (click)="store.setPage(store.currentPage() - 1)" [disabled]="!store.hasPrevPage()" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Anterior</button>
            <button (click)="store.setPage(store.currentPage() + 1)" [disabled]="!store.hasNextPage()" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Siguiente</button>
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
                <button
                  (click)="store.setPage(1)"
                  [disabled]="store.currentPage() === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                >
                  <span class="sr-only">Primera</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                  (click)="store.setPage(store.currentPage() - 1)"
                  [disabled]="!store.hasPrevPage()"
                  class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                >
                  <span class="sr-only">Anterior</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
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
    </div>
  `
})
export class SalesComponent implements OnInit {
  constructor() {
    console.log('SalesComponent constructor called');
    console.log('store in constructor:', this.store);  // Log if store is defined at init
  }

  store = inject(SalesStore);
  authService = inject(AuthService);

  @ViewChild(SalesCreateModalComponent) createModal!: SalesCreateModalComponent;

  searchForm = new FormGroup({
    search: new FormControl(''),
    status: new FormControl(''),
    paymentMethod: new FormControl('')
  });

  ngOnInit() {
    console.log('ngOnInit called, store:', this.store);  // Log in ngOnInit
    this.store.loadSales();
    this.searchForm.valueChanges.subscribe(() => {
      this.applyFilters();
      this.onFilterChange();
    });
  }

  onSearchChange(event: any) {
    this.store.setFilters({ search: event.target.value });
  }

  onFilterChange() {
    const filters = {
      status: this.searchForm.get('status')?.value as SaleStatus || undefined,
      paymentMethod: this.searchForm.get('paymentMethod')?.value as PaymentMethod || undefined,
    };
    this.store.setFilters(filters);
  }

  applyFilters() {
    const search = this.searchForm.get('search')?.value || '';
    this.store.setFilters({ search });
  }

  viewSale(sale: Sale) {
    this.store.navigateToDetail(sale.id);
  }

  editSale(sale: Sale) {
    this.store.openEditModal(sale);
    // Populate the form after the modal state is set
    setTimeout(() => {
      if (this.createModal) {
        this.createModal.populateFormForEditing();
      }
    });
  }

  deleteSale(id: string) {
    if (confirm('¿Estás seguro de eliminar esta venta?')) {
      this.store.deleteSale(id);
    }
  }

  openNewSaleModal() {
    this.store.openCreateModal();
  }

  getPages(current: number, total: number): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  // TrackBy function for better performance
  trackBySaleId(index: number, sale: any): string {
    return sale.id;
  }
}
