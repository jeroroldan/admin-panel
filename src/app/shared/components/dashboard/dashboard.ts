// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

interface RecentSale {
  id: string;
  customer: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        @for (stat of stats; track stat.title) {
        <div class="card hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ stat.title }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {{ stat.value }}
              </p>
              <div class="flex items-center mt-2">
                <svg
                  class="w-4 h-4 mr-1"
                  [class.text-green-500]="stat.change > 0"
                  [class.text-red-500]="stat.change < 0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    [attr.d]="
                      stat.change > 0
                        ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                        : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
                    "
                  />
                </svg>
                <span
                  class="text-sm"
                  [class.text-green-500]="stat.change > 0"
                  [class.text-red-500]="stat.change < 0"
                >
                  {{ Math.abs(stat.change) }}%
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400 ml-1"
                  >vs last month</span
                >
              </div>
            </div>
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center"
              [ngClass]="stat.color"
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
                  [attr.d]="stat.icon"
                />
              </svg>
            </div>
          </div>
        </div>
        }
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Sales Chart -->
        <div class="lg:col-span-2 card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sales Overview
          </h3>
          <div
            class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <p class="text-gray-500 dark:text-gray-400">Chart Component Here</p>
          </div>
        </div>

        <!-- Top Products -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Products
          </h3>
          <div class="space-y-4">
            @for (product of topProducts; track product.name) {
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700"
                ></div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ product.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ product.sales }} sales
                  </p>
                </div>
              </div>
              <span
                class="text-sm font-semibold text-gray-900 dark:text-white"
                >{{ product.revenue | currency }}</span
              >
            </div>
            }
          </div>
        </div>
      </div>

      <!-- Recent Sales Table -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Sales
          </h3>
          <button class="btn-primary text-sm">View All</button>
        </div>

        <div class="table-responsive">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              @for (sale of recentSales; track sale.id) {
              <tr
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td
                  class="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white"
                >
                  #{{ sale.id }}
                </td>
                <td class="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                  {{ sale.customer }}
                </td>
                <td
                  class="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ sale.amount | currency }}
                </td>
                <td class="py-4 px-4">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    [ngClass]="{
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400':
                        sale.status === 'completed',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400':
                        sale.status === 'pending',
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400':
                        sale.status === 'cancelled'
                    }"
                  >
                    {{ sale.status }}
                  </span>
                </td>
                <td class="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                  {{ sale.date | date : 'short' }}
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
export class DashboardComponent implements OnInit {
  Math = Math;

  stats: StatCard[] = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: 12.5,
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: 8.2,
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      color:
        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      title: 'Active Customers',
      value: '892',
      change: -2.1,
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      color:
        'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: 5.4,
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      color:
        'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    },
  ];

  topProducts = [
    { name: 'Wireless Headphones', sales: 124, revenue: 12400 },
    { name: 'Smart Watch', sales: 98, revenue: 29400 },
    { name: 'Laptop Stand', sales: 87, revenue: 2610 },
    { name: 'USB-C Hub', sales: 64, revenue: 3200 },
  ];

  recentSales: RecentSale[] = [
    {
      id: '3241',
      customer: 'John Smith',
      amount: 125.0,
      status: 'completed',
      date: new Date(),
    },
    {
      id: '3240',
      customer: 'Sarah Johnson',
      amount: 89.99,
      status: 'pending',
      date: new Date(),
    },
    {
      id: '3239',
      customer: 'Mike Wilson',
      amount: 250.0,
      status: 'completed',
      date: new Date(),
    },
    {
      id: '3238',
      customer: 'Emma Davis',
      amount: 45.5,
      status: 'cancelled',
      date: new Date(),
    },
    {
      id: '3237',
      customer: 'Chris Brown',
      amount: 178.0,
      status: 'completed',
      date: new Date(),
    },
  ];

  ngOnInit(): void {
    // Load dashboard data
  }
}
