// sidebar.component.ts
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300"
      [class.w-64]="!isCollapsed"
      [class.w-20]="isCollapsed"
    >
      <!-- Logo/Brand -->
      <div
        class="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700"
      >
        <div
          class="flex items-center"
          [class.justify-center]="isCollapsed"
          [class.space-x-3]="!isCollapsed"
        >
          <div
            class="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
              />
            </svg>
          </div>
          @if (!isCollapsed) {
          <h1
            class="text-xl font-bold text-gray-900 dark:text-white"
          >
            SmartStore
          </h1>
          }
        </div>

        <!-- Collapse Button -->
        <button
          (click)="toggleSidebar()"
          class="ml-auto p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          [class.hidden]="isCollapsed"
        >
          <svg
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="mt-6 px-3">
        <ul class="space-y-1">
          @for (item of menuItems; track item.route) {
          <li>
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-l-3 border-primary-700 dark:border-primary-400"
              class="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group relative"
              [class.justify-center]="isCollapsed"
            >
              <svg
                class="w-5 h-5 flex-shrink-0"
                [class.mr-3]="!isCollapsed"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  [attr.d]="item.icon"
                />
              </svg>

              @if (!isCollapsed) {
              <span>{{ item.label }}</span>
              }

              @if (item.badge && !isCollapsed) {
              <span
                class="ml-auto bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-semibold px-2 py-0.5 rounded-full"
              >
                {{ item.badge }}
              </span>
              }

              <!-- Tooltip for collapsed state -->
              @if (isCollapsed) {
              <div
                class="absolute left-full ml-2 px-2 py-1 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
              >
                {{ item.label }}
                @if (item.badge) {
                <span class="ml-1">({{ item.badge }})</span>
                }
              </div>
              }
            </a>
          </li>
          }
        </ul>

        <!-- Divider -->
        <div class="my-6 border-t border-gray-200 dark:border-gray-700"></div>

        <!-- Secondary Menu -->
        <ul class="space-y-1">
          @for (item of secondaryMenuItems; track item.route) {
          <li>
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
              class="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group relative"
              [class.justify-center]="isCollapsed"
            >
              <svg
                class="w-5 h-5 flex-shrink-0"
                [class.mr-3]="!isCollapsed"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  [attr.d]="item.icon"
                />
              </svg>

              @if (!isCollapsed) {
              <span>{{ item.label }}</span>
              }

              <!-- Tooltip for collapsed state -->
              @if (isCollapsed) {
              <div
                class="absolute left-full ml-2 px-2 py-1 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
              >
                {{ item.label }}
              </div>
              }
            </a>
          </li>
          }
        </ul>
      </nav>

      <!-- User Profile (Bottom) -->
      <div
        class="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center" [class.justify-center]="isCollapsed">
          <div class="relative group">
            <button
              class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full"
            >
              <div
                class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <span class="text-white text-sm font-medium">JD</span>
              </div>
              @if (!isCollapsed) {
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
                >
                  John Doe
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  johnexample.com
                </p>
              </div>
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              }
            </button>

            <!-- Dropdown Menu -->
            <div
              class="absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <div class="p-3 border-b border-gray-200 dark:border-gray-700">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  John Doe
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  johnexample.com
                </p>
              </div>
              <div class="p-1">
                <button
                  (click)="logout()"
                  class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <svg
                    class="w-4 h-4 inline-block mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expand button when collapsed -->
      @if (isCollapsed) {
      <button
        (click)="toggleSidebar()"
        class="absolute top-20 -right-3 w-6 h-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
      >
        <svg
          class="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      }
    </aside>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .border-l-3 {
        border-left-width: 3px;
      }
    `,
  ],
})
export class SidebarComponent {
  isCollapsed = false;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      label: 'Products',
      route: '/products',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      badge: 24,
    },
    {
      label: 'Sales',
      route: '/sales',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      badge: 5,
    },
    {
      label: 'Customers',
      route: '/customers',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    },
  ];

  secondaryMenuItems: MenuItem[] = [
    {
      label: 'Settings',
      route: '/settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    },
  ];

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    // Implement logout logic
    console.log('Logging out...');
    this.router.navigate(['/login']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth < 768) {
      this.isCollapsed = true;
    }
  }
}
