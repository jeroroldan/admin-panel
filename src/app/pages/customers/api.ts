import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Interfaces para Customer
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  isActive: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersApiService {
  private baseUrl = `${environment.apiUrl}/customers`;
  private isDevelopmentMode = true; // Set to false for production

  constructor(private http: HttpClient) {}

  /**
   * Mock data for development mode
   */
  private mockCustomers: Customer[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      isActive: true,
      totalSpent: 1250.00,
      totalOrders: 8,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-06-20'),
      lastOrderDate: new Date('2024-06-18')
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-0456',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      country: 'USA',
      isActive: true,
      totalSpent: 2840.50,
      totalOrders: 15,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-06-19'),
      lastOrderDate: new Date('2024-06-19')
    },
    {
      id: '3',
      firstName: 'Carlos',
      lastName: 'García',
      email: 'carlos.garcia@example.com',
      phone: '+34-666-123456',
      address: 'Calle Mayor 45',
      city: 'Madrid',
      country: 'Spain',
      isActive: false,
      totalSpent: 890.25,
      totalOrders: 4,
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-04-15'),
      lastOrderDate: new Date('2024-04-12')
    },
    {
      id: '4',
      firstName: 'Marie',
      lastName: 'Dubois',
      email: 'marie.dubois@example.fr',
      phone: '+33-6-12-34-56-78',
      address: '12 Rue de la Paix',
      city: 'Paris',
      country: 'France',
      isActive: true,
      totalSpent: 3200.00,
      totalOrders: 22,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-06-21'),
      lastOrderDate: new Date('2024-06-21')
    },
    {
      id: '5',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      email: 'ahmed.hassan@example.com',
      phone: '+20-10-1234-5678',
      address: '78 Tahrir Square',
      city: 'Cairo',
      country: 'Egypt',
      isActive: true,
      totalSpent: 560.75,
      totalOrders: 3,
      createdAt: new Date('2024-05-12'),
      updatedAt: new Date('2024-06-10'),
      lastOrderDate: new Date('2024-06-08')
    }
  ];


  /**
   * Obtener cliente por ID
   */
  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`)
      .pipe(
        map(customer => ({
          ...customer,
          createdAt: new Date(customer.createdAt),
          updatedAt: new Date(customer.updatedAt),
          lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate) : undefined
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Development mode createCustomer with mock data
   */
  private createCustomerDevelopmentMode(customerData: CreateCustomerRequest): Observable<Customer> {
    const newCustomer: Customer = {
      id: Math.random().toString(36).substr(2, 9), // Generate random ID
      ...customerData,
      totalSpent: 0,
      totalOrders: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastOrderDate: undefined
    };

    // Add to mock data
    this.mockCustomers.push(newCustomer);

    return of(newCustomer).pipe(
      tap(() => console.log('[DEV MODE] Customer created:', newCustomer))
    );
  }

  /**
   * Development mode updateCustomer with mock data
   */
  private updateCustomerDevelopmentMode(id: string, customerData: UpdateCustomerRequest): Observable<Customer> {
    const customerIndex = this.mockCustomers.findIndex(c => c.id === id);
    if (customerIndex === -1) {
      return throwError(() => new Error('Customer not found'));
    }

    const updatedCustomer: Customer = {
      ...this.mockCustomers[customerIndex],
      ...customerData,
      updatedAt: new Date()
    };

    this.mockCustomers[customerIndex] = updatedCustomer;

    return of(updatedCustomer).pipe(
      tap(() => console.log('[DEV MODE] Customer updated:', updatedCustomer))
    );
  }

  /**
   * Development mode deleteCustomer with mock data
   */
  private deleteCustomerDevelopmentMode(id: string): Observable<void> {
    const customerIndex = this.mockCustomers.findIndex(c => c.id === id);
    if (customerIndex === -1) {
      return throwError(() => new Error('Customer not found'));
    }

    this.mockCustomers.splice(customerIndex, 1);

    return of(void 0).pipe(
      tap(() => console.log('[DEV MODE] Customer deleted:', id))
    );
  }

  /**
   * Crear nuevo cliente
   */
  createCustomer(customerData: CreateCustomerRequest): Observable<Customer> {
    if (this.isDevelopmentMode) {
      return this.createCustomerDevelopmentMode(customerData);
    }

    return this.http.post<Customer>(this.baseUrl, customerData)
      .pipe(
        map(customer => ({
          ...customer,
          createdAt: new Date(customer.createdAt),
          updatedAt: new Date(customer.updatedAt),
          lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate) : undefined
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar cliente existente
   */
  updateCustomer(id: string, customerData: UpdateCustomerRequest): Observable<Customer> {
    if (this.isDevelopmentMode) {
      return this.updateCustomerDevelopmentMode(id, customerData);
    }

    return this.http.put<Customer>(`${this.baseUrl}/${id}`, customerData)
      .pipe(
        map(customer => ({
          ...customer,
          createdAt: new Date(customer.createdAt),
          updatedAt: new Date(customer.updatedAt),
          lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate) : undefined
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Eliminar cliente (soft delete)
   */
  deleteCustomer(id: string): Observable<{ message: string }> {
    if (this.isDevelopmentMode) {
      return this.deleteCustomerDevelopmentMode(id).pipe(
        map(() => ({ message: 'Customer deleted successfully' }))
      );
    }

    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Activar/Desactivar cliente
   */
  toggleCustomerStatus(id: string, isActive: boolean): Observable<Customer> {
    return this.http.patch<Customer>(`${this.baseUrl}/${id}/status`, { isActive })
      .pipe(
        map(customer => ({
          ...customer,
          createdAt: new Date(customer.createdAt),
          updatedAt: new Date(customer.updatedAt),
          lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate) : undefined
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener estadísticas de clientes
   */
  getCustomerStats(): Observable<{
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    topCustomers: Array<{
      id: string;
      name: string;
      totalSpent: number;
      totalOrders: number;
    }>;
  }> {
    return this.http.get<any>(`${this.baseUrl}/stats`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Buscar clientes por texto
   */
  searchCustomers(query: string, limit: number = 5): Observable<Customer[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString());

    return this.http.get<Customer[]>(`${this.baseUrl}/search`, { params })
      .pipe(
        map(customers => customers.map(customer => ({
          ...customer,
          createdAt: new Date(customer.createdAt),
          updatedAt: new Date(customer.updatedAt),
          lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate) : undefined
        }))),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener historial de pedidos de un cliente
   */
  getCustomerOrders(customerId: string, page: number = 1, limit: number = 10): Observable<{
    orders: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.baseUrl}/${customerId}/orders`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Manejo de errores HTTP
   */
  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
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
          errorMessage = 'Cliente no encontrado';
          break;
        case 409:
          errorMessage = 'El cliente ya existe';
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
