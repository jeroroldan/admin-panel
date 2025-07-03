export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  token?: string;
  message?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Definir tipos de roles correctamente
export type UserRole = 'admin' | 'manager' | 'employee' | 'user';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ✅ Definir permisos por rol
export const ROLE_PERMISSIONS = {
  admin: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_roles'],
  manager: ['create', 'read', 'update', 'delete', 'manage_products'],
  employee: ['create', 'read', 'update'],
  user: ['read'],
} as const;

export type Permission = (typeof ROLE_PERMISSIONS)[UserRole][number];
