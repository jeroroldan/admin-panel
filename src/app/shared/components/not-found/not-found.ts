// not-found.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center">
        <div class="mb-8">
          <svg
            class="mx-auto h-32 w-32 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>

        <h2
          class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4"
        >
          Page Not Found
        </h2>

        <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. Perhaps you've
          mistyped the URL? Be sure to check your spelling.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button routerLink="/dashboard" class="btn-primary">
            <svg
              class="w-4 h-4 mr-2 -ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go to Dashboard
          </button>

          <button (click)="goBack()" class="btn-secondary">
            <svg
              class="w-4 h-4 mr-2 -ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>

        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Popular pages:
          </p>
          <div class="flex flex-wrap gap-2 justify-center">
            <a
              routerLink="/products"
              class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >Products</a
            >
            <span class="text-gray-300 dark:text-gray-600">•</span>
            <a
              routerLink="/sales"
              class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >Sales</a
            >
            <span class="text-gray-300 dark:text-gray-600">•</span>
            <a
              routerLink="/customers"
              class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >Customers</a
            >
            <span class="text-gray-300 dark:text-gray-600">•</span>
            <a
              routerLink="/settings"
              class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >Settings</a
            >
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {
  goBack(): void {
    window.history.back();
  }
}
