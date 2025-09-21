import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  access_token?: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData, {
      withCredentials: true // ✅ Importante: enviar cookies con la petición
    });
  }
}
