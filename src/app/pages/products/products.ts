// products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image?: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your product inventory
          </p>
        </div>
        <button class="btn-primary mt-4 sm:mt-0">
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Product
        </button>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                [(ngModel)]="searchTerm"
                placeholder="Search products..."
                class="input-field pl-10"
              />
            </div>
          </div>

          <!-- Category Filter -->
          <select
            [(ngModel)]="selectedCategory"
            class="input-field w-full lg:w-48"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="accessories">Accessories</option>
            <option value="furniture">Furniture</option>
          </select>

          <!-- Status Filter -->
          <select
            [(ngModel)]="selectedStatus"
            class="input-field w-full lg:w-48"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
      >
        @for (product of filteredProducts; track product.id) {
        <div
          class="card hover:shadow-lg transition-all duration-200 cursor-pointer group"
        >
          <!-- Product Image -->
          <div
            class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden"
          >
            @if (product.image) {
            <img
              [src]="product.image"
              [alt]="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            } @else {
            <div class="w-full h-full flex items-center justify-center">
              <svg
                class="w-16 h-16 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            }
          </div>

          <!-- Product Info -->
          <div>
            <div class="flex items-start justify-between mb-2">
              <h3
                class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2"
              >
                {{ product.name }}
              </h3>
              <button
                class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>

            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {{ product.category }}
            </p>

            <div class="flex items-center justify-between mb-3">
              <span class="text-lg font-bold text-gray-900 dark:text-white">{{
                product.price | currency
              }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400"
                >{{ product.stock }} in stock</span
              >
            </div>

            <div class="flex items-center justify-between">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                [ngClass]="{
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400':
                    product.status === 'active',
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300':
                    product.status === 'inactive',
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400':
                    product.status === 'out_of_stock'
                }"
              >
                {{ formatStatus(product.status) }}
              </span>

              <div class="flex space-x-1">
                <button
                  class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  [routerLink]="['/products', product.id]"
                >
                  <svg
                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <svg
                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        }
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Showing <span class="font-medium">1</span> to
          <span class="font-medium">12</span> of
          <span class="font-medium">{{ products.length }}</span> results
        </p>

        <nav class="flex items-center space-x-2">
          <button
            class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button class="px-3 py-1 rounded-md bg-primary-600 text-white">
            1
          </button>
          <button
            class="px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            2
          </button>
          <button
            class="px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            3
          </button>
          <button
            class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  `,
})
export class ProductsComponent implements OnInit {
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';

  products: Product[] = [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones Premium Edition',
      category: 'electronics',
      price: 99.99,
      stock: 45,
      status: 'active',
    },
    {
      id: '2',
      name: 'Smart Watch Series 5',
      category: 'electronics',
      price: 299.99,
      stock: 0,
      status: 'out_of_stock',
    },
    {
      id: '3',
      name: 'Ergonomic Office Chair',
      category: 'furniture',
      price: 450.0,
      stock: 12,
      status: 'active',
    },
    {
      id: '4',
      name: 'USB-C Hub 7-in-1',
      category: 'accessories',
      price: 49.99,
      stock: 120,
      status: 'active',
    },
    {
      id: '5',
      name: 'Wireless Mouse',
      category: 'accessories',
      price: 29.99,
      stock: 200,
      status: 'active',
    },
    {
      id: '6',
      name: 'Standing Desk Converter',
      category: 'furniture',
      price: 199.99,
      stock: 8,
      status: 'inactive',
    },
    {
      id: '7',
      name: 'Laptop Stand Aluminum',
      category: 'accessories',
      price: 39.99,
      stock: 65,
      status: 'active',
    },
    {
      id: '8',
      name: '4K Webcam',
      category: 'electronics',
      price: 149.99,
      stock: 0,
      status: 'out_of_stock',
    },
  ];

  get filteredProducts(): Product[] {
    return this.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchesCategory =
        !this.selectedCategory || product.category === this.selectedCategory;
      const matchesStatus =
        !this.selectedStatus || product.status === this.selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  ngOnInit(): void {
    // Load products
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
