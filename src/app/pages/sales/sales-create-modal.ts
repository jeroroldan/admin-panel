import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SalesStore, SaleStatus, PaymentMethod } from './sales.store';
import { CustomersApiService, Customer } from '../customers/customers-api.service';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-sales-create-modal',
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
                  {{ store.isEditing() ? 'Editar Venta' : 'Crear Nueva Venta' }}
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Complete los detalles de la venta
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
            <form [formGroup]="salesForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Customer Selection -->
              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cliente <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    type="email"
                    formControlName="customerEmail"
                    placeholder="Buscar cliente por email..."
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    [class.border-red-500]="salesForm.get('customerEmail')?.invalid && salesForm.get('customerEmail')?.touched"
                    aria-describedby="customerEmail-error"
                    aria-required="true"
                    (focus)="showCustomerDropdown = customerSearchResults.length > 0"
                    (blur)="onEmailBlur()"
                  >
                  <div *ngIf="selectedCustomer" class="absolute right-2 top-2 flex items-center space-x-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}
                    </span>
                    <button
                      type="button"
                      (click)="clearCustomerSelection()"
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      aria-label="Limpiar selección de cliente"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Customer Dropdown -->
                <div
                  *ngIf="showCustomerDropdown && customerSearchResults.length > 0"
                  class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                  <div *ngFor="let customer of customerSearchResults" class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 p-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0" (mousedown)="selectCustomer(customer)">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {{ customer.firstName.charAt(0) }}{{ customer.lastName.charAt(0) }}
                        </span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {{ customer.firstName }} {{ customer.lastName }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {{ customer.email }}
                        </p>
                        <p *ngIf="customer.company" class="text-xs text-gray-400 dark:text-gray-500 truncate">
                          {{ customer.company }}
                        </p>
                      </div>
                      <div class="flex-shrink-0">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                              [ngClass]="{
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100': customer.isActive,
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100': !customer.isActive
                              }">
                          {{ customer.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div *ngIf="salesForm.get('customerEmail')?.invalid && salesForm.get('customerEmail')?.touched" class="mt-1 text-sm text-red-600" id="customerEmail-error">
                  Correo electrónico válido requerido
                </div>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Escribe al menos 3 caracteres para buscar clientes existentes
                </p>
              </div>

              <!-- Sale Date and Status Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Fecha de Venta <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    formControlName="saleDate"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    aria-required="true"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado <span class="text-red-500">*</span>
                  </label>
                  <select
                    formControlName="status"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    aria-required="true"
                  >
                    <option [value]="SaleStatus.PENDING">Pendiente</option>
                    <option [value]="SaleStatus.COMPLETED">Completada</option>
                    <option [value]="SaleStatus.CANCELLED">Cancelada</option>
                    <option [value]="SaleStatus.REFUNDED">Reembolsada</option>
                  </select>
                </div>
              </div>

              <!-- Payment Method -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Método de Pago <span class="text-red-500">*</span>
                </label>
                <select
                  formControlName="paymentMethod"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  aria-required="true"
                >
                  <option [value]="PaymentMethod.CASH">Efectivo</option>
                  <option [value]="PaymentMethod.CARD">Tarjeta</option>
                  <option [value]="PaymentMethod.TRANSFER">Transferencia</option>
                  <option [value]="PaymentMethod.WHATSAPP">WhatsApp</option>
                </select>
              </div>

              <!-- Products Section -->
              <div>
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-md font-medium text-gray-900 dark:text-white">Productos</h4>
                  <button
                    type="button"
                    (click)="addProduct()"
                    class="btn-primary text-sm flex items-center"
                    aria-label="Agregar producto"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Agregar Producto
                  </button>
                </div>

                <div formArrayName="products" class="space-y-4 max-h-60 overflow-y-auto">
                  <div
                    *ngFor="let product of products.controls; let i = index"
                    [formGroupName]="i"
                    class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                  >
                    <div class="flex items-center justify-between mb-4">
                      <h5 class="text-sm font-medium text-gray-900 dark:text-white">Producto {{ i + 1 }}</h5>
                      <button
                        type="button"
                        (click)="removeProduct(i)"
                        class="text-red-600 hover:text-red-800 p-1"
                        [disabled]="products.length === 1"
                        [attr.aria-label]="'Eliminar producto ' + (i + 1)"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          ID del Producto <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          formControlName="productId"
                          placeholder="ID del producto"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                          aria-required="true"
                        >
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Cantidad <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          formControlName="quantity"
                          min="1"
                          placeholder="Cantidad"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                          aria-required="true"
                        >
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Precio Unitario <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          formControlName="unitPrice"
                          min="0"
                          step="0.01"
                          placeholder="Precio unitario"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-white"
                          aria-required="true"
                        >
                      </div>
                    </div>

                    <div class="mt-4">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Precio Total
                      </label>
                      <input
                        type="number"
                        formControlName="totalPrice"
                        readonly
                        class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-500 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:text-white"
                        [attr.aria-label]="'Precio total del producto ' + (i + 1)"
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notas (Opcional)
                </label>
                <textarea
                  formControlName="notes"
                  rows="3"
                  placeholder="Notas adicionales sobre la venta"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>

              <!-- Total Amount -->
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <span class="text-lg font-medium text-gray-900 dark:text-white">Total:</span>
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ calculateTotal() | number:'1.2-2' }}</span>
                </div>
              </div>

              <!-- Error Message -->
              <div *ngIf="store.formError()" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
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
              [disabled]="salesForm.invalid || store.isFormLoading()"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
            >
              <svg *ngIf="store.isFormLoading()" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ store.isFormLoading() ? (store.isEditing() ? 'Actualizando...' : 'Creando...') : (store.isEditing() ? 'Actualizar Venta' : 'Crear Venta') }}
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
export class SalesCreateModalComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private customersApi = inject(CustomersApiService);
  store = inject(SalesStore);

  salesForm!: FormGroup;
  SaleStatus = SaleStatus;
  PaymentMethod = PaymentMethod;

  // Customer search
  customerSearchResults: Customer[] = [];
  selectedCustomer: Customer | null = null;
  showCustomerDropdown = false;

  ngOnInit() {
    this.initializeForm();
    this.setupProductCalculations();
    this.setupCustomerSearch();
  }

  ngOnDestroy() {
    this.store.resetForm();
  }

  private initializeForm() {
    this.salesForm = this.fb.group({
      customerEmail: ['', [Validators.required, Validators.email]],
      saleDate: [new Date().toISOString().slice(0, 16), [Validators.required]],
      status: [SaleStatus.PENDING, [Validators.required]],
      paymentMethod: [PaymentMethod.CASH, [Validators.required]],
      products: this.fb.array([this.createProductFormGroup()], [Validators.minLength(1)]),
      notes: [''],
    });
  }

  private createProductFormGroup() {
    return this.fb.group({
      productId: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      totalPrice: [0, [Validators.required, Validators.min(0)]],
    });
  }

  private setupProductCalculations() {
    this.products.controls.forEach((control, index) => {
      this.setupProductCalculation(index);
    });
  }

  private setupCustomerSearch() {
    const customerEmailControl = this.salesForm.get('customerEmail');
    if (customerEmailControl) {
      customerEmailControl.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(email => {
            if (email && email.length >= 3) {
              return this.customersApi.searchCustomersByEmail(email);
            }
            return of([]);
          })
        )
        .subscribe(results => {
          this.customerSearchResults = results;
          this.showCustomerDropdown = results.length > 0;
        });
    }
  }

  private setupProductCalculation(index: number) {
    const productGroup = this.products.at(index);
    const quantityControl = productGroup.get('quantity');
    const unitPriceControl = productGroup.get('unitPrice');
    const totalPriceControl = productGroup.get('totalPrice');

    // Calculate total price when quantity or unit price changes
    quantityControl?.valueChanges.subscribe(() => this.updateTotalPrice(index));
    unitPriceControl?.valueChanges.subscribe(() => this.updateTotalPrice(index));
  }

  private updateTotalPrice(index: number) {
    const productGroup = this.products.at(index);
    const quantity = productGroup.get('quantity')?.value || 0;
    const unitPrice = productGroup.get('unitPrice')?.value || 0;
    const totalPrice = quantity * unitPrice;

    productGroup.get('totalPrice')?.setValue(totalPrice, { emitEvent: false });
  }

  get products(): FormArray {
    return this.salesForm.get('products') as FormArray;
  }

  addProduct() {
    const productGroup = this.createProductFormGroup();
    this.products.push(productGroup);
    this.setupProductCalculation(this.products.length - 1);
  }

  removeProduct(index: number) {
    if (this.products.length > 1) {
      this.products.removeAt(index);
    }
  }

  calculateTotal(): number {
    return this.products.controls.reduce((total, control) => {
      return total + (control.get('totalPrice')?.value || 0);
    }, 0);
  }

  onSubmit() {
    if (this.salesForm.valid) {
      const formValue = this.salesForm.value;

      // Convert saleDate string to Date object
      const saleData = {
        ...formValue,
        saleDate: new Date(formValue.saleDate),
      };

      if (this.store.isEditing() && this.store.selectedSale()) {
        // Update existing sale
        this.store.updateSale({
          id: this.store.selectedSale()!.id,
          data: saleData
        });
      } else {
        // Create new sale
        this.store.createSale(saleData);
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.salesForm.markAllAsTouched();
      Object.keys(this.salesForm.controls).forEach(key => {
        const control = this.salesForm.get(key);
        if (control instanceof FormArray) {
          control.controls.forEach(group => group.markAllAsTouched());
        } else {
          control?.markAsTouched();
        }
      });
    }
  }

  selectCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.salesForm.patchValue({
      customerEmail: customer.email,
    });
    this.showCustomerDropdown = false;
  }

  clearCustomerSelection() {
    this.selectedCustomer = null;
    this.salesForm.patchValue({
      customerEmail: '',
    });
    this.customerSearchResults = [];
    this.showCustomerDropdown = false;
  }

  onEmailBlur() {
    // Delay hiding dropdown to allow for click selection
    setTimeout(() => {
      this.showCustomerDropdown = false;
    }, 200);
  }

  // Public method to populate form with sale data (called externally)
  populateFormForEditing() {
    this.updateFormBasedOnStoreState();
  }

  private updateFormBasedOnStoreState() {
    const isEditing = this.store.isEditing();
    const selectedSale = this.store.selectedSale();

    if (isEditing && selectedSale) {
      this.loadSaleDataForEditing(selectedSale);
    } else if (!isEditing) {
      this.resetFormForCreation();
    }
  }

  private loadSaleDataForEditing(sale: any) {
    // Populate form with sale data
    this.salesForm.patchValue({
      customerEmail: sale.customer.email,
      saleDate: new Date(sale.saleDate).toISOString().slice(0, 16),
      status: sale.status,
      paymentMethod: sale.paymentMethod,
      notes: sale.notes || '',
    });

    // Set selected customer
    this.selectedCustomer = sale.customer;

    // Clear existing products and add sale items
    while (this.products.length > 0) {
      this.products.removeAt(0);
    }

    if (sale.saleItems && sale.saleItems.length > 0) {
      sale.saleItems.forEach((item: any) => {
        const productGroup = this.createProductFormGroup();
        productGroup.patchValue({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        });
        this.products.push(productGroup);
        this.setupProductCalculation(this.products.length - 1);
      });
    }
  }

  private resetFormForCreation() {
    this.salesForm.reset({
      customerEmail: '',
      saleDate: new Date().toISOString().slice(0, 16),
      status: SaleStatus.PENDING,
      paymentMethod: PaymentMethod.CASH,
      notes: '',
    });

    // Reset to single product
    while (this.products.length > 1) {
      this.products.removeAt(1);
    }
    this.products.at(0).reset({
      productId: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    });

    this.selectedCustomer = null;
    this.customerSearchResults = [];
    this.showCustomerDropdown = false;
  }

  closeModal() {
    if (this.store.isEditing()) {
      this.store.closeEditModal();
    } else {
      this.store.closeCreateModal();
    }
  }
}
