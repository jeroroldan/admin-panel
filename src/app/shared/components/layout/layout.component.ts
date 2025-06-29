// layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
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
        (click)="closeMobileSidebar()"
      >
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        <div class="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800">
          <app-sidebar></app-sidebar>
        </div>
      </div>

      <!-- Main content -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Header -->
        <app-header></app-header>

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
  `]
})
export class LayoutComponent {
  isMobileSidebarOpen = false;

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }
}
