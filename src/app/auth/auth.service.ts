import { Injectable } from '@angular/core';

// ✅ Definir UserRole directamente aquí
export type UserRole = 'admin' | 'manager' | 'employee' | 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      const isValid = payload.exp > now;
      return isValid;
    } catch (error) {
      return false;
    }
  }

  login(token: string, user: any): void {

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ User logged out');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getCurrentUser(): any {
    return this.getUser();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
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
      console.log('❌ No user role found');
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
