import { Component, input, output, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalShare } from '../../shared/components/modal/modal-share';
import { CustomerForm } from './customer-form';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from './api';

/**
 * Customer Modal Component with Content Projection Support
 *
 * This component demonstrates how to use the modal with content projection
 * for forms and custom content. It provides a clean, reusable wrapper
 * around the modal component specifically for customer operations.
 *
 * Usage Examples:
 *
 * 1. Simple Add Customer Modal:
 * <app-customer-modal
 *   [isOpen]="showAddModal"
 *   title="Add New Customer"
 *   (customerSaved)="onCustomerAdded($event)"
 *   (closed)="showAddModal = false">
 * </app-customer-modal>
 *
 * 2. Edit Customer Modal:
 * <app-customer-modal
 *   [isOpen]="showEditModal"
 *   [customer]="selectedCustomer"
 *   title="Edit Customer"
 *   (customerSaved)="onCustomerUpdated($event)"
 *   (closed)="showEditModal = false">
 * </app-customer-modal>
 *
 * 3. Custom Content with Content Projection:
 * <app-customer-modal
 *   [isOpen]="showCustomModal"
 *   title="Custom Customer Action"
 *   [showForm]="false"
 *   (closed)="showCustomModal = false">
 *   <div class="custom-content">
 *     <p>Custom content here...</p>
 *     <button (click)="doSomething()">Custom Action</button>
 *   </div>
 * </app-customer-modal>
 */
@Component({
  selector: 'app-customer-modal',
  standalone: true,
  imports: [CommonModule, ModalShare, CustomerForm],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      [config]="modalConfig()"
      [buttons]="modalButtons()"
      [loading]="loading()"
      (closed)="onModalClosed()"
      (backdropClick)="onBackdropClick()">

      <!-- Default Form Content -->
      @if (showForm()) {
        <app-customer-form
          #customerForm
          [customer]="customer() || undefined"
          [editMode]="!!customer()"
          [showDebug]="showDebug()"
          (formSubmit)="onFormSubmit($event)"
          (formValid)="onFormValidityChange($event)">
        </app-customer-form>
      }

      <!-- Projected Custom Content -->
      <ng-content />
    </app-modal>
  `
})
export class CustomerModal implements OnInit {
  // Input signals
  isOpen = input<boolean>(false);
  customer = input<Customer | null>(null);
  title = input<string>('Customer');
  subtitle = input<string>('');
  size = input<'sm' | 'md' | 'lg' | 'xl' | 'full'>('lg');
  loading = input<boolean>(false);
  showForm = input<boolean>(true);
  showDebug = input<boolean>(false);
  closable = input<boolean>(true);
  centered = input<boolean>(true);

  // Output signals
  customerSaved = output<Customer>();
  closed = output<void>();
  backdropClick = output<void>();

  // ViewChild to access the form
  @ViewChild('customerForm') customerForm?: CustomerForm;

  private isFormValid = false;

  ngOnInit() {
    // Component initialization
  }

  modalConfig() {
    return {
      title: this.title(),
      subtitle: this.subtitle(),
      size: this.size(),
      showHeader: true,
      showFooter: this.showForm(), // Only show footer with buttons if form is shown
      closable: this.closable(),
      centered: this.centered(),
      scrollable: true
    };
  }

  modalButtons() {
    if (!this.showForm()) {
      return [];
    }

    return [
      {
        label: 'Cancelar',
        type: 'secondary' as const,
        action: () => this.onModalClosed()
      },
      {
        label: this.customer() ? 'Actualizar Cliente' : 'Agregar Cliente',
        type: 'primary' as const,
        // disabled: !this.isFormValid,
        action: () => this.submitForm()
      }
    ];
  }

  onFormSubmit(customerData: CreateCustomerRequest | UpdateCustomerRequest) {
    // Emit the form submission data to parent
    console.log(customerData)
    this.customerSaved.emit(customerData as Customer);
  }

  onFormValidityChange(isValid: boolean) {
    this.isFormValid = isValid;
  }

  submitForm() {
      console.log(this.customerForm);
    if (this.customerForm && this.isFormValid) {
      this.customerForm.submitForm();
    }
  }

  onModalClosed() {
    this.closed.emit();
  }

  onBackdropClick() {
    if (this.closable()) {
      this.backdropClick.emit();
    }
  }

  // Public methods for external control
  public closeModal() {
    this.onModalClosed();
  }

  public openModal() {
    // This would be handled by parent setting isOpen to true
  }

  public resetForm() {
    if (this.customerForm) {
      this.customerForm.resetForm();
    }
  }

  public getFormValue() {
    return this.customerForm?.getFormValue() || null;
  }

  public isFormValidState() {
    return this.isFormValid;
  }
}
