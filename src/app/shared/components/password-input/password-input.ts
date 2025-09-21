import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input';

/**
 * Specialized password input component with visibility toggle
 * Extends the base form input with password-specific features
 */
@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [CommonModule, FormInputComponent],
  template: `
    <app-form-input
      [control]="control"
      [label]="label"
      [inputType]="inputType"
      [placeholder]="placeholder"
      [autocomplete]="autocomplete"
      [required]="required"
      [hint]="hint"
      [customClasses]="customClasses"
      (focus)="focus.emit($event)"
      (blur)="blur.emit($event)"
      (input)="input.emit($event)">

      <!-- Password visibility toggle button -->
      <button
        type="button"
        input-suffix
        class="password-toggle"
        [attr.aria-label]="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        [attr.aria-pressed]="showPassword"
        (click)="toggleVisibility()"
        (keydown.enter)="toggleVisibility()"
        (keydown.space)="$event.preventDefault(); toggleVisibility()"
        tabindex="0">

        <!-- Eye icon for showing password -->
        @if (!showPassword) {
          <svg
            class="eye-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
        }

        <!-- Eye slash icon for hiding password -->
        @if (showPassword) {
          <svg
            class="eye-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
          </svg>
        }
      </button>
    </app-form-input>
  `,
  styles: [`
    .password-toggle {
      @apply absolute inset-y-0 right-0 pr-3 flex items-center;
      @apply text-gray-500 hover:text-gray-700 focus:text-gray-700;
      @apply transition-colors duration-200;
      @apply rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
    }

    .eye-icon {
      @apply w-5 h-5;
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .password-toggle {
        @apply border-2 border-current;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .password-toggle {
        @apply transition-none;
      }
    }
  `]
})
export class PasswordInputComponent {
  /** Form control for the password input */
  @Input() control!: FormControl;

  /** Label text for the input */
  @Input() label = 'Contraseña';

  /** Placeholder text */
  @Input() placeholder = 'Ingresa tu contraseña';

  /** Autocomplete attribute */
  @Input() autocomplete = 'current-password';

  /** Whether the field is required */
  @Input() required = true;

  /** Hint text to display */
  @Input() hint = '';

  /** Custom CSS classes */
  @Input() customClasses: { [key: string]: string } = {};

  /** Focus event emitter */
  @Output() focus = new EventEmitter<FocusEvent>();

  /** Blur event emitter */
  @Output() blur = new EventEmitter<FocusEvent>();

  /** Input event emitter */
  @Output() input = new EventEmitter<Event>();

  /** Password visibility state */
  showPassword = false;

  /** Get the current input type based on visibility */
  get inputType(): 'password' | 'text' {
    return this.showPassword ? 'text' : 'password';
  }

  /** Toggle password visibility */
  toggleVisibility(): void {
    this.showPassword = !this.showPassword;

    // Announce the change to screen readers
    const announcement = this.showPassword ? 'Contraseña visible' : 'Contraseña oculta';
    this.announceToScreenReader(announcement);
  }

  /** Announce changes to screen readers */
  private announceToScreenReader(message: string): void {
    // Create a temporary element for screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    announcement.textContent = message;
    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}
