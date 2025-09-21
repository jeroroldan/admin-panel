import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Accessible alert component for displaying messages
 * Supports different alert types with proper ARIA attributes
 */
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="alert"
      [ngClass]="alertClass"
      role="alert"
      [attr.aria-live]="ariaLive"
      [attr.aria-atomic]="ariaAtomic">

      <!-- Alert icon -->
      @if (showIcon) {
        <div class="alert-icon">
          <ng-content select="[alert-icon]">
            <!-- Default icons based on type -->
            @if (type === 'error') {
              <svg class="icon" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            }
            @if (type === 'success') {
              <svg class="icon" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            }
            @if (type === 'warning') {
              <svg class="icon" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            }
            @if (type === 'info') {
              <svg class="icon" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
            }
          </ng-content>
        </div>
      }

      <!-- Alert content -->
      <div class="alert-content">
        @if (title) {
          <h4 class="alert-title">{{ title }}</h4>
        }
        <div class="alert-message">
          <ng-content></ng-content>
        </div>
      </div>

      <!-- Dismiss button -->
      @if (dismissible) {
        <button
          type="button"
          class="alert-close"
          [attr.aria-label]="'Cerrar mensaje de ' + type"
          (click)="dismiss()"
          (keydown.enter)="dismiss()"
          (keydown.space)="$event.preventDefault(); dismiss()"
          tabindex="0">
          <svg class="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      }
    </div>
  `,
  styles: [`
    .alert {
      @apply flex items-start p-4 rounded-lg border;
      @apply transition-all duration-300 ease-in-out;
      @apply shadow-sm;
    }

    /* Alert type styles */
    .alert.error {
      @apply bg-red-50 border-red-200 text-red-800;
    }

    .alert.success {
      @apply bg-green-50 border-green-200 text-green-800;
    }

    .alert.warning {
      @apply bg-yellow-50 border-yellow-200 text-yellow-800;
    }

    .alert.info {
      @apply bg-blue-50 border-blue-200 text-blue-800;
    }

    .alert-icon {
      @apply flex-shrink-0 mr-3;
    }

    .icon {
      @apply w-5 h-5;
    }

    .alert-content {
      @apply flex-1;
    }

    .alert-title {
      @apply font-semibold mb-1;
    }

    .alert-message {
      @apply text-sm leading-relaxed;
    }

    .alert-close {
      @apply flex-shrink-0 ml-3 p-1 rounded-md;
      @apply text-current opacity-60 hover:opacity-100;
      @apply focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2;
      @apply transition-opacity duration-200;
    }

    .close-icon {
      @apply w-4 h-4;
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .alert {
        @apply border-4;
      }

      .alert-close {
        @apply border-2 border-current;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .alert {
        @apply transition-none;
      }
    }

    /* Dark mode support (if needed in future) */
    @media (prefers-color-scheme: dark) {
      .alert.error {
        @apply bg-red-900/20 border-red-700 text-red-200;
      }

      .alert.success {
        @apply bg-green-900/20 border-green-700 text-green-200;
      }

      .alert.warning {
        @apply bg-yellow-900/20 border-yellow-700 text-yellow-200;
      }

      .alert.info {
        @apply bg-blue-900/20 border-blue-700 text-blue-200;
      }
    }
  `]
})
export class AlertComponent implements OnInit, OnDestroy {
  /** Alert type */
  @Input() type: 'error' | 'success' | 'warning' | 'info' = 'info';

  /** Alert title */
  @Input() title = '';

  /** Whether to show the icon */
  @Input() showIcon = true;

  /** Whether the alert can be dismissed */
  @Input() dismissible = false;

  /** Whether to auto-dismiss after duration */
  @Input() autoClose = false;

  /** Auto-close duration in milliseconds */
  @Input() duration = 5000;

  /** Dismiss event emitter */
  @Output() dismissed = new EventEmitter<void>();

  /** Auto-close timer */
  private autoCloseTimer?: number;

  ngOnInit(): void {
    if (this.autoClose && this.duration > 0) {
      this.autoCloseTimer = window.setTimeout(() => {
        this.dismiss();
      }, this.duration);
    }
  }

  ngOnDestroy(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
  }

  /** Get CSS classes for the alert */
  get alertClass(): string {
    return `alert-${this.type}`;
  }

  /** Get ARIA live region setting */
  get ariaLive(): string {
    return this.type === 'error' ? 'assertive' : 'polite';
  }

  /** Get ARIA atomic setting */
  get ariaAtomic(): string | null {
    return this.type === 'error' ? 'true' : null;
  }

  /** Dismiss the alert */
  dismiss(): void {
    this.dismissed.emit();
  }
}
