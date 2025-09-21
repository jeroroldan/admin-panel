import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// ✅ Definir UserRole directamente aquí
export type UserRole = 'admin' | 'manager' | 'employee' | 'user';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    // First try to get from localStorage (for backward compatibility)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      return storedToken;
    }

    // Then try to get from user object
    const user = this.getUser();
    return user?.token || user?.access_token || null;
  }

  storeCredentials(token: string, user: any): void {
    localStorage.setItem('token', token);
    // Also store the token in the user object for consistency
    const userWithToken = { ...user, token };
    localStorage.setItem('user', JSON.stringify(userWithToken));
  }

  validate(): Observable<any> {
    return this.http.get(`${this.apiUrl}/validate`).pipe(
      tap((response: any) => {
        if (response.user) {
          this.storeUser(response.user);
        }
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, {
      withCredentials: true // ✅ Importante: enviar cookies con la petición
    }).pipe(
      tap((response: any) => {
        if (response.access_token && response.user) {
          this.storeCredentials(response.access_token, response.user);
        } else if (response.token && response.user) {
          // Fallback for backward compatibility
          this.storeCredentials(response.token, response.user);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        if (response.user) {
          this.storeUser(response.user);
        }
      })
    );
  }

  logout(): void {
    // Clear localStorage first
    this.clearUser();

    // Then call backend logout to clear cookie
    this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true // ✅ Importante: enviar cookies con la petición
    }).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        // Even if backend logout fails, we already cleared localStorage
        this.router.navigate(['/auth/login']);
      }
    });
  }

  private storeUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearUser(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getCurrentUser(): any {
    return this.getUser();
  }

  // ✅ Métodos para manejo de roles con tipado correcto
  getUserRole(): UserRole | null {
    const user = this.getUser();
    return user?.role || null;
  }

  hasRole(role: UserRole): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) {

      return false;
    }

    const hasRole = roles.includes(userRole);
    return hasRole;
  }

  // ✅ Verificar si es admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // ✅ Verificar si es manager
  isManager(): boolean {
    return this.hasRole('manager');
  }

  // ✅ Verificar si es employee
  isEmployee(): boolean {
    return this.hasRole('employee');
  }

  // ✅ Verificar si es user
  isUser(): boolean {
    return this.hasRole('user');
  }

  // ✅ Obtener permisos del usuario actual
  getUserPermissions(): string[] {
    const role = this.getUserRole();
    if (!role) return [];

    const permissionsMap: Record<UserRole, string[]> = {
      admin: [
        'create',
        'read',
        'update',
        'delete',
        'manage_users',
        'manage_roles',
      ],
      manager: ['create', 'read', 'update', 'delete', 'manage_products'],
      employee: ['create', 'read', 'update'],
      user: ['read'],
    };

    return permissionsMap[role] || [];
  }

  // ✅ Verificar si tiene un permiso específico
  hasPermission(permission: string): boolean {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }
}
