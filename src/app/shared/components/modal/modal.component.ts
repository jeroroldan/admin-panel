import { Component, input, output, OnInit, OnDestroy, computed, effect, signal, ElementRef, AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface ModalConfig {
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showHeader?: boolean;
  showFooter?: boolean;
  closable?: boolean;
  backdrop?: boolean;
  centered?: boolean;
  scrollable?: boolean;
  animation?: boolean;
  customClass?: string;
  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;
}

export interface ModalButton {
  label: string;
  action: () => void;
  type?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  customClass?: string;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Modal Backdrop -->
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
        [class.opacity-100]="isVisible()"
        [class.opacity-0]="!isVisible()"
        [class.items-center]="mergedConfig().centered"
        [class.items-start]="!mergedConfig().centered"
        [class.pt-20]="!mergedConfig().centered"
      >
        <!-- Backdrop -->
        @if (mergedConfig().backdrop) {
          <div
            class="fixed inset-0 bg-black transition-opacity duration-300"
            [class.bg-opacity-50]="isVisible()"
            [class.bg-opacity-0]="!isVisible()"
            (click)="onBackdropClick()"
          ></div>
        }

        <!-- Modal Container -->
        <div
          class="relative w-full max-h-full transform transition-all duration-300"
          [class]="getModalSizeClass()"
          [class.scale-100]="isVisible() && mergedConfig().animation"
          [class.scale-95]="!isVisible() && mergedConfig().animation"
          [class.translate-y-0]="isVisible() && mergedConfig().animation"
          [class.-translate-y-4]="!isVisible() && mergedConfig().animation"
        >
          <!-- Modal Content -->
          <div
            class="relative bg-white rounded-lg shadow-xl flex flex-col max-h-full"
            [class]="mergedConfig().customClass || ''"
            [class.overflow-hidden]="!mergedConfig().scrollable"
          >

            <!-- Header -->
            @if (mergedConfig().showHeader) {
              <div
                class="flex items-center justify-between p-6 border-b border-gray-200"
                [class]="mergedConfig().headerClass || ''"
              >
                <div class="flex-1 min-w-0">
                  @if (mergedConfig().title) {
                    <h3 class="text-lg font-semibold text-gray-900 truncate">
                      {{ mergedConfig().title }}
                    </h3>
                  }
                  @if (mergedConfig().subtitle) {
                    <p class="text-sm text-gray-500 mt-1">
                      {{ mergedConfig().subtitle }}
                    </p>
                  }
                  <!-- Custom Header Content -->
                  <ng-content select="[slot=header]"></ng-content>
                </div>

                @if (mergedConfig().closable) {
                  <button
                    type="button"
                    class="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    (click)="close()"
                    aria-label="Cerrar modal"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                }
              </div>
            }

            <!-- Body -->
            <div
              class="flex-1 p-6"
              [class]="mergedConfig().bodyClass || ''"
              [class.overflow-y-auto]="mergedConfig().scrollable"
              [class.max-h-96]="mergedConfig().scrollable && mergedConfig().size === 'sm'"
              [class.max-h-[32rem]]="mergedConfig().scrollable && mergedConfig().size === 'md'"
              [class.max-h-[40rem]]="mergedConfig().scrollable && mergedConfig().size === 'lg'"
              [class.max-h-[48rem]]="mergedConfig().scrollable && mergedConfig().size === 'xl'"
            >
              <!-- Loading State -->
              @if (loading()) {
                <div class="flex items-center justify-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span class="ml-3 text-gray-600">Cargando...</span>
                </div>
              } @else {
                <!-- Projected Content (Primary) -->
                <ng-content></ng-content>

                <!-- Custom Body Slot -->
                <ng-content select="[slot=body]"></ng-content>

                <!-- Dynamic Content (Fallback) -->
                @if (content() && !hasProjectedContent()) {
                  <div [innerHTML]="sanitizedContent()"></div>
                }
              }
            </div>

            <!-- Footer -->
            @if (mergedConfig().showFooter) {
              <div
                class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50"
                [class]="mergedConfig().footerClass || ''"
              >
                <!-- Custom Footer Content -->
                <ng-content select="[slot=footer]"></ng-content>

                <!-- Default Buttons -->
                @if (buttons() && buttons().length > 0) {
                  @for (button of buttons(); track button.label) {
                    <button
                      type="button"
                      class="px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                      [class]="getButtonClass(button)"
                      [disabled]="button.disabled || button.loading"
                      (click)="onButtonClick(button)"
                    >
                      @if (button.loading) {
                        <div class="flex items-center">
                          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          {{ button.label }}
                        </div>
                      } @else {
                        @if (button.icon) {
                          <div class="flex items-center">
                            <i [class]="button.icon + ' mr-2'"></i>
                            {{ button.label }}
                          </div>
                        } @else {
                          {{ button.label }}
                        }
                      }
                    </button>
                  }
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      position: relative;
      z-index: 1000;
    }
  `]
})
export class ModalComponent implements OnInit, OnDestroy, AfterContentInit {
  // Input signals
  isOpen = input<boolean>(false);
  config = input<ModalConfig>({});
  buttons = input<ModalButton[]>([]);
  content = input<string>('');
  loading = input<boolean>(false);

  // Output signals
  opened = output<void>();
  closed = output<void>();
  backdropClick = output<void>();

  // Internal state signals
  isVisible = signal(false);
  private timeoutId?: number;
  private hasContent = signal(false);

  // Content children to detect projected content
  @ContentChildren('*', { descendants: true }) contentElements!: QueryList<ElementRef>;

  // Default configuration
  private defaultConfig: ModalConfig = {
    title: '',
    subtitle: '',
    size: 'md',
    showHeader: true,
    showFooter: false,
    closable: true,
    backdrop: true,
    centered: true,
    scrollable: false,
    animation: true,
    customClass: '',
    headerClass: '',
    bodyClass: '',
    footerClass: ''
  };

  // Computed merged configuration
  mergedConfig = computed(() => ({ ...this.defaultConfig, ...this.config() }));

  // Computed sanitized content
  sanitizedContent = computed(() => {
    const htmlContent = this.content();
    if (!htmlContent) return null;
    return this.sanitizer.sanitize(1, htmlContent); // 1 = SecurityContext.HTML
  });

  constructor(private sanitizer: DomSanitizer) {
    // Effect to handle isOpen changes
    effect(() => {
      if (this.isOpen() && !this.isVisible()) {
        this.open();
      } else if (!this.isOpen() && this.isVisible()) {
        this.close();
      }
    });
  }

  ngOnInit() {
    // No need to merge config here anymore, it's handled by the computed signal
    if (this.isOpen()) {
      this.open();
    }
  }

  ngAfterContentInit() {
    // Check for projected content
    this.updateContentStatus();
    this.contentElements.changes.subscribe(() => {
      this.updateContentStatus();
    });
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    // Remove scroll lock on destroy
    document.body.classList.remove('overflow-hidden');
  }

  private updateContentStatus() {
    // Check if there's any projected content
    this.hasContent.set(this.contentElements && this.contentElements.length > 0);
  }

  hasProjectedContent(): boolean {
    return this.hasContent();
  }

  open() {
    if (this.isVisible()) return;

    // Lock body scroll
    document.body.classList.add('overflow-hidden');

    // Show modal immediately
    this.isVisible.set(false);

    // Trigger animation after a brief delay
    this.timeoutId = window.setTimeout(() => {
      this.isVisible.set(true);
      this.opened.emit();
    }, 10);
  }

  close() {
    if (!this.isVisible()) return;

    this.isVisible.set(false);

    // Wait for animation to complete before hiding
    this.timeoutId = window.setTimeout(() => {
      document.body.classList.remove('overflow-hidden');
      this.closed.emit();
    }, this.mergedConfig().animation ? 300 : 0);
  }

  onBackdropClick() {
    this.backdropClick.emit();
    if (this.mergedConfig().closable) {
      this.close();
    }
  }

  onButtonClick(button: ModalButton) {
    if (!button.disabled && !button.loading) {
      button.action();
    }
  }

  getModalSizeClass(): string {
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4'
    };
    return sizeClasses[this.mergedConfig().size || 'md'];
  }

  getButtonClass(button: ModalButton): string {
    const baseClass = 'px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const typeClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 disabled:bg-yellow-300'
    };

    const typeClass = typeClasses[button.type || 'secondary'];
    const customClass = button.customClass || '';

    return `${baseClass} ${typeClass} ${customClass}`.trim();
  }

  // Public methods for programmatic control
  public openModal() {
    // Note: For signals, these public methods now just trigger state changes
    // The effect will handle the actual opening/closing
    this.isVisible.set(true);
    this.open();
  }

  public closeModal() {
    this.close();
  }

  public toggleModal() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.openModal();
    }
  }
}
