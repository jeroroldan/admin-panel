// product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  images: string[];
  specifications: { [key: string]: string };
  tags: string[];
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="animate-fade-in">
      <!-- Back Button -->
      <div class="mb-6">
        <button
          routerLink="/products"
          class="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg
            class="w-4 h-4 mr-2"
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
          Back to Products
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Product Images -->
        <div class="lg:col-span-1">
          <div class="card">
            <div
              class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden"
            >
              @if (product.images.length > 0) {
              <img
                [src]="product.images[selectedImageIndex]"
                [alt]="product.name"
                class="w-full h-full object-cover"
              />
              } @else {
              <div class="w-full h-full flex items-center justify-center">
                <svg
                  class="w-24 h-24 text-gray-400 dark:text-gray-600"
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

            <!-- Image Thumbnails -->
            @if (product.images.length > 1) {
            <div class="grid grid-cols-4 gap-2">
              @for (image of product.images; track $index) {
              <button
                (click)="selectedImageIndex = $index"
                class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 transition-colors"
                [class.border-primary-500]="selectedImageIndex === $index"
                [class.border-transparent]="selectedImageIndex !== $index"
              >
                <img
                  [src]="image"
                  [alt]="'Product image ' + ($index + 1)"
                  class="w-full h-full object-cover"
                />
              </button>
              }
            </div>
            }

            <!-- Upload New Images -->
            <div class="mt-4">
              <button class="w-full btn-secondary text-sm">
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload Images
              </button>
            </div>
          </div>
        </div>

        <!-- Product Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Info -->
          <div class="card">
            <h2
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Product Information
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Product Name</label
                >
                <input
                  type="text"
                  [(ngModel)]="product.name"
                  class="input-field"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >SKU</label
                >
                <input
                  type="text"
                  [(ngModel)]="product.sku"
                  class="input-field"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Category</label
                >
                <select [(ngModel)]="product.category" class="input-field">
                  <option value="electronics">Electronics</option>
                  <option value="accessories">Accessories</option>
                  <option value="furniture">Furniture</option>
                  <option value="clothing">Clothing</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Status</label
                >
                <select [(ngModel)]="product.status" class="input-field">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Description</label
                >
                <textarea
                  [(ngModel)]="product.description"
                  rows="4"
                  class="input-field"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Pricing & Inventory -->
          <div class="card">
            <h2
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Pricing & Inventory
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Price</label
                >
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    >$</span
                  >
                  <input
                    type="number"
                    [(ngModel)]="product.price"
                    class="input-field pl-7"
                  />
                </div>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Compare at Price</label
                >
                <div class="relative">
                  <span
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    >$</span
                  >
                  <input
                    type="number"
                    [(ngModel)]="product.comparePrice"
                    class="input-field pl-7"
                  />
                </div>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Stock Quantity</label
                >
                <input
                  type="number"
                  [(ngModel)]="product.stock"
                  class="input-field"
                />
              </div>
            </div>

            <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    Track Inventory
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Receive alerts when stock is low
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"
                  ></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Specifications -->
          <div class="card">
            <h2
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Specifications
            </h2>

            <div class="space-y-3">
              @for (spec of getSpecifications(); track spec.key) {
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  [value]="spec.key"
                  placeholder="Property"
                  class="input-field flex-1"
                />
                <input
                  type="text"
                  [value]="spec.value"
                  placeholder="Value"
                  class="input-field flex-1"
                />
                <button
                  class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <svg
                    class="w-5 h-5"
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
              }

              <button class="btn-secondary text-sm">
                <svg
                  class="w-4 h-4 mr-2"
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
                Add Specification
              </button>
            </div>
          </div>

          <!-- Tags -->
          <div class="card">
            <h2
              class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Tags
            </h2>

            <div class="flex flex-wrap gap-2 mb-4">
              @for (tag of product.tags; track tag) {
              <span
                class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm flex items-center"
              >
                {{ tag }}
                <button
                  class="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
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
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
              }
            </div>

            <div class="flex space-x-2">
              <input
                type="text"
                placeholder="Add a tag..."
                class="input-field flex-1"
              />
              <button class="btn-secondary">Add</button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between">
            <button
              class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
            >
              Delete Product
            </button>

            <div class="flex space-x-3">
              <button routerLink="/products" class="btn-secondary">
                Cancel
              </button>
              <button class="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProductDetailComponent implements OnInit {
  selectedImageIndex = 0;

  product: ProductDetail = {
    id: '1',
    name: 'Wireless Bluetooth Headphones Premium Edition',
    description:
      'Experience superior sound quality with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
    category: 'electronics',
    price: 99.99,
    comparePrice: 149.99,
    stock: 45,
    sku: 'WBH-001',
    status: 'active',
    images: [],
    specifications: {
      'Battery Life': '30 hours',
      Connectivity: 'Bluetooth 5.0',
      Weight: '250g',
      Color: 'Black',
      Warranty: '2 years',
    },
    tags: [
      'wireless',
      'bluetooth',
      'headphones',
      'premium',
      'noise-cancelling',
    ],
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get product ID from route and load product details
    const productId = this.route.snapshot.paramMap.get('id');
    // Load product data based on ID
  }

  getSpecifications(): { key: string; value: string }[] {
    return Object.entries(this.product.specifications).map(([key, value]) => ({
      key,
      value,
    }));
  }
}
