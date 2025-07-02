import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Interfaces para Product
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  category: string;
  brand?: string;
  imageUrl?: string;
  isActive: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  category: string;
  brand?: string;
  imageUrl?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  stock?: number;
  category?: string;
  brand?: string;
  imageUrl?: string;
  isActive?: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags?: string[];
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener lista de productos con filtros y paginación
   */
  getProducts(
    page: number = 1,
    limit: number = 10,
    filters?: ProductFilters
  ): Observable<ProductListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.brand) params = params.set('brand', filters.brand);
      if (filters.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());
      if (filters.minPrice !== undefined) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.inStock !== undefined) params = params.set('inStock', filters.inStock.toString());
    }

    return this.http.get<ProductListResponse>(this.baseUrl, { params })
      .pipe(
        map(response => ({
          ...response,
          products: response.products.map(product => ({
            ...product,
            createdAt: new Date(product.createdAt),
            updatedAt: new Date(product.updatedAt)
          }))
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener producto por ID
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`)
      .pipe(
        map(product => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Crear nuevo producto
   */
  createProduct(productData: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, productData)
      .pipe(
        map(product => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar producto existente
   */
  updateProduct(id: string, productData: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, productData)
      .pipe(
        map(product => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Eliminar producto
   */
  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Actualizar stock de producto
   */
  updateStock(id: string, stock: number): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}/stock`, { stock })
      .pipe(
        map(product => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        })),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener categorías disponibles
   */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener marcas disponibles
   */
  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/brands`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Buscar productos por texto
   */
  searchProducts(query: string, limit: number = 5): Observable<Product[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString());

    return this.http.get<Product[]>(`${this.baseUrl}/search`, { params })
      .pipe(
        map(products => products.map(product => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        }))),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener estadísticas de productos
   */
  getProductStats(): Observable<{
    total: number;
    active: number;
    inactive: number;
    lowStock: number;
    outOfStock: number;
    categories: Array<{
      name: string;
      count: number;
    }>;
  }> {
    return this.http.get<any>(`${this.baseUrl}/stats`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Subir imagen de producto
   */
  uploadProductImage(productId: string, file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<{ imageUrl: string }>(`${this.baseUrl}/${productId}/image`, formData)
      .pipe(catchError(this.handleError));
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
          errorMessage = 'Producto no encontrado';
          break;
        case 409:
          errorMessage = 'El producto ya existe';
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
