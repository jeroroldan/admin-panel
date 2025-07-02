import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected baseUrl = environment.apiUrl;

  constructor(
    protected http: HttpClient,
    protected authService: AuthService
  ) {}

  /**
   * Obtener headers con autenticación
   */
  protected getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Obtener headers para upload de archivos
   */
  protected getFileHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Realizar GET request con autenticación
   */
  protected get<T>(url: string, options?: { params?: HttpParams }): Observable<T> {
    return this.http.get<T>(url, {
      headers: this.getHeaders(),
      params: options?.params,
      observe: 'body' as const
    }).pipe(catchError(this.handleError));
  }

  /**
   * Realizar POST request con autenticación
   */
  protected post<T>(url: string, body: any, options?: { params?: HttpParams }): Observable<T> {
    return this.http.post<T>(url, body, {
      headers: this.getHeaders(),
      params: options?.params,
      observe: 'body' as const
    }).pipe(catchError(this.handleError));
  }

  /**
   * Realizar PUT request con autenticación
   */
  protected put<T>(url: string, body: any, options?: { params?: HttpParams }): Observable<T> {
    return this.http.put<T>(url, body, {
      headers: this.getHeaders(),
      params: options?.params,
      observe: 'body' as const
    }).pipe(catchError(this.handleError));
  }

  /**
   * Realizar PATCH request con autenticación
   */
  protected patch<T>(url: string, body: any, options?: { params?: HttpParams }): Observable<T> {
    return this.http.patch<T>(url, body, {
      headers: this.getHeaders(),
      params: options?.params,
      observe: 'body' as const
    }).pipe(catchError(this.handleError));
  }

  /**
   * Realizar DELETE request con autenticación
   */
  protected delete<T>(url: string, options?: { params?: HttpParams }): Observable<T> {
    return this.http.delete<T>(url, {
      headers: this.getHeaders(),
      params: options?.params,
      observe: 'body' as const
    }).pipe(catchError(this.handleError));
  }

  /**
   * Upload de archivo con autenticación
   */
  protected uploadFile<T>(url: string, file: File, fieldName: string = 'file'): Observable<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    return this.http.post<T>(url, formData, {
      headers: this.getFileHeaders()
    }).pipe(catchError(this.handleError));
  }

  /**
   * Descargar archivo
   */
  protected downloadFile(url: string, filename?: string): Observable<Blob> {
    return this.http.get(url, {
      headers: this.getHeaders(),
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo centralizado de errores HTTP
   */
  protected handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Ha ocurrido un error inesperado';

    console.error('HTTP Error:', error);

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error de red: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar al servidor. Verifique su conexión a internet.';
          break;
        case 400:
          errorMessage = this.extractErrorMessage(error) || 'Solicitud inválida';
          break;
        case 401:
          errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
          // Opcional: redirigir al login
          this.authService.logout();
          break;
        case 403:
          errorMessage = 'No tiene permisos para realizar esta acción';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 409:
          errorMessage = this.extractErrorMessage(error) || 'Conflicto con el estado actual del recurso';
          break;
        case 422:
          errorMessage = this.extractValidationErrors(error) || 'Datos de validación incorrectos';
          break;
        case 429:
          errorMessage = 'Demasiadas solicitudes. Intente nuevamente en unos momentos.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = 'Servicio temporalmente no disponible. Intente nuevamente más tarde.';
          break;
        default:
          errorMessage = this.extractErrorMessage(error) || `Error ${error.status}: ${error.statusText}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  };

  /**
   * Extraer mensaje de error del response
   */
  private extractErrorMessage(error: HttpErrorResponse): string | null {
    if (error.error && typeof error.error === 'object') {
      return error.error.message || error.error.error || null;
    }
    if (typeof error.error === 'string') {
      return error.error;
    }
    return null;
  }

  /**
   * Extraer errores de validación
   */
  private extractValidationErrors(error: HttpErrorResponse): string | null {
    if (error.error && error.error.validationErrors) {
      const errors = Object.values(error.error.validationErrors).flat() as string[];
      return errors.join(', ');
    }
    return this.extractErrorMessage(error);
  }

  /**
   * Formatear fecha para API
   */
  protected formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Formatear fecha y hora para API
   */
  protected formatDateTime(date: Date): string {
    return date.toISOString();
  }

  /**
   * Parsear fecha desde API
   */
  protected parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Crear parámetros de paginación
   */
  protected createPaginationParams(page: number, limit: number): { [key: string]: string } {
    return {
      page: page.toString(),
      limit: limit.toString()
    };
  }

  /**
   * Validar respuesta de paginación
   */
  protected validatePaginationResponse<T>(response: any): {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    return {
      data: response.data || response.items || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || Math.ceil((response.total || 0) / (response.limit || 10))
    };
  }
}
