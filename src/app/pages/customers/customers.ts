// customers.component.ts
import { Component, OnInit, inject, ComponentRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { CustomersStore } from './customers.store';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from './api';
import { CustomersApiService } from './api';
import { ModalService } from '../../shared/components/modal/modal.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { CustomerModalComponent } from './customer-modal.component';
import { CustomerFormComponent } from './customer-form.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerModalComponent],
  providers: [CustomersStore, CustomersApiService],
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
          <button class="btn-secondary">
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Send Email
          </button>
          <button class="btn-primary" (click)="openAddCustomerModal()">
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
            Add Customer (Programmatic)
          </button>

          <!-- Content Projection Demo Buttons -->
          <div class="relative group">
            <button class="btn-outline btn-small">
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Content Projection ▼
            </button>

            <!-- Dropdown Menu -->
            <div
              class="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10"
            >
              <div class="p-2">
                <button
                  (click)="openContentProjectionModal()"
                  class="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  📝 Add Customer (Content Projection)
                </button>
                <button
                  (click)="openCustomContentModal()"
                  class="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  🎨 Custom Content Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="card">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Total Clientes
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {{ store.totalCustomers() }}
          </p>
          <p class="text-xs text-green-600 dark:text-green-400 mt-2">
            Registro Total
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Activar Cliente
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {{ getActiveCustomersCount() }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Currently active
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 dark:text-gray-400">Average Spent</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {{ getAverageSpent() }}
          </p>
          <p class="text-xs text-green-600 dark:text-green-400 mt-2">
            Per customer
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {{ getTotalOrders() }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Todos los clientes
          </p>
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
                placeholder="Search customers by name or email..."
                class="input-field pl-10"
              />
            </div>
          </div>

          <select
            [value]="store.filters().isActive || ''"
            (change)="onStatusFilterChange($event)"
            class="input-field w-full lg:w-48"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button
            (click)="clearFilters()"
            class="btn-secondary w-full lg:w-auto"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Loading State -->
      @if (store.isLoading()) {
      <div class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
        ></div>
        <span class="ml-2 text-gray-600 dark:text-gray-400"
          >Loading customers...</span
        >
      </div>
      }

      <!-- Customers Grid -->
      @if (!store.isLoading() && store.hasCustomers()) {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        @for (customer of store.filteredCustomers(); track customer.id) {
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

                <!-- Status Badge -->
                <span
                  [class]="
                    customer.isActive ? 'badge-success' : 'badge-warning'
                  "
                >
                  {{ customer.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>

              <!-- Customer Details -->
              <div class="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Total Spent</p>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(customer.totalSpent) }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Orders</p>
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
                  (click)="viewCustomer(customer)"
                  class="text-xs btn-secondary py-1 px-2"
                >
                  View Details
                </button>
                <button
                  (click)="editCustomer(customer)"
                  class="text-xs btn-primary py-1 px-2"
                >
                  Edit
                </button>
                @if (isAdminUser()) {
                <button
                  (click)="deleteCustomer(customer)"
                  class="text-xs bg-red-100 hover:bg-red-200 text-red-700 py-1 px-2 rounded-md transition-colors"
                >
                  Delete
                </button>
                }
              </div>
            </div>
          </div>
        </div>
        }
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Showing
          {{ (store.pagination().page - 1) * store.pagination().limit + 1 }} to
          {{ getEndRecord() }}
          of {{ store.pagination().total }} customers
        </div>

        <div class="flex gap-2">
          <button
            (click)="previousPage()"
            [disabled]="store.pagination().page <= 1"
            class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
            Page {{ store.pagination().page }} of
            {{ store.pagination().totalPages }}
          </span>

          <button
            (click)="nextPage()"
            [disabled]="
              store.pagination().page >= store.pagination().totalPages
            "
            class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
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
          No customers found
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          Get started by adding your first customer.
        </p>
        <button class="btn-primary" (click)="openAddCustomerModal()">
          Add Customer
        </button>
      </div>
      }
    </div>

    <!-- Content Projection Modal Example -->
    <app-customer-modal
      [isOpen]="showContentProjectionModal"
      title="Add Customer (Content Projection)"
      subtitle="Using content projection approach"
      (customerSaved)="onCustomerSaved($event)"
      (closed)="showContentProjectionModal = false"
    >
    </app-customer-modal>

    <!-- Custom Content Projection Example -->
    <app-customer-modal
      [isOpen]="showCustomContentModal"
      title="Custom Content Modal"
      subtitle="Demonstrating custom content projection"
      [showForm]="false"
      (closed)="showCustomContentModal = false"
    >
      <div class="space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="text-blue-800 font-medium mb-2">Custom Content Example</h4>
          <p class="text-blue-700 text-sm mb-3">
            This modal demonstrates content projection with custom HTML content.
            You can project any Angular component or HTML content here.
          </p>
          <div class="flex gap-2">
            <button
              class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              (click)="doCustomAction()"
            >
              Custom Action
            </button>
            <button
              class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
              (click)="showCustomContentModal = false"
            >
              Close
            </button>
          </div>
        </div>

        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 class="text-green-800 font-medium mb-2">
            Benefits of Content Projection
          </h4>
          <ul class="text-green-700 text-sm space-y-1">
            <li>• More declarative and readable template syntax</li>
            <li>• Better component composition</li>
            <li>• Type-safe content projection</li>
            <li>• Easier to test and maintain</li>
            <li>• Better Angular DevTools debugging</li>
          </ul>
        </div>
      </div>
    </app-customer-modal>
  `,
})
export class CustomersComponent implements OnInit {
  protected authService = inject(AuthService);
  public store = inject(CustomersStore);
  private modalService = inject(ModalService);
  private viewContainerRef = inject(ViewContainerRef);

  private currentModalRef?: ComponentRef<ModalComponent>;
  private currentFormRef?: ComponentRef<CustomerFormComponent>;

  // Content projection modal states
  showContentProjectionModal = false;
  showCustomContentModal = false;

  constructor() {}

  ngOnInit(): void {
    // Load customers on component initialization
    this.store.loadCustomers({});
  }

  // Event handlers for template
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.store.setSearchFilter(target.value);
    // Reload customers with new filter
    this.store.loadCustomers({
      page: 1,
      filters: this.store.filters(),
    });
  }

  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    const isActive = value === '' ? undefined : value === 'true';
    this.store.setActiveFilter(isActive);
    // Reload customers with new filter
    this.store.loadCustomers({
      page: 1,
      filters: this.store.filters(),
    });
  }

  clearFilters(): void {
    this.store.clearFilters();
    // Reload customers without filters
    this.store.loadCustomers({ page: 1 });
  }

  // Pagination methods
  previousPage(): void {
    const currentPage = this.store.pagination().page;
    if (currentPage > 1) {
      this.store.setPage(currentPage - 1);
      this.store.loadCustomers({
        page: currentPage - 1,
        filters: this.store.filters(),
      });
    }
  }

  nextPage(): void {
    const pagination = this.store.pagination();
    if (pagination.page < pagination.totalPages) {
      this.store.setPage(pagination.page + 1);
      this.store.loadCustomers({
        page: pagination.page + 1,
        filters: this.store.filters(),
      });
    }
  }

  // Customer actions
   openAddCustomerModal(): void {
    // Create the modal
    this.currentModalRef = this.viewContainerRef.createComponent(ModalComponent);
    const modalInstance = this.currentModalRef.instance;

    // Configure modal
    this.currentModalRef.setInput('isOpen', true);
    this.currentModalRef.setInput('config', {
      title: 'Add New Customer',
      size: 'lg',
      showHeader: true,
      showFooter: true,
      closable: true,
      centered: true
    });

    // Create the form component inside modal
    this.currentFormRef = this.viewContainerRef.createComponent(CustomerFormComponent);
    const formInstance = this.currentFormRef.instance;

    // Configure form using setInput for signals
    this.currentFormRef.setInput('editMode', false);
    this.currentFormRef.setInput('showDebug', false);

    // Wait for form to initialize before tracking validity
    setTimeout(() => {
      if (!this.currentFormRef) return;

      // Track form validity for button state
      formInstance.formValid.subscribe(valid => {
        this.updateModalButtons();
      });

      // Configure modal buttons after form is ready
      this.updateModalButtons();
    }, 50);

    // Handle form submission
    formInstance.formSubmit.subscribe((customerData: CreateCustomerRequest | UpdateCustomerRequest) => {
      // Ensure required fields are present for CreateCustomerRequest
      if (
        typeof customerData.firstName === 'string' &&
        typeof customerData.lastName === 'string' &&
        typeof customerData.email === 'string'
      ) {
        this.store.createCustomer(customerData as CreateCustomerRequest);
        this.closeCurrentModal();
      } else {
        // Optionally handle the error case here
        console.error('Missing required fields for creating a customer', customerData);
      }
    });

    // Set modal content to the form component
    const formElement = this.currentFormRef.location.nativeElement;
    this.currentModalRef.setInput('content', ''); // Clear any HTML content

    // Insert form component into modal body
    setTimeout(() => {
      const modalBody = this.currentModalRef?.location.nativeElement.querySelector('.modal-body .flex-1');
      if (modalBody && formElement) {
        modalBody.appendChild(formElement);
      }
    });

    // Configure modal buttons
    this.updateModalButtons();

    // Handle modal close
    modalInstance.closed.subscribe(() => {
      this.closeCurrentModal();
    });

    modalInstance.backdropClick.subscribe(() => {
      this.closeCurrentModal();
    });
  }

  private updateModalButtons(): void {
    if (!this.currentModalRef || !this.currentFormRef) return;

    // Wait for the form to be fully initialized
    setTimeout(() => {
      if (!this.currentModalRef || !this.currentFormRef) return;

      const formInstance = this.currentFormRef.instance;
      const isEditMode = formInstance.editMode(); // Access signal value

      const buttons = [
        {
          label: 'Cancel',
          type: 'secondary' as const,
          action: () => {
            this.closeCurrentModal();
          },
        },
        {
          label: isEditMode ? 'Update Customer' : 'Add Customer',
          type: 'primary' as const,
          disabled: !formInstance.isFormValid(),
          action: () => {
            this.currentFormRef?.instance.submitForm();
          },
        },
      ];

      this.currentModalRef.setInput('buttons', buttons);
    }, 100);
  }

  private closeCurrentModal(): void {
    if (this.currentFormRef) {
      this.currentFormRef.destroy();
      this.currentFormRef = undefined;
    }
    if (this.currentModalRef) {
      this.currentModalRef.destroy();
      this.currentModalRef = undefined;
    }
  }

  viewCustomer(customer: Customer): void {
    this.store.loadCustomerById(customer.id);
    // TODO: Navigate to customer detail view or open modal
    console.log('View customer:', customer);
  }

  editCustomer(customer: Customer): void {
    // Create the modal
    this.currentModalRef =
      this.viewContainerRef.createComponent(ModalComponent);
    const modalInstance = this.currentModalRef.instance;

    // Configure modal
    this.currentModalRef.setInput('isOpen', true);
    this.currentModalRef.setInput('config', {
      title: 'Edit Customer',
      size: 'lg',
      showHeader: true,
      showFooter: true,
      closable: true,
      centered: true,
    });

    // Create the form component inside modal
    this.currentFormRef = this.viewContainerRef.createComponent(
      CustomerFormComponent
    );
    const formInstance = this.currentFormRef.instance;

    // Configure form for editing using setInput for signals
    this.currentFormRef.setInput('customer', customer);
    this.currentFormRef.setInput('editMode', true);
    this.currentFormRef.setInput('showDebug', false);

    // Track form validity for button state
    formInstance.formValid.subscribe((valid) => {
      this.updateModalButtons();
    });

    // Handle form submission
    formInstance.formSubmit.subscribe((customerData: UpdateCustomerRequest) => {
      this.store.updateCustomer({ id: customer.id, data: customerData });
      this.closeCurrentModal();
    });

    // Set modal content to the form component
    const formElement = this.currentFormRef.location.nativeElement;
    this.currentModalRef.setInput('content', ''); // Clear any HTML content

    // Insert form component into modal body
    setTimeout(() => {
      const modalBody =
        this.currentModalRef?.location.nativeElement.querySelector(
          '.modal-body .flex-1'
        );
      if (modalBody && formElement) {
        modalBody.appendChild(formElement);
      }
    });

    // Configure modal buttons
    this.updateModalButtons();

    // Handle modal close
    modalInstance.closed.subscribe(() => {
      this.closeCurrentModal();
    });

    modalInstance.backdropClick.subscribe(() => {
      this.closeCurrentModal();
    });
  }
  deleteCustomer(customer: Customer): void {
    this.modalService
      .confirm({
        title: 'Delete Customer',
        message: `Are you sure you want to delete ${customer.firstName} ${customer.lastName}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger',
      })
      .then((confirmed) => {
        if (confirmed) {
          this.store.deleteCustomer(customer.id);
        }
      });
  }

  // Helper methods for template
  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  getActiveCustomersCount(): number {
    return this.store
      .customers()
      .filter((customer: Customer) => customer.isActive).length;
  }

  getAverageSpent(): string {
    const customers = this.store.customers();
    if (customers.length === 0) return '$0';

    const total = customers.reduce(
      (sum: number, customer: Customer) => sum + customer.totalSpent,
      0
    );
    return '$' + (total / customers.length).toFixed(2);
  }

  getTotalOrders(): number {
    return this.store
      .customers()
      .reduce(
        (sum: number, customer: Customer) => sum + customer.totalOrders,
        0
      );
  }

  getCustomerAddress(customer: Customer): string {
    const parts = [customer.address, customer.city, customer.country].filter(
      (part) => part && part.trim()
    );
    return parts.join(', ');
  }

  getEndRecord(): number {
    const pagination = this.store.pagination();
    return Math.min(pagination.page * pagination.limit, pagination.total);
  }

  isAdminUser(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.role === 'admin';
  }

  // Content projection modal methods
  onCustomerSaved(customer: Customer): void {
    console.log('Customer saved via content projection:', customer);
    this.showContentProjectionModal = false;
    // Refresh the customers list
    this.store.loadCustomers({
      page: this.store.pagination().page,
      filters: this.store.filters(),
    });
  }

  doCustomAction(): void {
    console.log('Custom action triggered from content projection modal');
    // Add your custom logic here
    alert('Custom action executed! Check the console for details.');
  }

  // Demo methods to open content projection modals
  openContentProjectionModal(): void {
    this.showContentProjectionModal = true;
  }

  openCustomContentModal(): void {
    this.showCustomContentModal = true;
  }
}
