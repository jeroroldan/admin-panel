import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesStore, SaleStatus, PaymentMethod } from './sales.store';
import { Customer } from './sales-api.service';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardSelectComponent } from '@shared/components/select/select.component';
import { ZardSelectItemComponent } from '@shared/components/select/select-item.component';
import { ButtonComponent } from '@shared/components/button/button';
import {
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent
} from '@shared/components/table/table.component';

@Component({
  selector: 'app-sales-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZardInputDirective,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ButtonComponent,
    ZardTableComponent,
    ZardTableHeaderComponent,
    ZardTableBodyComponent,
    ZardTableRowComponent,
    ZardTableHeadComponent,
    ZardTableCellComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Crear Nueva Venta</h1>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Registra una nueva venta en el sistema
              </p>
            </div>
            <app-button
              type="button"
              (click)="goBack()"
              variant="secondary"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver
            </app-button>
          </div>
        </div>

        <!-- Form -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
          <form [formGroup]="salesForm" (ngSubmit)="onSubmit()" class="p-6 space-y-6" role="form" [attr.aria-labelledby]="'create-sale-form'">
            <!-- Customer Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cliente
              </label>
              <input
                z-input
                type="email"
                formControlName="customerEmail"
                placeholder="Correo electrónico del cliente"
                [class.border-red-500]="salesForm.get('customerEmail')?.invalid && salesForm.get('customerEmail')?.touched"
                aria-describedby="customerEmail-error"
                aria-required="true"
              >
              <div *ngIf="salesForm.get('customerEmail')?.invalid && salesForm.get('customerEmail')?.touched" class="mt-1 text-sm text-red-600">
                Correo electrónico válido requerido
              </div>
            </div>

            <!-- Sale Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Venta
              </label>
              <input
                z-input
                type="datetime-local"
                formControlName="saleDate"
              >
            </div>

            <!-- Status and Payment Method -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <z-select formControlName="status" placeholder="Seleccionar estado">
                  <z-select-item [value]="SaleStatus.PENDING">Pendiente</z-select-item>
                  <z-select-item [value]="SaleStatus.COMPLETED">Completada</z-select-item>
                  <z-select-item [value]="SaleStatus.CANCELLED">Cancelada</z-select-item>
                  <z-select-item [value]="SaleStatus.REFUNDED">Reembolsada</z-select-item>
                </z-select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Método de Pago
                </label>
                <z-select formControlName="paymentMethod" placeholder="Seleccionar método de pago">
                  <z-select-item [value]="PaymentMethod.CASH">Efectivo</z-select-item>
                  <z-select-item [value]="PaymentMethod.CARD">Tarjeta</z-select-item>
                  <z-select-item [value]="PaymentMethod.TRANSFER">Transferencia</z-select-item>
                  <z-select-item [value]="PaymentMethod.WHATSAPP">WhatsApp</z-select-item>
                </z-select>
              </div>
            </div>

            <!-- Products Section -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Productos</h3>
                <app-button
                  type="button"
                  (click)="addProduct()"
                  variant="primary"
                  size="sm"
                >
                  Agregar Producto
                </app-button>
              </div>

              <div formArrayName="products" class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <table z-table class="w-full">
                  <thead z-table-header>
                    <tr z-table-row>
                      <th z-table-head class="text-left">#</th>
                      <th z-table-head class="text-left">ID del Producto</th>
                      <th z-table-head class="text-left">Cantidad</th>
                      <th z-table-head class="text-left">Precio Unitario</th>
                      <th z-table-head class="text-left">Total</th>
                      <th z-table-head class="text-left w-16">Acciones</th>
                    </tr>
                  </thead>
                  <tbody z-table-body>
                    <tr
                      *ngFor="let product of products.controls; let i = index"
                      [formGroupName]="i"
                      z-table-row
                    >
                      <td z-table-cell>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ i + 1 }}
                        </span>
                      </td>
                      <td z-table-cell>
                        <input
                          z-input
                          type="text"
                          formControlName="productId"
                          placeholder="ID del producto"
                          class="w-full"
                        >
                      </td>
                      <td z-table-cell>
                        <input
                          z-input
                          type="number"
                          formControlName="quantity"
                          min="1"
                          placeholder="Cantidad"
                          class="w-full"
                        >
                      </td>
                      <td z-table-cell>
                        <input
                          z-input
                          type="number"
                          formControlName="unitPrice"
                          min="0"
                          step="0.01"
                          placeholder="Precio unitario"
                          class="w-full"
                        >
                      </td>
                      <td z-table-cell>
                        <input
                          z-input
                          type="number"
                          formControlName="totalPrice"
                          readonly
                          class="w-full"
                        >
                      </td>
                      <td z-table-cell>
                        <app-button
                          type="button"
                          (click)="removeProduct(i)"
                          variant="ghost"
                          [disabled]="products.length === 1"
                          class="text-red-600 hover:text-red-800"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </app-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notas (Opcional)
              </label>
              <textarea
                z-input
                formControlName="notes"
                rows="3"
                placeholder="Notas adicionales sobre la venta"
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

            <!-- Submit Buttons -->
            <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
              <app-button
                type="button"
                (click)="goBack()"
                variant="secondary"
              >
                Cancelar
              </app-button>
              <app-button
                type="submit"
                [disabled]="salesForm.invalid || store.isFormLoading()"
                variant="primary"
                class="flex items-center"
                [loading]="store.isFormLoading()"
              >
                {{ store.isFormLoading() ? 'Creando...' : 'Crear Venta' }}
              </app-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class SalesCreateComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  store = inject(SalesStore);

  salesForm!: FormGroup;
  SaleStatus = SaleStatus;
  PaymentMethod = PaymentMethod;

  ngOnInit() {
    this.initializeForm();
    this.setupProductCalculations();
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

      this.store.createSale(saleData);
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

  goBack() {
    this.router.navigate(['/sales']);
  }
}
