// customers.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalSpent: number;
  orders: number;
  joinDate: Date;
  status: 'active' | 'inactive';
  avatar?: string;
}

@Component({
  selector: 'app-customers',
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
            Customers
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your customer relationships
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Send Email
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Add Customer
          </button>
        </div>
      </div>

      <!-- Customer Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="card">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Total Customers
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            1,248
          </p>
          <p class="text-xs text-green-600 dark:text-green-400 mt-2">
            +12% from last month
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Active Customers
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            892
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            71.5% of total
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Average Order Value
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            $156.50
          </p>
          <p class="text-xs text-green-600 dark:text-green-400 mt-2">
            +5.3% from last month
          </p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Customer Lifetime Value
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            $1,247
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Average CLV
          </p>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="card mb-6">
        <div class="flex flex-col lg:flex-row gap-4">
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
                placeholder="Search customers by name, email, or phone..."
                class="input-field pl-10"
              />
            </div>
          </div>

          <select [(ngModel)]="statusFilter" class="input-field w-full lg:w-48">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select [(ngModel)]="sortBy" class="input-field w-full lg:w-48">
            <option value="name">Sort by Name</option>
            <option value="spent">Sort by Total Spent</option>
            <option value="orders">Sort by Orders</option>
            <option value="date">Sort by Join Date</option>
          </select>
        </div>
      </div>

      <!-- Customers Grid/List -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        @for (customer of filteredCustomers; track customer.id) {
        <div class="card hover:shadow-md transition-shadow duration-200">
          <div class="flex items-start space-x-4">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              @if (customer.avatar) {
              <img
                [src]="customer.avatar"
                [alt]="customer.name"
                class="w-12 h-12 rounded-full"
              />
              } @else {
              <div
                class="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex items-center justify-center"
              >
                <span class="text-white font-medium">{{
                  getInitials(customer.name)
                }}</span>
              </div>
              }
            </div>

            <!-- Customer Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div>
                  <h3
                    class="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{ customer.name }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ customer.email }}
                  </p>
                </div>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  [ngClass]="{
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400':
                      customer.status === 'active',
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300':
                      customer.status === 'inactive'
                  }"
                >
                  {{ customer.status }}
                </span>
              </div>

              <div
                class="mt-3 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400"
              >
                <span class="flex items-center">
                  <svg
                    class="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {{ customer.phone }}
                </span>
                <span class="flex items-center">
                  <svg
                    class="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {{ customer.location }}
                </span>
              </div>

              <div
                class="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Total Spent
                  </p>
                  <p
                    class="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{ customer.totalSpent | currency }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Orders</p>
                  <p
                    class="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{ customer.orders }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Member Since
                  </p>
                  <p
                    class="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{ customer.joinDate | date : 'MMM y' }}
                  </p>
                </div>
              </div>

              <div class="mt-4 flex space-x-2">
                <button class="flex-1 btn-secondary text-sm py-1.5">
                  View Profile
                </button>
                <button class="flex-1 btn-primary text-sm py-1.5">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
        }
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex items-center justify-center">
        <nav class="flex items-center space-x-2">
          <button
            class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          @for (page of [1, 2, 3, 4, 5]; track page) {
          <button
            class="px-3 py-1 rounded-md transition-colors"
            [ngClass]="
              page === 1
                ? 'bg-primary-600 text-white'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            "
          >
            {{ page }}
          </button>
          }

          <span class="px-2 text-gray-500">...</span>
          <button
            class="px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            20
          </button>

          <button
            class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  `,
})
export class CustomersComponent {
  searchTerm = '';
  statusFilter = '';
  sortBy = 'name';

  constructor(private authService: AuthService) {}

  customers: Customer[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 234-567-8901',
      location: 'New York, USA',
      totalSpent: 2450.0,
      orders: 15,
      joinDate: new Date(2023, 2, 15),
      status: 'active',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1 234-567-8902',
      location: 'Los Angeles, USA',
      totalSpent: 1890.5,
      orders: 12,
      joinDate: new Date(2023, 5, 20),
      status: 'active',
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@example.com',
      phone: '+1 234-567-8903',
      location: 'Chicago, USA',
      totalSpent: 3200.0,
      orders: 24,
      joinDate: new Date(2022, 11, 10),
      status: 'active',
    },
    {
      id: '4',
      name: 'Emma Davis',
      email: 'emma.d@example.com',
      phone: '+1 234-567-8904',
      location: 'Houston, USA',
      totalSpent: 450.0,
      orders: 3,
      joinDate: new Date(2024, 0, 5),
      status: 'inactive',
    },
    {
      id: '5',
      name: 'Chris Brown',
      email: 'chris.brown@example.com',
      phone: '+1 234-567-8905',
      location: 'Phoenix, USA',
      totalSpent: 1750.0,
      orders: 8,
      joinDate: new Date(2023, 8, 12),
      status: 'active',
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      email: 'lisa.a@example.com',
      phone: '+1 234-567-8906',
      location: 'Philadelphia, USA',
      totalSpent: 920.75,
      orders: 6,
      joinDate: new Date(2023, 10, 30),
      status: 'active',
    },
  ];

  get filteredCustomers(): Customer[] {
    let filtered = this.customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.phone.includes(this.searchTerm);
      const matchesStatus =
        !this.statusFilter || customer.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort customers
    return filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'spent':
          return b.totalSpent - a.totalSpent;
        case 'orders':
          return b.orders - a.orders;
        case 'date':
          return b.joinDate.getTime() - a.joinDate.getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }

  ngOnInit(): void {
    // Load customers
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
