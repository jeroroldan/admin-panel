import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesStore, Sale } from './sales.store';

@Component({
  selector: 'app-sales-view-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Modal Backdrop -->
    <div
      *ngIf="store.isViewModalOpen()"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        (click)="closeModal()"
      ></div>

      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()"
        >
          <!-- Modal Header -->
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <h3
                  class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  id="modal-title"
                >
                  Detalles de Venta #{{ selectedSale?.id }}
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Información completa de la venta
                </p>
              </div>
              <button
                type="button"
                class="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                (click)="closeModal()"
                aria-label="Cerrar modal"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pt-0" *ngIf="selectedSale">
            <div class="space-y-6">
              <!-- Sale Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Customer Information -->
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Información del Cliente</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-500 dark:text-gray-400">Nombre:</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedSale.customer.firstName }} {{ selectedSale.customer.lastName }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedSale.customer.email }}</span>
                    </div>
                    <div class="flex justify-between" *ngIf="selectedSale.customer.phone">
                      <span class="text-sm text-gray-500 dark:text-gray-400">Teléfono:</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedSale.customer.phone }}</span>
                    </div>
                    <div class="flex justify-between" *ngIf="selectedSale.customer.company">
                      <span class="text-sm text-gray-500 dark:text-gray-400">Empresa:</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedSale.customer.company }}</span>
                    </div>
                  </div>
                </div>

                <!-- Sale Details -->
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Detalles de la Venta</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-500 dark:text-gray-400">ID:</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedSale.id }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-500 dark:text-gray-400">Fecha:</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedSale.saleDate | date:'short' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-500 dark:text-gray-400">Estado:</span>
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                            [ngClass]="{
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100': selectedSale.status === 'completed',
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100': selectedSale.status === 'pending',
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100': selectedSale.status === 'cancelled' || selectedSale.status === 'refunded'
                            }">
                        {{ selectedSale.status | titlecase }}
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-500 dark:text-gray-400">Método de Pago:</span>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedSale.paymentMethod | titlecase }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Products Table -->
              <div>
                <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">Productos</h4>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead class="bg-gray-100 dark:bg-gray-600">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Producto</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cantidad</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Precio Unitario</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                      <tr *ngFor="let item of selectedSale.saleItems" class="hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          <div>
                            <div class="font-medium">{{ item.product?.name || 'Producto no encontrado' }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400" *ngIf="item.product?.sku">SKU: {{ item.product.sku }}</div>
                          </div>
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ item.quantity }}</td>
                        <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ item.unitPrice | number:'1.2-2' }}</td>
                        <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ item.totalPrice | number:'1.2-2' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Total and Notes -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Total Amount -->
                <div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-lg font-medium text-gray-900 dark:text-white">Total de la Venta:</span>
                    <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ selectedSale.amount | number:'1.2-2' }}</span>
                  </div>
                </div>

                <!-- Notes -->
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4" *ngIf="selectedSale.notes">
                  <h4 class="text-md font-medium text-gray-900 dark:text-white mb-2">Notas</h4>
                  <p class="text-sm text-gray-700 dark:text-gray-300">{{ selectedSale.notes }}</p>
                </div>
              </div>

              <!-- Timestamps -->
              <div class="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-4">
                <div class="flex justify-between">
                  <span>Creado: {{ selectedSale.createdAt | date:'short' }}</span>
                  <span *ngIf="selectedSale.updatedAt !== selectedSale.createdAt">Actualizado: {{ selectedSale.updatedAt | date:'short' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              (click)="closeModal()"
              class="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SalesViewModalComponent {
  store = inject(SalesStore);

  get selectedSale(): Sale | null {
    return this.store.selectedSale();
  }

  closeModal() {
    this.store.closeViewModal();
  }
}
