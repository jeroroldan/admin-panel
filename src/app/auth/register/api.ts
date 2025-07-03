import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// ✅ Interfaces para el registro
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CheckEmailResponse {
  available: boolean;
  message: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class RegisterApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  /**
   * Registrar nuevo usuario
   */
  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.baseUrl}/register`, userData)
      .pipe(
        map((response) => {
          console.log('✅ Registration API response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Verificar si el email está disponible
   */
  checkEmailAvailability(email: string): Observable<CheckEmailResponse> {
    return this.http
      .post<CheckEmailResponse>(`${this.baseUrl}/check-email`, { email })
      .pipe(
        map((response) => {
          console.log('✅ Email check response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Verificar email con token
   */
  verifyEmail(token: string): Observable<VerifyEmailResponse> {
    return this.http
      .post<VerifyEmailResponse>(`${this.baseUrl}/verify-email`, { token })
      .pipe(
        map((response) => {
          console.log('✅ Email verification response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Reenviar email de verificación
   */
  resendVerificationEmail(
    email: string
  ): Observable<ResendVerificationResponse> {
    return this.http
      .post<ResendVerificationResponse>(`${this.baseUrl}/resend-verification`, {
        email,
      })
      .pipe(
        map((response) => {
          console.log('✅ Resend verification response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener lista de departamentos disponibles
   */
  getDepartments(): Observable<string[]> {
    return this.http
      .get<{ departments: string[] }>(`${this.baseUrl}/departments`)
      .pipe(
        map((response) => response.departments),
        catchError(this.handleError)
      );
  }

  /**
   * Validar token de invitación (si se usa sistema de invitaciones)
   */
  validateInvitationToken(
    token: string
  ): Observable<{ valid: boolean; invitationData?: any }> {
    return this.http
      .post<{ valid: boolean; invitationData?: any }>(
        `${this.baseUrl}/validate-invitation`,
        { token }
      )
      .pipe(
        map((response) => {
          console.log('✅ Invitation validation response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener configuración de registro (políticas, validaciones, etc.)
   */
  getRegistrationConfig(): Observable<RegistrationConfig> {
    return this.http
      .get<RegistrationConfig>(`${this.baseUrl}/registration-config`)
      .pipe(
        map((response) => {
          console.log('✅ Registration config response:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('❌ Registration API Error:', error);

    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Datos de registro inválidos';
          break;
        case 409:
          errorMessage = 'El email ya está registrado';
          break;
        case 422:
          errorMessage = 'Los datos proporcionados no son válidos';
          break;
        case 429:
          errorMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        case 503:
          errorMessage = 'Servicio no disponible temporalmente';
          break;
        default:
          errorMessage = `Error ${error.status}: ${
            error.error?.message || error.message
          }`;
      }
    }

    return throwError(() => new Error(errorMessage));
  };
}

// ✅ Interface para configuración de registro
export interface RegistrationConfig {
  passwordRequirements: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  allowedDomains?: string[];
  requireEmailVerification: boolean;
  requireInvitation: boolean;
  defaultRole: string;
  availableRoles: string[];
  termsAndConditionsUrl: string;
  privacyPolicyUrl: string;
}

// ✅ Clase utilitaria para validaciones del lado del cliente
export class RegisterValidationUtils {
  /**
   * Validar si el email tiene un formato válido
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validar fortaleza de contraseña
   */
  static validatePassword(
    password: string,
    config?: RegistrationConfig['passwordRequirements']
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const requirements = config || {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    };

    if (password.length < requirements.minLength) {
      errors.push(
        `La contraseña debe tener al menos ${requirements.minLength} caracteres`
      );
    }

    if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }

    if (requirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }

    if (requirements.requireNumbers && !/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }

    if (
      requirements.requireSpecialChars &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validar que las contraseñas coinciden
   */
  static passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  /**
   * Validar nombre (solo letras y espacios)
   */
  static isValidName(name: string): boolean {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return nameRegex.test(name) && name.trim().length >= 2;
  }

  /**
   * Validar teléfono
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }
}
