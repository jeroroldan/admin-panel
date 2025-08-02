// layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar';
import { HeaderComponent } from './header';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar, HeaderComponent],
  template: `
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Sidebar -->
      <aside class="hidden lg:flex lg:flex-shrink-0">
        <app-sidebar></app-sidebar>
      </aside>

      <!-- Mobile sidebar overlay -->
      <div
        *ngIf="isMobileSidebarOpen"
        class="fixed inset-0 z-40 flex lg:hidden"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-gray-900 transition-all duration-300 ease-in-out mobile-overlay"
          [class.bg-opacity-50]="!isClosing"
          [class.bg-opacity-0]="isClosing"
          [class.animate-fade-in]="!isClosing"
          (click)="closeMobileSidebar()"
        ></div>

        <!-- Sidebar -->
        <div class="relative flex w-full max-w-xs flex-1 flex-col bg-gray-900 dark:bg-gray-950 transform sidebar-shadow"
             [class.animate-slide-in-left]="!isClosing"
             [class.animate-slide-out-left]="isClosing">
          <!-- Close button -->
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white close-button-hover transition-all duration-200"
              (click)="closeMobileSidebar()"
            >
              <span class="sr-only">Cerrar sidebar</span>
              <svg class="h-6 w-6 text-white transition-transform duration-200 hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <app-sidebar (linkClick)="closeMobileSidebar()"></app-sidebar>
        </div>
      </div>

      <!-- Main content -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Header -->
        <app-header
          [isMobileSidebarOpen]="isMobileSidebarOpen"
          (mobileMenuToggle)="toggleMobileSidebar()"
        ></app-header>

        <!-- Main content area -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div class="container mx-auto px-6 py-8">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }

    /* Animaciones personalizadas para el sidebar móvil */
    @keyframes slideInLeft {
      0% {
        transform: translateX(-100%);
        opacity: 0;
      }
      60% {
        transform: translateX(-10%);
        opacity: 0.8;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOutLeft {
      0% {
        transform: translateX(0);
        opacity: 1;
      }
      100% {
        transform: translateX(-100%);
        opacity: 0;
      }
    }

    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes fadeOut {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    .animate-slide-in-left {
      animation: slideInLeft 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }

    .animate-slide-out-left {
      animation: slideOutLeft 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
    }

    .animate-fade-in {
      animation: fadeIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }

    /* Mejoras adicionales para el overlay */
    .mobile-overlay {
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    /* Sombra suave para el sidebar */
    .sidebar-shadow {
      box-shadow:
        0 25px 50px -12px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(0, 0, 0, 0.05);
    }

    /* Hover effects mejorados */
    .close-button-hover:hover {
      transform: scale(1.05);
      background-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class Layout {
  isMobileSidebarOpen = false;
  isClosing = false;

  toggleMobileSidebar() {
    if (this.isMobileSidebarOpen) {
      this.closeMobileSidebar();
    } else {
      this.isMobileSidebarOpen = true;
      this.isClosing = false;
    }
  }

  closeMobileSidebar() {
    this.isClosing = true;
    // Delay hiding the sidebar to allow animation to complete
    setTimeout(() => {
      this.isMobileSidebarOpen = false;
      this.isClosing = false;
    }, 300);
  }
}
