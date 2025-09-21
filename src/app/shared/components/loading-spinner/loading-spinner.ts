import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Accessible loading spinner component
 * Provides visual feedback during loading states with screen reader support
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="spinner-container"
      [attr.aria-hidden]="!show"
      [style.width.px]="size"
      [style.height.px]="size">

      <!-- Spinner animation -->
      <div
        class="spinner"
        [class.visible]="show"
        [style.width.px]="size"
        [style.height.px]="size">

        <!-- Create rings dynamically based on ringCount -->
        @for (ring of rings; track ring.index) {
          <div
            class="spinner-ring"
            [style.animation-delay.ms]="ring.delay"
            [style.border-color]="getRingColor(ring.index)">
          </div>
        }
      </div>

      <!-- Screen reader announcement -->
      <div
        class="sr-only"
        [attr.aria-live]="ariaLive"
        [attr.aria-atomic]="ariaAtomic">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .spinner-container {
      @apply inline-flex items-center justify-center;
      @apply relative;
    }

    .spinner {
      @apply relative;
      @apply opacity-0 transition-opacity duration-200;
    }

    .spinner.visible {
      @apply opacity-100;
    }

    .spinner-ring {
      @apply absolute inset-0 rounded-full;
      @apply border-2 border-solid;
      border-top-color: transparent !important;
      @apply animate-spin;
    }

    /* Custom animation for smoother rotation */
    @keyframes smooth-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .spinner-ring {
      animation: smooth-spin 1s linear infinite;
    }

    /* Staggered animation delays */
    .spinner-ring:nth-child(1) { animation-delay: 0ms; }
    .spinner-ring:nth-child(2) { animation-delay: 150ms; }
    .spinner-ring:nth-child(3) { animation-delay: 300ms; }
    .spinner-ring:nth-child(4) { animation-delay: 450ms; }

    .sr-only {
      @apply absolute w-px h-px p-0 -m-px overflow-hidden;
      @apply whitespace-nowrap border-0;
      @apply pointer-events-none;
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .spinner-ring {
        @apply border-4;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .spinner {
        @apply opacity-100;
        animation: none;
      }

      .spinner-ring {
        animation: none;
        @apply opacity-60;
      }

      .spinner-ring:nth-child(1) { @apply opacity-100; }
      .spinner-ring:nth-child(2) { @apply opacity-80; }
      .spinner-ring:nth-child(3) { @apply opacity-60; }
      .spinner-ring:nth-child(4) { @apply opacity-40; }
    }
  `]
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  /** Whether to show the spinner */
  @Input() show = true;

  /** Loading message for screen readers */
  @Input() message = 'Cargando...';

  /** Spinner size in pixels */
  @Input() size = 24;

  /** Number of rings in the spinner */
  @Input() ringCount = 3;

  /** Color scheme */
  @Input() color: 'primary' | 'secondary' | 'white' | 'current' = 'primary';

  /** ARIA live region setting */
  get ariaLive(): string {
    return this.show ? 'polite' : 'off';
  }

  /** ARIA atomic setting */
  get ariaAtomic(): string | null {
    return 'true';
  }

  /** Generate ring configuration */
  get rings(): Array<{ index: number; delay: number }> {
    return Array.from({ length: this.ringCount }, (_, index) => ({
      index,
      delay: index * 150 // Stagger by 150ms
    }));
  }

  /** Track by function for ngFor */
  trackByIndex(index: number, item: any): number {
    return item.index;
  }

  /** Get color for each ring */
  getRingColor(index: number): string {
    const colors = {
      primary: ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'], // Blue to purple to pink
      secondary: ['#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6'], // Gray scale
      white: ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.2)'],
      current: ['currentColor', 'currentColor', 'currentColor', 'currentColor']
    };

    return colors[this.color][index] || colors[this.color][0];
  }

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}
