import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersStore } from './customers.store';

@Component({
  selector: 'app-customers-view-modal',
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
          class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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
                  Detalles del Cliente
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Información completa del cliente
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
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pt-0" *ngIf="store.selectedCustomer()">
            <div class="space-y-6">
              <!-- Customer Avatar and Basic Info -->
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0 h-16 w-16">
                  <div class="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <span class="text-xl font-medium text-gray-700 dark:text-gray-300">
                      {{ (store.selectedCustomer()?.firstName || '')[0] }}{{ (store.selectedCustomer()?.lastName || '')[0] }}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ store.selectedCustomer()?.firstName }} {{ store.selectedCustomer()?.lastName }}
                  </h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    ID: {{ store.selectedCustomer()?.id }}
                  </p>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="{
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100': store.selectedCustomer()?.isActive,
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100': !store.selectedCustomer()?.isActive
                        }">
                    {{ store.selectedCustomer()?.isActive ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Información de Contacto
                  </h5>
                  <dl class="space-y-3">
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                      <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ store.selectedCustomer()?.email || 'No especificado' }}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</dt>
                      <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ store.selectedCustomer()?.phone || 'No especificado' }}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Información Empresarial
                  </h5>
                  <dl class="space-y-3">
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Empresa</dt>
                      <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ store.selectedCustomer()?.company || 'No especificado' }}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de Nacimiento</dt>
                      <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ store.selectedCustomer()?.dateOfBirth ? (store.selectedCustomer()?.dateOfBirth | date:'mediumDate') : 'No especificado' }}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <!-- Address Information -->
              <div>
                <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Dirección
                </h5>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Dirección</dt>
                      <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ store.selectedCustomer()?.address || 'No especificado' }}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Ciudad</dt>
                      <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ store.selectedCustomer()?.city || 'No especificado' }}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Estado/Provincia</dt>
                      <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ store.selectedCustomer()?.state || 'No especificado' }}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Código Postal</dt>
                      <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ store.selectedCustomer()?.postalCode || 'No especificado' }}
                      </dd>
                    </div>
                    <div class="md:col-span-2">
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">País</dt>
                      <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ store.selectedCustomer()?.country || 'No especificado' }}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <!-- Notes -->
              <div *ngIf="store.selectedCustomer()?.notes">
                <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Notas
                </h5>
                <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                    {{ store.selectedCustomer()?.notes }}
                  </p>
                </div>
              </div>

              <!-- Timestamps -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Información del Sistema
                </h5>
                <dl class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt class="font-medium text-gray-500 dark:text-gray-400">Fecha de Registro</dt>
                    <dd class="mt-1 text-gray-900 dark:text-white">
                      {{ store.selectedCustomer()?.createdAt | date:'medium' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="font-medium text-gray-500 dark:text-gray-400">Última Actualización</dt>
                    <dd class="mt-1 text-gray-900 dark:text-white">
                      {{ store.selectedCustomer()?.updatedAt | date:'medium' }}
                    </dd>
                  </div>
                </dl>
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
  `,
})
export class CustomersViewModalComponent {
  store = inject(CustomersStore);

  closeModal() {
    this.store.closeViewModal();
  }
}
