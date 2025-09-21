import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersStore } from './customers.store';

@Component({
  selector: 'app-customers-create-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Modal Backdrop -->
    <div
      *ngIf="store.isCreateModalOpen() || store.isEditModalOpen()"
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
                  {{ store.isEditing() ? 'Editar Cliente' : 'Crear Nuevo Cliente' }}
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ store.isEditing() ? 'Modifica la información del cliente' : 'Complete los datos del nuevo cliente' }}
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
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pt-0">
            <form [formGroup]="customerForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Basic Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="firstName"
                    placeholder="Nombre del cliente"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    [class.border-red-500]="customerForm.get('firstName')?.invalid && customerForm.get('firstName')?.touched"
                    aria-describedby="firstName-error"
                    aria-required="true"
                  >
                  <div *ngIf="customerForm.get('firstName')?.invalid && customerForm.get('firstName')?.touched" class="mt-1 text-sm text-red-600" id="firstName-error">
                    Nombre es requerido
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Apellido <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="lastName"
                    placeholder="Apellido del cliente"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    [class.border-red-500]="customerForm.get('lastName')?.invalid && customerForm.get('lastName')?.touched"
                    aria-describedby="lastName-error"
                    aria-required="true"
                  >
                  <div *ngIf="customerForm.get('lastName')?.invalid && customerForm.get('lastName')?.touched" class="mt-1 text-sm text-red-600" id="lastName-error">
                    Apellido es requerido
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    formControlName="email"
                    placeholder="cliente@example.com"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    [class.border-red-500]="customerForm.get('email')?.invalid && customerForm.get('email')?.touched"
                    aria-describedby="email-error"
                  >
                  <div *ngIf="customerForm.get('email')?.invalid && customerForm.get('email')?.touched" class="mt-1 text-sm text-red-600" id="email-error">
                    Email debe ser válido
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    formControlName="phone"
                    placeholder="+1234567890"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    [class.border-red-500]="customerForm.get('phone')?.invalid && customerForm.get('phone')?.touched"
                    aria-describedby="phone-error"
                  >
                  <div *ngIf="customerForm.get('phone')?.invalid && customerForm.get('phone')?.touched" class="mt-1 text-sm text-red-600" id="phone-error">
                    Teléfono debe ser válido
                  </div>
                </div>
              </div>

              <!-- Company -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Empresa
                </label>
                <input
                  type="text"
                  formControlName="company"
                  placeholder="Nombre de la empresa"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
              </div>

              <!-- Address Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    formControlName="address"
                    placeholder="Dirección completa"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    formControlName="city"
                    placeholder="Ciudad"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado/Provincia
                  </label>
                  <input
                    type="text"
                    formControlName="state"
                    placeholder="Estado"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    formControlName="postalCode"
                    placeholder="12345"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    País
                  </label>
                  <input
                    type="text"
                    formControlName="country"
                    placeholder="País"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                </div>
              </div>

              <!-- Date of Birth -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  formControlName="dateOfBirth"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notas
                </label>
                <textarea
                  formControlName="notes"
                  rows="3"
                  placeholder="Notas adicionales sobre el cliente"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>

              <!-- Active Status (only for editing) -->
              <div *ngIf="store.isEditing()" class="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  formControlName="isActive"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="isActive" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Cliente activo
                </label>
              </div>

              <!-- Error Message -->
              <div *ngIf="store.hasFormError()" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <div class="text-sm text-red-700 dark:text-red-300">
                  {{ store.formError() }}
                </div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              (click)="onSubmit()"
              [disabled]="customerForm.invalid || store.isFormLoading()"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
            >
              <svg *ngIf="store.isFormLoading()" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ store.isFormLoading() ? (store.isEditing() ? 'Actualizando...' : 'Creando...') : (store.isEditing() ? 'Actualizar Cliente' : 'Crear Cliente') }}
            </button>
            <button
              type="button"
              (click)="closeModal()"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CustomersCreateModalComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  store = inject(CustomersStore);

  customerForm!: FormGroup;

  ngOnInit() {
    this.initializeForm();
  }

  private updateFormBasedOnStoreState() {
    const isEditing = this.store.isEditing();
    const selectedCustomer = this.store.selectedCustomer();

    if (isEditing && selectedCustomer) {
      this.loadCustomerDataForEditing(selectedCustomer);
    } else if (!isEditing) {
      this.resetFormForCreation();
    }
  }

  ngOnDestroy() {
    this.store.resetForm();
  }

  private initializeForm() {
    const formConfig: any = {
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      address: ['', [Validators.maxLength(200)]],
      city: ['', [Validators.maxLength(50)]],
      state: ['', [Validators.maxLength(50)]],
      postalCode: ['', [Validators.maxLength(8)]],
      country: ['', [Validators.maxLength(50)]],
      company: ['', [Validators.maxLength(100)]],
      dateOfBirth: [null],
      notes: ['', [Validators.maxLength(500)]],
      isActive: [true], // Default to true, will be overridden by effect if editing
    };

    this.customerForm = this.fb.group(formConfig);
  }

  private loadCustomerDataForEditing(customer: any) {
    this.customerForm.patchValue({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      postalCode: customer.postalCode || '',
      country: customer.country || '',
      company: customer.company || '',
      dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth).toISOString().split('T')[0] : null,
      notes: customer.notes || '',
      isActive: customer.isActive,
    });
  }

  private resetFormForCreation() {
    this.customerForm.reset();
    // Set default values for creation
    this.customerForm.patchValue({
      isActive: true, // New customers are active by default
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.value;

      // Convert dateOfBirth string to Date object if present
      if (formValue.dateOfBirth) {
        formValue.dateOfBirth = new Date(formValue.dateOfBirth);
      }

      if (this.store.isEditing()) {
        const customerId = this.store.selectedCustomerId();
        if (customerId) {
          this.store.updateCustomer({ id: customerId, data: formValue });
        }
      } else {
        this.store.createCustomer(formValue);
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.customerForm.markAllAsTouched();
    }
  }

  // Public method to populate form with customer data (called externally)
  populateFormForEditing() {
    this.updateFormBasedOnStoreState();
  }

  closeModal() {
    this.store.closeAllModals();
  }
}
