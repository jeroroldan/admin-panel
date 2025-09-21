import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

// Types and interfaces
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  company?: string;
  dateOfBirth?: Date;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  company?: string;
  dateOfBirth?: Date;
  notes?: string;
}

export interface UpdateCustomerDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  company?: string;
  dateOfBirth?: Date;
  notes?: string;
  isActive?: boolean;
}

export interface CustomerFilters {
  search?: string;
  isActive?: boolean;
}

export interface PaginatedCustomers {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomersApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/customers`;

  // Get paginated customers with optional filters
  getCustomers(
    page: number = 1,
    limit: number = 10,
    filters?: CustomerFilters
  ): Observable<ApiResponse<PaginatedCustomers>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    if (filters?.isActive !== undefined) {
      params = params.set('isActive', filters.isActive.toString());
    }

    return this.http.get<ApiResponse<PaginatedCustomers>>(this.apiUrl, { params });
  }

  // Get single customer by ID
  getCustomer(id: string): Observable<ApiResponse<Customer>> {
    return this.http.get<ApiResponse<Customer>>(`${this.apiUrl}/${id}`);
  }

  // Create new customer
  createCustomer(customerData: CreateCustomerDto): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customerData);
  }

  // Update customer
  updateCustomer(id: string, customerData: UpdateCustomerDto): Observable<ApiResponse<Customer>> {
    return this.http.patch<ApiResponse<Customer>>(`${this.apiUrl}/${id}`, customerData);
  }

  // Delete customer (soft delete)
  deleteCustomer(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.apiUrl}/${id}`);
  }

  // Get customer statistics
  getCustomerStats(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/stats`);
  }

  // Search customers by email (for sales integration)
  searchCustomersByEmail(email: string): Observable<Customer[]> {
    const params = new HttpParams()
      .set('search', email)
      .set('limit', '10');

    return this.http.get<ApiResponse<PaginatedCustomers>>(this.apiUrl, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data.customers;
          }
          return [];
        })
      );
  }
}
