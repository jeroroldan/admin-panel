import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

/**
 * Reusable form input component with accessibility support
 * Provides consistent styling and behavior across the application
 */
@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-field" [attr.aria-invalid]="hasError">
      <!-- Label -->
      <label
        [for]="inputId"
        class="form-label"
        [class.required]="required">
        {{ label }}
        <span *ngIf="required" class="required-indicator" aria-label="required">*</span>
      </label>

      <!-- Input container -->
      <div class="input-container" [class.focused]="isFocused">
        <input
          [id]="inputId"
          [type]="inputType"
          [formControl]="control"
          [placeholder]="placeholder"
          [autocomplete]="autocomplete"
          [attr.aria-describedby]="errorId"
          [attr.aria-required]="required"
          class="form-input"
          [class.error]="hasError"
          [class.success]="hasSuccess"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (input)="onInput($event)">

        <!-- Input suffix content projection -->
        <ng-content select="[input-suffix]"></ng-content>
      </div>

      <!-- Error message -->
      @if (hasError) {
        <div
          [id]="errorId"
          class="form-error"
          role="alert"
          aria-live="polite">
          <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span>{{ getFirstError() }}</span>
        </div>
      }

      <!-- Hint text -->
      @if (hint && !hasError) {
        <div class="form-hint" [id]="hintId">
          {{ hint }}
        </div>
      }
    </div>
  `,
  styles: [`
    .form-field {
      @apply mb-4;
    }

    .form-label {
      @apply block text-sm font-medium text-gray-700 mb-2;
    }

    .form-label.required {
      @apply after:content-['_*'] after:text-red-500 after:ml-1;
    }

    .required-indicator {
      @apply text-red-500 ml-1;
    }

    .input-container {
      @apply relative;
    }

    .input-container.focused {
      @apply ring-2 ring-indigo-500 ring-opacity-50;
    }

    .form-input {
      @apply w-full px-4 py-3 border-2 rounded-lg transition-all duration-200;
      @apply focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500;
      @apply placeholder-gray-400;
    }

    .form-input.error {
      @apply border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500;
    }

    .form-input.success {
      @apply border-green-500 bg-green-50 focus:ring-green-500 focus:border-green-500;
    }

    .form-input:disabled {
      @apply bg-gray-100 cursor-not-allowed opacity-60;
    }

    .form-error {
      @apply mt-2 text-sm text-red-600 flex items-center space-x-1;
    }

    .error-icon {
      @apply w-4 h-4 flex-shrink-0;
    }

    .form-hint {
      @apply mt-2 text-sm text-gray-500;
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .form-input {
        @apply border-4;
      }

      .form-input:focus {
        @apply ring-4 ring-offset-2;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .form-input,
      .input-container {
        @apply transition-none;
      }
    }
  `]
})
export class FormInputComponent implements OnInit {
  /** Form control for the input */
  @Input() control!: FormControl;

  /** Label text for the input */
  @Input() label = '';

  /** Input type (text, email, password, etc.) */
  @Input() inputType: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';

  /** Placeholder text */
  @Input() placeholder = '';

  /** Autocomplete attribute */
  @Input() autocomplete = 'off';

  /** Whether the field is required */
  @Input() required = false;

  /** Hint text to display below the input */
  @Input() hint = '';

  /** Custom CSS classes */
  @Input() customClasses: { [key: string]: string } = {};

  /** Focus event emitter */
  @Output() focus = new EventEmitter<FocusEvent>();

  /** Blur event emitter */
  @Output() blur = new EventEmitter<FocusEvent>();

  /** Input event emitter */
  @Output() input = new EventEmitter<Event>();

  /** Unique IDs for accessibility */
  inputId = '';
  errorId = '';
  hintId = '';

  /** Focus state */
  isFocused = false;

  ngOnInit(): void {
    // Generate unique IDs for accessibility
    const uniqueId = `input-${Math.random().toString(36).substr(2, 9)}`;
    this.inputId = uniqueId;
    this.errorId = `error-${uniqueId}`;
    this.hintId = `hint-${uniqueId}`;
  }

  /** Whether the input has validation errors */
  get hasError(): boolean {
    return this.control?.invalid && (this.control?.touched || this.control?.dirty);
  }

  /** Whether the input has successful validation */
  get hasSuccess(): boolean {
    return this.control?.valid && this.control?.touched && this.control?.value;
  }

  /** Get the first validation error message */
  getFirstError(): string {
    if (!this.control?.errors) return '';

    const errors = this.control.errors;
    const errorKeys = Object.keys(errors);

    // Define error messages for common validators
    const errorMessages: { [key: string]: (error: any) => string } = {
      required: () => `${this.label} es requerido`,
      email: () => 'Formato de correo electrónico inválido',
      minlength: (error) => `Debe tener al menos ${error.requiredLength} caracteres`,
      maxlength: (error) => `No puede tener más de ${error.requiredLength} caracteres`,
      pattern: () => 'Formato inválido',
      min: (error) => `El valor mínimo es ${error.min}`,
      max: (error) => `El valor máximo es ${error.max}`,
    };

    for (const key of errorKeys) {
      if (errorMessages[key]) {
        return errorMessages[key](errors[key]);
      }
    }

    return 'Campo inválido';
  }

  /** Handle focus event */
  onFocus(): void {
    this.isFocused = true;
    this.focus.emit();
  }

  /** Handle blur event */
  onBlur(): void {
    this.isFocused = false;
    this.blur.emit();
  }

  /** Handle input event */
  onInput(event: Event): void {
    this.input.emit(event);
  }
}
