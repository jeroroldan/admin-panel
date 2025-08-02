import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  CustomerModel,
  ApiResponse,
  CustomerApiResponse,
  CustomerApiData,
} from './customer-model';

// Usar la interfaz del modelo
export { CustomerModel } from './customer-model';

export interface CustomerFilters {
  search?: string;
  isActive?: boolean;
  city?: string;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface CustomerPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface CustomerByIdResponse {
  data: CustomerApiData; // Cambiado a CustomerModel
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomersApiService {
  private apiUrl = `${environment.apiUrl}/customers`; // Cambiado a /customers para coincidir con el backend

  constructor(private http: HttpClient) {}

  getCustomers(filters?: CustomerFilters): Observable<{
    customers: CustomerModel[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    let params = new HttpParams();

    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters?.limit) {
      params = params.set('limit', filters.limit.toString());
    }
    if (filters?.isActive !== undefined) {
      params = params.set('isActive', filters.isActive.toString());
    }
    if (filters?.city) {
      params = params.set('city', filters.city);
    }
    if (filters?.country) {
      params = params.set('country', filters.country);
    }
    if (filters?.dateFrom) {
      params = params.set('dateFrom', filters.dateFrom);
    }
    if (filters?.dateTo) {
      params = params.set('dateTo', filters.dateTo);
    }

    return this.http
      .get<ApiResponse<CustomerApiResponse>>(this.apiUrl, { params })
      .pipe(
        map((response) => ({
          customers: CustomerModel.adaptMany(
            response.data.customers
          ) as CustomerModel[],
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
        })),
        catchError(this.handleError)
      );
  }

  getCustomerById(id: string): Observable<CustomerModel> {
    return this.http.get<CustomerByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      map((response) => CustomerModel.adapt(response.data) as CustomerModel),
      catchError(this.handleError)
    );
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  // getCustomerByEmail(email: string): Observable<CustomerModel | null> {
  //   return this.http
  //     .get<ApiResponse<CustomerApiResponse | null>>(
  //       `${this.apiUrl}/email/${email}`
  //     )
  //     .pipe(
  //       map((response) =>
  //         response.data ? CustomerModel.adapt(response.data as CustomerApiData) : null
  //       ),
  //       catchError(this.handleError)
  //     );
  // }

  // getCustomerByPhone(phone: string): Observable<CustomerModel | null> {
  //   return this.http
  //     .get<ApiResponse<CustomerApiResponse | null>>(
  //       `${this.apiUrl}/phone/${phone}`
  //     )
  //     .pipe(
  //       map((response) =>
  //         response.data ? CustomerModel.adapt(response.data) : null
  //       ),
  //       catchError(this.handleError)
  //     );
  // }

  getCustomerStats(id: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}/stats`).pipe(
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  exportCustomers(filters?: CustomerFilters): Observable<Blob> {
    let params = new HttpParams();

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.isActive !== undefined)
        params = params.set('isActive', filters.isActive.toString());
      if (filters.city) params = params.set('city', filters.city);
      if (filters.country) params = params.set('country', filters.country);
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
    }

    return this.http
      .get(`${this.apiUrl}/export`, {
        params,
        responseType: 'blob',
      })
      .pipe(catchError(this.handleError));
  }

  getCustomerOrders(
    customerId: string,
    page: number = 1,
    limit: number = 10
  ): Observable<{
    orders: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http
      .get<any>(`${this.apiUrl}/${customerId}/orders`, { params })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
