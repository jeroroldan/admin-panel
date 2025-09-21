import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Enums matching backend
export enum SaleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
  WHATSAPP = 'whatsapp',
}

// Interfaces
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  company?: string;
  dateOfBirth?: Date;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  costPrice: number;
  category?: string;
  brand?: string;
  stock: number;
  minStock: number;
  weight?: number;
  dimensions?: string;
  imageUrl?: string;
  additionalImages?: string[];
  status?: string;
  isFeatured: boolean;
  isActive: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  product: Product;
}

export interface Sale {
  id: string;
  customer: Customer;
  customerId: string;
  amount: number;
  saleDate: Date;
  status: SaleStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  saleItems: SaleItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSaleProductDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateSaleDto {
  customerEmail: string;
  products: CreateSaleProductDto[];
  saleDate: Date;
  status: SaleStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface UpdateSaleDto {
  status?: SaleStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  saleDate?: Date;
}

export interface SaleFilters {
  search?: string;
  status?: SaleStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaginatedSales {
  sales: Sale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalesApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sales`;

  // Get paginated sales with filters
  getSales(
    page: number = 1,
    limit: number = 10,
    filters?: SaleFilters
  ): Observable<ApiResponse<PaginatedSales>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.paymentMethod) params = params.set('paymentMethod', filters.paymentMethod);
    if (filters?.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params = params.set('dateTo', filters.dateTo);
    if (filters?.minAmount !== undefined) params = params.set('minAmount', filters.minAmount.toString());
    if (filters?.maxAmount !== undefined) params = params.set('maxAmount', filters.maxAmount.toString());

    return this.http.get<ApiResponse<PaginatedSales>>(this.apiUrl, { params });
  }

  // Get single sale by ID
  getSale(id: string): Observable<ApiResponse<Sale>> {
    return this.http.get<ApiResponse<Sale>>(`${this.apiUrl}/${id}`);
  }

  // Create new sale
  createSale(saleData: CreateSaleDto): Observable<ApiResponse<Sale>> {
    return this.http.post<ApiResponse<Sale>>(this.apiUrl, saleData);
  }

  // Update sale
  updateSale(id: string, updateData: UpdateSaleDto): Observable<ApiResponse<Sale>> {
    return this.http.patch<ApiResponse<Sale>>(`${this.apiUrl}/${id}`, updateData);
  }

  // Delete sale
  deleteSale(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(`${this.apiUrl}/${id}`);
  }

  // Get sales statistics
  getSalesStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/stats`);
  }
}
