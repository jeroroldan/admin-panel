import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/api/auth'; // ✅ Ajusta según tu API

  login(loginData: LoginRequest): Observable<LoginResponse> {
    console.log('📤 API Login Request:', loginData);

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData);
  }
}
