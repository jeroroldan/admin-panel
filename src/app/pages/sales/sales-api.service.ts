import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Interfaces para Sales
export interface Sale {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: SaleStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress?: Address;
  billingAddress?: Address;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export enum SaleStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  OTHER = 'other'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIAL = 'partial'
}

export interface CreateSaleRequest {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  discount?: number;
  paymentMethod: PaymentMethod;
  shippingAddress?: Address;
  billingAddress?: Address;
  notes?: string;
}

export interface UpdateSaleRequest {
  status?: SaleStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface SaleListResponse {
  sales: Sale[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SaleFilters {
  search?: string;
  status?: SaleStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesApiService {
  private baseUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener lista de ventas con filtros y paginación
   */
  getSales(
    page: number = 1,
    limit: number = 10,
    filters?: SaleFilters
  ): Observable<SaleListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.paymentStatus) params = params.set('paymentStatus', filters.paymentStatus);
      if (filters.paymentMethod) params = params.set('paymentMethod', filters.paymentMethod);
      if (filters.customerId) params = params.set('customerId', filters.customerId);
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
      if (filters.minAmount !== undefined) params = params.set('minAmount', filters.minAmount.toString());
      if (filters.maxAmount !== undefined) params = params.set('maxAmount', filters.maxAmount.toString());
    }

    return this.http.get<SaleListResponse>(this.baseUrl, { params })
      .pipe(
        map(response => ({
          ...response,
          sales: response.sales.map(sale => ({
            ...sale,
            createdAt: new Date(sale.createdAt),
            updatedAt: new Date(sale.updatedAt)
          }))
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener venta por ID
   */
  getSaleById(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.baseUrl}/${id}`)
      .pipe(
        map(sale => ({
          ...sale,
          createdAt: new Date(sale.createdAt),
          updatedAt: new Date(sale.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Crear nueva venta
   */
  createSale(saleData: CreateSaleRequest): Observable<Sale> {
    return this.http.post<Sale>(this.baseUrl, saleData)
      .pipe(
        map(sale => ({
          ...sale,
          createdAt: new Date(sale.createdAt),
          updatedAt: new Date(sale.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar venta existente
   */
  updateSale(id: string, saleData: UpdateSaleRequest): Observable<Sale> {
    return this.http.put<Sale>(`${this.baseUrl}/${id}`, saleData)
      .pipe(
        map(sale => ({
          ...sale,
          createdAt: new Date(sale.createdAt),
          updatedAt: new Date(sale.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Cancelar venta
   */
  cancelSale(id: string, reason?: string): Observable<Sale> {
    return this.http.patch<Sale>(`${this.baseUrl}/${id}/cancel`, { reason })
      .pipe(
        map(sale => ({
          ...sale,
          createdAt: new Date(sale.createdAt),
          updatedAt: new Date(sale.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Procesar pago de venta
   */
  processPayment(id: string, paymentData: {
    amount: number;
    method: PaymentMethod;
    reference?: string;
  }): Observable<Sale> {
    return this.http.patch<Sale>(`${this.baseUrl}/${id}/payment`, paymentData)
      .pipe(
        map(sale => ({
          ...sale,
          createdAt: new Date(sale.createdAt),
          updatedAt: new Date(sale.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener estadísticas de ventas
   */
  getSalesStats(period?: 'today' | 'week' | 'month' | 'year'): Observable<{
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    salesByStatus: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
    salesByPaymentMethod: Array<{
      method: string;
      count: number;
      amount: number;
    }>;
    dailySales: Array<{
      date: string;
      sales: number;
      revenue: number;
    }>;
    topProducts: Array<{
      productId: string;
      productName: string;
      quantity: number;
      revenue: number;
    }>;
  }> {
    const params = period ? new HttpParams().set('period', period) : undefined;

    return this.http.get<any>(`${this.baseUrl}/stats`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener reporte de ventas
   */
  getSalesReport(
    dateFrom: string,
    dateTo: string,
    groupBy?: 'day' | 'week' | 'month'
  ): Observable<{
    period: string;
    summary: {
      totalSales: number;
      totalRevenue: number;
      averageOrderValue: number;
    };
    data: Array<{
      period: string;
      sales: number;
      revenue: number;
    }>;
  }> {
    let params = new HttpParams()
      .set('dateFrom', dateFrom)
      .set('dateTo', dateTo);

    if (groupBy) {
      params = params.set('groupBy', groupBy);
    }

    return this.http.get<any>(`${this.baseUrl}/report`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Generar factura PDF
   */
  generateInvoice(saleId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${saleId}/invoice`, {
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Enviar factura por email
   */
  sendInvoiceEmail(saleId: string, email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/${saleId}/send-invoice`, { email })
      .pipe(catchError(this.handleError));
  }

  /**
   * Exportar ventas a CSV
   */
  exportSales(filters?: SaleFilters): Observable<Blob> {
    let params = new HttpParams();

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.paymentStatus) params = params.set('paymentStatus', filters.paymentStatus);
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
    }

    return this.http.get(`${this.baseUrl}/export`, {
      params,
      responseType: 'blob'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Manejo de errores HTTP
   */
  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 403:
          errorMessage = 'Acceso denegado';
          break;
        case 404:
          errorMessage = 'Venta no encontrada';
          break;
        case 409:
          errorMessage = 'Conflicto en el estado de la venta';
          break;
        case 422:
          errorMessage = 'Datos de validación incorrectos';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = error.error?.message || `Error código: ${error.status}`;
      }
    }

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  };
}
