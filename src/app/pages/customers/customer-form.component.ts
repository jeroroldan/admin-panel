import {
  Component,
  input,
  output,
  OnInit,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from './api';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="customerForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- First Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            First Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            formControlName="firstName"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            [class.border-red-300]="
              customerForm.get('firstName')?.invalid &&
              customerForm.get('firstName')?.touched
            "
            [class.border-gray-300]="
              !customerForm.get('firstName')?.invalid ||
              !customerForm.get('firstName')?.touched
            "
          />
          @if (customerForm.get('firstName')?.invalid &&
          customerForm.get('firstName')?.touched) {
          <p class="mt-1 text-sm text-red-600">First name is required</p>
          }
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            formControlName="lastName"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            [class.border-red-300]="
              customerForm.get('lastName')?.invalid &&
              customerForm.get('lastName')?.touched
            "
            [class.border-gray-300]="
              !customerForm.get('lastName')?.invalid ||
              !customerForm.get('lastName')?.touched
            "
          />
          @if (customerForm.get('lastName')?.invalid &&
          customerForm.get('lastName')?.touched) {
          <p class="mt-1 text-sm text-red-600">Last name is required</p>
          }
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            type="email"
            formControlName="email"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            [class.border-red-300]="
              customerForm.get('email')?.invalid &&
              customerForm.get('email')?.touched
            "
            [class.border-gray-300]="
              !customerForm.get('email')?.invalid ||
              !customerForm.get('email')?.touched
            "
          />
          @if (customerForm.get('email')?.invalid &&
          customerForm.get('email')?.touched) {
          <div class="mt-1 text-sm text-red-600">
            @if (customerForm.get('email')?.errors?.['required']) {
            <p>Email is required</p>
            } @if (customerForm.get('email')?.errors?.['email']) {
            <p>Please enter a valid email address</p>
            }
          </div>
          }
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Phone</label
          >
          <input
            type="tel"
            formControlName="phone"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Address</label
          >
          <input
            type="text"
            formControlName="address"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <!-- City -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >City</label
          >
          <input
            type="text"
            formControlName="city"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <!-- Country -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Country</label
          >
          <input
            type="text"
            formControlName="country"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <!-- Active Status (only for edit mode) -->
        @if (editMode()) {
        <div class="md:col-span-2">
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              formControlName="isActive"
              class="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span class="text-sm font-medium text-gray-700"
              >Active Customer</span
            >
          </label>
        </div>
        }
      </div>

      <!-- Form Status Display (for development) -->
      @if (showDebug()) {
      <div class="mt-4 p-3 bg-gray-100 rounded-md text-xs">
        <p><strong>Form Valid:</strong> {{ customerForm.valid }}</p>
        <p><strong>Form Value:</strong> {{ customerForm.value | json }}</p>
      </div>
      }
    </form>
  `,
})
export class CustomerFormComponent implements OnInit {
  // Input signals
  customer = input<Customer | undefined>();
  editMode = input<boolean>(false);
  showDebug = input<boolean>(false);

  // Output signals
  formSubmit = output<CreateCustomerRequest | UpdateCustomerRequest>();
  formValid = output<boolean>();

  private fb = inject(FormBuilder);

  customerForm!: FormGroup;

  constructor() {
    // Effect to reinitialize form when customer input changes
    effect(() => {
      const customerData = this.customer();
      if (this.customerForm) {
        this.initializeForm();
      }
    });
  }

  ngOnInit() {
    this.initializeForm();

    // Emit form validity changes
    this.customerForm.statusChanges.subscribe(() => {
      this.formValid.emit(this.customerForm.valid);
    });
  }

  private initializeForm() {
    const customerData = this.customer();
    const isEditMode = this.editMode();

    this.customerForm = this.fb.group({
      firstName: [
        customerData?.firstName || '',
        [Validators.required, Validators.minLength(2)],
      ],
      lastName: [
        customerData?.lastName || '',
        [Validators.required, Validators.minLength(2)],
      ],
      email: [
        customerData?.email || '',
        [Validators.required, Validators.email],
      ],
      phone: [customerData?.phone || ''],
      address: [customerData?.address || ''],
      city: [customerData?.city || ''],
      country: [customerData?.country || ''],
      ...(isEditMode && { isActive: [customerData?.isActive ?? true] }),
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.value;

      // Clean up empty strings to undefined for optional fields
      const customerData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone || undefined,
        address: formValue.address || undefined,
        city: formValue.city || undefined,
        country: formValue.country || undefined,
        ...(this.editMode() && { isActive: formValue.isActive }),
      };

      this.formSubmit.emit(customerData);
    } else {
      // Mark all fields as touched to show validation errors
      this.customerForm.markAllAsTouched();
    }
  }

  // Public method to trigger form submission
  public submitForm() {
    this.onSubmit();
  }

  // Public method to check if form is valid
  public isFormValid(): boolean {
    return this.customerForm?.valid ?? false;
  }

  // Public method to get form value
  public getFormValue() {
    return this.customerForm?.value ?? null;
  }

  // Public method to reset form
  public resetForm() {
    this.customerForm.reset();
    this.initializeForm();
  }
}
