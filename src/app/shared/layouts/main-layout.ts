import {
  Component,
  ViewContainerRef,
  OnInit,
  inject,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterModule,
  Router,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';
import { Loading } from '../components/loading/loading';
import { MainLayoutStore } from './main-layout-store';
import { AuthService } from '../../auth/auth.service';
import { ModalService } from '../components/modal/modal-service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Loading],
  template: `
    <div
      class="main-container min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden"
    >
      <!-- Sidebar -->
      <div
        class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 dark:bg-gray-950 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0"
        [class.translate-x-0]="isSidebarOpen()"
        [class.-translate-x-full]="!isSidebarOpen()"
      >
        <div class="flex h-full flex-col">
          <!-- Logo -->
          <div
            class="flex h-16 shrink-0 items-center px-6 border-b border-gray-700 dark:border-gray-800"
          >
            <h1
              class="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            >
              Admin Panel
            </h1>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 px-4 py-6 space-y-1">
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-indigo-600 text-white border-r-2 border-indigo-400"
              class="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 dark:text-gray-400 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white transition-colors"
            >
              <svg
                class="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm0 0V9a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              Dashboard
            </a>

            @if (hasAnyRole(['admin', 'manager'])) {
            <a
              routerLink="/products"
              routerLinkActive="bg-indigo-600 text-white border-r-2 border-indigo-400"
              class="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 dark:text-gray-400 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white transition-colors"
            >
              <svg
                class="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              Productos
            </a>
            }

            <a
              routerLink="/sales"
              routerLinkActive="bg-indigo-600 text-white border-r-2 border-indigo-400"
              class="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 dark:text-gray-400 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white transition-colors"
            >
              <svg
                class="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Ventas
            </a>

            @if (hasAnyRole(['admin', 'manager'])) {
            <a
              routerLink="/customers"
              routerLinkActive="bg-indigo-600 text-white border-r-2 border-indigo-400"
              class="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 dark:text-gray-400 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white transition-colors"
            >
              <svg
                class="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Clientes
            </a>
            } @if (hasRole('admin')) {
            <a
              routerLink="/settings"
              routerLinkActive="bg-indigo-600 text-white border-r-2 border-indigo-400"
              class="group flex items-center px-3 py-2 text-sm font-medium text-gray-300 dark:text-gray-400 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white transition-colors"
            >
              <svg
                class="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Configuración
            </a>
            }
          </nav>

          <!-- User Info at Bottom -->
          <div
            class="flex-shrink-0 border-t border-gray-700 dark:border-gray-800 p-4"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="h-8 w-8 rounded-full bg-indigo-600 dark:bg-indigo-700 flex items-center justify-center"
                >
                  <span class="text-sm font-medium text-white">{{
                    getUserInitials()
                  }}</span>
                </div>
              </div>
              <div class="ml-3 flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">
                  {{ getCurrentUser()?.firstName || 'Usuario' }}
                  {{ getCurrentUser()?.lastName || '' }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {{ getCurrentUser()?.role || 'guest' }}
                </p>
              </div>
              <button
                (click)="logout()"
                class="ml-2 flex-shrink-0 p-1 text-gray-400 dark:text-gray-500 hover:text-gray-300 dark:hover:text-gray-400 transition-colors"
              >
                <svg
                  class="h-5 w-5"
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
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile sidebar overlay -->
      @if (isSidebarOpen()) {
      <div class="fixed inset-0 z-40 lg:hidden">
        <div
          class="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          (click)="toggleSidebar()"
        ></div>
      </div>
      }

      <!-- Main content -->
      <div class="lg:pl-64">
        <!-- Top bar -->
        <div
          class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors duration-300"
        >
          <button
            type="button"
            class="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            (click)="toggleSidebar()"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <!-- Breadcrumbs -->
          <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div class="flex items-center">
              <nav class="flex" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-4">
                  <li>
                    <div>
                      <a
                        routerLink="/dashboard"
                        class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                      >
                        <svg
                          class="h-5 w-5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                          />
                        </svg>
                      </a>
                    </div>
                  </li>
                  <li>
                    <div class="flex items-center">
                      <svg
                        class="h-5 w-5 flex-shrink-0 text-gray-300 dark:text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                      <span
                        class="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400 capitalize"
                      >
                        {{ getCurrentPageName() }}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <!-- User menu and theme toggle -->
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <!-- Notification button -->
            <button
              class="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:scale-105"
              title="Notifications"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <!-- Notification dot -->
              <span
                class="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"
              ></span>
            </button>

            <!-- Theme toggle button -->
            <button
              (click)="toggleDarkMode()"
              class="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transform hover:scale-105"
              title="Toggle theme"
            >
              <!-- Sun icon for light mode -->
              <svg
                *ngIf="!isDarkMode()"
                class="h-5 w-5 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <!-- Moon icon for dark mode -->
              <svg
                *ngIf="isDarkMode()"
                class="h-5 w-5 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>



            <div
              class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-gray-700"
            ></div>


            <!-- User dropdown -->
            <div class="relative user-dropdown-full-container">
              <button
                (click)="toggleUserDropdown($event)"
                class="flex items-center gap-x-2 p-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                [attr.aria-expanded]="isUserDropdownOpen()"
              >
                <div
                  class="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-white dark:ring-gray-800 shadow-lg"
                >
                  <span class="text-sm font-semibold text-white">{{
                    getUserInitials()
                  }}</span>
                </div>
                <div class="hidden lg:block text-left">
                  <div
                    class="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {{ getCurrentUser()?.firstName || 'Usuario' }}
                    {{ getCurrentUser()?.lastName || '' }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getCurrentUser()?.email || 'email@example.com' }}
                  </div>
                </div>
                <svg
                  class="h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200"
                  [class.rotate-180]="isUserDropdownOpen()"
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
              </button>

              <!-- Dropdown menu -->
              @if (isUserDropdownOpen()) {
              <div
                class="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none transform transition-all duration-200 ease-out origin-top-right z-50"
                [class.opacity-0]="!isUserDropdownOpen()"
                [class.scale-95]="!isUserDropdownOpen()"
                [class.opacity-100]="isUserDropdownOpen()"
                [class.scale-100]="isUserDropdownOpen()"
              >
                <div class="p-1">
                  <!-- User info section -->
                  <div
                    class="px-4 py-3 border-b border-gray-100 dark:border-gray-700"
                  >
                    <div class="flex items-center gap-3">
                      <div
                        class="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
                      >
                        <span class="text-sm font-semibold text-white">{{
                          getUserInitials()
                        }}</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div
                          class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate"
                        >
                          {{ getCurrentUser()?.firstName || 'Usuario' }}
                          {{ getCurrentUser()?.lastName || '' }}
                        </div>
                        <div
                          class="text-xs text-gray-500 dark:text-gray-400 truncate"
                        >
                          {{ getCurrentUser()?.email || 'email@example.com' }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Menu items -->
                  <div class="py-2">
                    <a
                      routerLink="/profile"
                      class="group flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg mx-1 transition-all duration-150"
                      (click)="closeUserDropdown()"
                    >
                      <div
                        class="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <span class="font-medium">Mi Perfil</span>
                    </a>

                    <a
                      routerLink="/account"
                      class="group flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg mx-1 transition-all duration-150"
                      (click)="closeUserDropdown()"
                    >
                      <div
                        class="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span class="font-medium">Configuración</span>
                    </a>

                    <a
                      routerLink="/notifications"
                      class="group flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg mx-1 transition-all duration-150"
                      (click)="closeUserDropdown()"
                    >
                      <div
                        class="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </div>
                      <span class="font-medium">Notificaciones</span>
                    </a>

                    <a
                      routerLink="/help"
                      class="group flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg mx-1 transition-all duration-150"
                      (click)="closeUserDropdown()"
                    >
                      <div
                        class="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span class="font-medium">Centro de Ayuda</span>
                    </a>
                  </div>

                  <!-- Divider -->
                  <div
                    class="border-t border-gray-100 dark:border-gray-700 my-1"
                  ></div>

                  <!-- Logout section -->
                  <div class="py-1">
                    <button
                      (click)="logout()"
                      class="group w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mx-1 transition-all duration-150"
                    >
                      <div
                        class="flex-shrink-0 w-5 h-5 group-hover:scale-110 transition-transform duration-150"
                      >
                        <svg
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
                      </div>
                      <span class="font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </div>
              }
            </div>
          </div>
        </div>

        <!-- Page content -->
        <main class="py-6 w-full">
          <div class="px-4 sm:px-6 lg:px-8 w-full max-w-full">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>

      <!-- Global Loading Component -->
      <app-loading></app-loading>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        overflow-x: hidden;
      }

      /* Prevenir scroll horizontal */
      .main-container {
        max-width: 100vw;
        overflow-x: hidden;
      }

      /* Asegurar que el contenido no se desborde */
      .content-wrapper {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }
    `,
  ],
})
export class MainLayout implements OnInit {
  MainLayoutStore = inject(MainLayoutStore);
  authService = inject(AuthService);
  modalService = inject(ModalService);

  constructor(
    private viewContainerRef: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Inicializar el estado pasando todas las dependencias
    this.MainLayoutStore.initialize(
      this.viewContainerRef,
      this.authService,
      this.router,
      this.modalService
    );

    // Suscribirse a cambios de ruta para actualizar la página actual
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.MainLayoutStore.updateCurrentPage(this.router);
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    // Solo cerrar el dropdown si el click es realmente fuera del contenedor completo
    const userDropdownContainer = target.closest(
      '.user-dropdown-full-container'
    );

    if (!userDropdownContainer && this.isUserDropdownOpen()) {
      this.MainLayoutStore.closeUserDropdown();
    }
  }

  // Getters para el template
  getCurrentUser() {
    return this.MainLayoutStore.getCurrentUser();
  }

  getUserInitials() {
    return this.MainLayoutStore.userInitials();
  }

  getCurrentPageName() {
    return this.MainLayoutStore.getCurrentPageName();
  }

  getRoleClass(role: string | undefined) {
    return this.MainLayoutStore.getRoleClass(role);
  }

  // Getters para estados
  isSidebarOpen() {
    return this.MainLayoutStore.isSidebarOpen();
  }

  isDarkMode() {
    return this.MainLayoutStore.isDarkMode();
  }

  isUserDropdownOpen() {
    return this.MainLayoutStore.isUserDropdownOpen();
  }

  // Acciones
  toggleSidebar() {
    this.MainLayoutStore.toggleSidebar();
  }

  toggleDarkMode() {
    this.MainLayoutStore.toggleDarkMode();
  }

  toggleUserDropdown(event: Event) {
    // Prevenir propagación del evento para evitar que se cierre inmediatamente
    event.stopPropagation();
    event.preventDefault();

    this.MainLayoutStore.toggleUserDropdown();
  }

  closeUserDropdown() {
    this.MainLayoutStore.closeUserDropdown();
  }

  // Wrappers para métodos que necesitan dependencias
  logout() {
    this.MainLayoutStore.logout(this.authService, this.router);
  }

  hasRole(role: string): boolean {
    return this.MainLayoutStore.hasRole(role, this.authService);
  }

  hasAnyRole(roles: string[]): boolean {
    return this.MainLayoutStore.hasAnyRole(roles, this.authService);
  }
}

