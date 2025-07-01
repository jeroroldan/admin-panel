// sales.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

interface Sale {
  id: string;
  orderNumber: string;
  customer: string;
  date: Date;
  items: number;
  total: number;
  status: 'completed' | 'processing' | 'shipped' | 'cancelled';
  paymentMethod: string;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Sales
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track and manage your sales orders
          </p>
        </div>
        <div class="flex gap-3 mt-4 sm:mt-0">
          <button class="btn-secondary">
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            Export
          </button>
          <button class="btn-primary">
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
            New Sale
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Total Sales
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                $125,430
              </p>
            </div>
            <div
              class="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
</div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Orders Today
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                42
              </p>
            </div>
            <div
              class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
</div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Average Order
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                $89.50
              </p>
            </div>
            <div
              class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Pending Orders
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                8
              </p>
            </div>
            <div
              class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              placeholder="Search by order number or customer..."
              class="input-field"
            />
</div>

          <input
            type="date"
            [(ngModel)]="dateFilter"
            class="input-field w-full lg:w-auto"
/>

          <select [(ngModel)]="statusFilter" class="input-field w-full lg:w-48">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <!-- Sales Table -->
      <div class="card">
        <div class="table-responsive">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                </th>
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Order
                </th>
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Items
                </th>
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Payment
                </th>
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              @for (sale of filteredSales; track sale.id) {
              <tr
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td class="py-4 px-4">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                  />
                </td>
                <td class="py-4 px-4">
                  <a
                    href="#"
                    class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                    >{{ sale.orderNumber }}</a
                  >
                </td>
                <td class="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                  {{ sale.customer }}
                </td>
                <td class="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                  {{ sale.date | date : 'MMM d, y' }}
                </td>
                <td class="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                  {{ sale.items }}
                </td>
                <td
                  class="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ sale.total | currency }}
                </td>
                <td class="py-4 px-4">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    [ngClass]="{
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400':
                        sale.status === 'completed',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400':
                        sale.status === 'processing',
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400':
                        sale.status === 'shipped',
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400':
                        sale.status === 'cancelled'
                    }"
                  >
                    {{ sale.status }}
                  </span>
                </td>
                <td class="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                  <span class="capitalize">{{ sale.paymentMethod }}</span>
                </td>
                <td class="py-4 px-4">
                  <div class="flex items-center space-x-2">
                    <button
                      class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg
                        class="w-4 h-4"
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
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class SalesComponent {
  searchTerm = '';
  dateFilter = '';
  statusFilter = '';

  constructor(private authService: AuthService) {}

  sales: Sale[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: 'John Smith',
      date: new Date(),
      items: 3,
      total: 125.99,
      status: 'completed',
      paymentMethod: 'credit card',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: 'Sarah Johnson',
      date: new Date(),
      items: 1,
      total: 89.99,
      status: 'processing',
      paymentMethod: 'paypal',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customer: 'Mike Wilson',
      date: new Date(),
      items: 5,
      total: 450.0,
      status: 'shipped',
      paymentMethod: 'credit card',
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      customer: 'Emma Davis',
      date: new Date(),
      items: 2,
      total: 75.5,
      status: 'cancelled',
      paymentMethod: 'debit card',
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-005',
      customer: 'Chris Brown',
      date: new Date(),
      items: 4,
      total: 225.0,
      status: 'completed',
      paymentMethod: 'bank transfer',
    },
  ];

  get filteredSales(): Sale[] {
    return this.sales.filter((sale) => {
      const matchesSearch =
        sale.orderNumber
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        sale.customer.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus =
        !this.statusFilter || sale.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  ngOnInit(): void {
    // Load sales data
  }
}

