import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthState,
  UserRole
} from './models/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'admin_panel_token';
  private userKey = 'admin_panel_user';

  // Development mode flag
  private isDevelopmentMode = true; // Cambiar a false para producción

  private authState = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  public authState$ = this.authState.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadAuthState();
  }

  /**
   * Cargar estado de autenticación desde localStorage
   */
  private loadAuthState(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.authState.next({
          isAuthenticated: true,
          user,
          token
        });
      } catch (error) {
        this.clearAuthState();
      }
    }
  }

  /**
   * Development mode login with mock data
   */
  private loginDevelopmentMode(credentials: LoginRequest): Observable<AuthResponse> {
    // Simular diferentes usuarios según el email
    let mockUser: User;

    if (credentials.email === 'admin@test.com') {
      mockUser = {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@test.com',
        role: 'admin' as UserRole,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } else if (credentials.email === 'manager@test.com') {
      mockUser = {
        id: '2',
        firstName: 'Manager',
        lastName: 'User',
        email: 'manager@test.com',
        role: 'manager' as UserRole,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } else {
      mockUser = {
        id: '3',
        firstName: 'Employee',
        lastName: 'User',
        email: 'employee@test.com',
        role: 'employee' as UserRole,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    const mockResponse: AuthResponse = {
      access_token: 'mock-jwt-token-' + Date.now(),
      user: mockUser
    };

    // Simular delay de red
    return new Observable(observer => {
      setTimeout(() => {
        this.setAuthState(mockResponse);
        observer.next(mockResponse);
        observer.complete();
      }, 500);
    });
  }

  /**
   * Iniciar sesión
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Usar modo desarrollo si está habilitado
    if (this.isDevelopmentMode) {
      return this.loginDevelopmentMode(credentials);
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setAuthState(response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Development mode register with mock data
   */
  private registerDevelopmentMode(userData: RegisterRequest): Observable<AuthResponse> {
    const mockUser: User = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: 'employee' as UserRole, // Por defecto empleado
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockResponse: AuthResponse = {
      access_token: 'mock-jwt-token-' + Date.now(),
      user: mockUser
    };

    // Simular delay de red
    return new Observable(observer => {
      setTimeout(() => {
        this.setAuthState(mockResponse);
        observer.next(mockResponse);
        observer.complete();
      }, 500);
    });
  }

  /**
   * Registrar nuevo usuario
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    // Usar modo desarrollo si está habilitado
    if (this.isDevelopmentMode) {
      return this.registerDevelopmentMode(userData);
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          this.setAuthState(response);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  /**
   * Obtener perfil del usuario actual
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/profile`)
      .pipe(
        tap(user => {
          const currentState = this.authState.value;
          this.authState.next({
            ...currentState,
            user
          });
          localStorage.setItem(this.userKey, JSON.stringify(user));
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Validar token actual
   */
  validateToken(): Observable<{ valid: boolean; user: User }> {
    return this.http.get<{ valid: boolean; user: User }>(`${this.apiUrl}/auth/validate`)
      .pipe(
        tap(response => {
          if (response.valid) {
            const currentState = this.authState.value;
            this.authState.next({
              ...currentState,
              user: response.user
            });
            localStorage.setItem(this.userKey, JSON.stringify(response.user));
          } else {
            this.clearAuthState();
          }
        }),
        catchError((error) => {
          this.clearAuthState();
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return this.authState.value.token;
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.authState.value.user;
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  /**
   * Verificar si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Establecer estado de autenticación
   */
  private setAuthState(authResponse: AuthResponse): void {
    localStorage.setItem(this.tokenKey, authResponse.access_token);
    localStorage.setItem(this.userKey, JSON.stringify(authResponse.user));

    this.authState.next({
      isAuthenticated: true,
      user: authResponse.user,
      token: authResponse.access_token
    });
  }

  /**
   * Limpiar estado de autenticación
   */
  private clearAuthState(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);

    this.authState.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }

  /**
   * Manejar errores HTTP
   */
  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 401:
          errorMessage = 'Credenciales incorrectas';
          break;
        case 409:
          errorMessage = 'El usuario ya existe';
          break;
        case 400:
          errorMessage = 'Datos inválidos';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = error.error?.message || `Error código: ${error.status}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  };

  /**
   * MÉTODO DE DESARROLLO: Limpiar todos los datos de autenticación
   */
  clearAllAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.authState.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
    console.log('🔧 [DEV] Auth data cleared');
  }

  /**
   * MÉTODO DE DESARROLLO: Mostrar estado actual
   */
  showCurrentState(): void {
    const token = localStorage.getItem(this.tokenKey);
    const user = localStorage.getItem(this.userKey);
    const currentState = this.authState.value;

    console.log('🔧 [DEV] Current Auth State:', {
      hasToken: !!token,
      hasUser: !!user,
      isAuthenticated: currentState.isAuthenticated,
      user: currentState.user,
      localStorage: { token, user }
    });
  }
}
