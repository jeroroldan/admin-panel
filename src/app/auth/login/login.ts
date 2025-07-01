import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../models/auth.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div class="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
          <p class="text-gray-600">Accede a tu panel de administración</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              [class]="f['email'].invalid && (f['email'].dirty || f['email'].touched) ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'"
              placeholder="Ingresa tu correo electrónico"
            >
            @if (f['email'].invalid && (f['email'].dirty || f['email'].touched)) {
              <div class="mt-2 text-sm text-red-600">
                @if (f['email'].errors?.['required']) {
                  <div>El correo electrónico es requerido</div>
                }
                @if (f['email'].errors?.['email']) {
                  <div>Por favor ingresa un correo electrónico válido</div>
                }
              </div>
            }
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              [class]="f['password'].invalid && (f['password'].dirty || f['password'].touched) ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'"
              placeholder="Ingresa tu contraseña"
            >
            @if (f['password'].invalid && (f['password'].dirty || f['password'].touched)) {
              <div class="mt-2 text-sm text-red-600">
                @if (f['password'].errors?.['required']) {
                  <div>La contraseña es requerida</div>
                }
                @if (f['password'].errors?.['minlength']) {
                  <div>La contraseña debe tener al menos 6 caracteres</div>
                }
              </div>
            }
          </div>

          <!-- Error Message -->
          @if (error) {
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="text-red-700">{{ error }}</span>
            </div>
          }

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loading || loginForm.invalid"
            class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            @if (loading) {
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            }
            <span>{{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
          </button>
        </form>

        <!-- Register Link -->
        <div class="mt-8 text-center pt-6 border-t border-gray-200">
          <p class="text-gray-600">
            ¿No tienes una cuenta?
            <button (click)="goToRegister()" class="text-indigo-600 hover:text-indigo-800 font-medium ml-1 transition-colors duration-200">
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Obtener URL de retorno
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const credentials: LoginRequest = {
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message;
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
