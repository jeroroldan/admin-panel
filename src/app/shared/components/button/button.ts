 import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable button component with consistent styling
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="onClick()"
      [attr.aria-label]="ariaLabel"
      [attr.title]="title">
      @if (loading) {
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      }
      @if (icon && !loading) {
        <ng-content select="[icon]"></ng-content>
      }
      <span class="button-text">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [`
    .btn {
      @apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200;
    }

    .btn-primary {
      @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
    }

    .btn-secondary {
      @apply bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500;
    }

    .btn-success {
      @apply bg-green-600 text-white hover:bg-green-700 focus:ring-green-500;
    }

    .btn-danger {
      @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
    }

    .btn-warning {
      @apply bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500;
    }

    .btn-outline {
      @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500;
    }

    .btn-ghost {
      @apply border-transparent bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500;
    }

    .btn-sm {
      @apply px-3 py-1.5 text-xs;
    }

    .btn-lg {
      @apply px-6 py-3 text-base;
    }

    .btn-icon {
      @apply p-2;
    }

    .button-text {
      @apply ml-2;
    }

    .btn-icon .button-text {
      @apply sr-only;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon = false;
  @Input() ariaLabel = '';
  @Input() title = '';

  @Output() clicked = new EventEmitter<void>();

  get buttonClasses(): string {
    const classes = ['btn'];

    // Variant classes
    classes.push(`btn-${this.variant}`);

    // Size classes
    if (this.size !== 'md') {
      classes.push(`btn-${this.size}`);
    }

    // Icon only class
    if (this.icon) {
      classes.push('btn-icon');
    }

    return classes.join(' ');
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
