import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { RegisterRequest } from '../models/auth.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div class="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
          <p class="text-gray-600">Registra tu cuenta de administrador</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- First Name Field -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              id="firstName"
              type="text"
              formControlName="firstName"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              [class.border-red-500]="f['firstName'].invalid && (f['firstName'].dirty || f['firstName'].touched)"
              [class.bg-red-50]="f['firstName'].invalid && (f['firstName'].dirty || f['firstName'].touched)"
              placeholder="Ingresa tu nombre"
            >
            <div *ngIf="f['firstName'].invalid && (f['firstName'].dirty || f['firstName'].touched)" 
                 class="mt-2 text-sm text-red-600">
              <div *ngIf="f['firstName'].errors?.['required']">El nombre es requerido</div>
              <div *ngIf="f['firstName'].errors?.['minlength']">El nombre debe tener al menos 2 caracteres</div>
            </div>
          </div>

          <!-- Last Name Field -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
              Apellido
            </label>
            <input
              id="lastName"
              type="text"
              formControlName="lastName"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              [class.border-red-500]="f['lastName'].invalid && (f['lastName'].dirty || f['lastName'].touched)"
              [class.bg-red-50]="f['lastName'].invalid && (f['lastName'].dirty || f['lastName'].touched)"
              placeholder="Ingresa tu apellido"
            >
            <div *ngIf="f['lastName'].invalid && (f['lastName'].dirty || f['lastName'].touched)" 
                 class="mt-2 text-sm text-red-600">
              <div *ngIf="f['lastName'].errors?.['required']">El apellido es requerido</div>
              <div *ngIf="f['lastName'].errors?.['minlength']">El apellido debe tener al menos 2 caracteres</div>
            </div>
          </div>

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
              [class.border-red-500]="f['email'].invalid && (f['email'].dirty || f['email'].touched)"
              [class.bg-red-50]="f['email'].invalid && (f['email'].dirty || f['email'].touched)"
              placeholder="Ingresa tu correo electrónico"
            >
            <div *ngIf="f['email'].invalid && (f['email'].dirty || f['email'].touched)" 
                 class="mt-2 text-sm text-red-600">
              <div *ngIf="f['email'].errors?.['required']">El correo electrónico es requerido</div>
              <div *ngIf="f['email'].errors?.['email']">Por favor ingresa un correo electrónico válido</div>
            </div>
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
              [class.border-red-500]="f['password'].invalid && (f['password'].dirty || f['password'].touched)"
              [class.bg-red-50]="f['password'].invalid && (f['password'].dirty || f['password'].touched)"
              placeholder="Ingresa tu contraseña"
            >
            <div *ngIf="f['password'].invalid && (f['password'].dirty || f['password'].touched)" 
                 class="mt-2 text-sm text-red-600">
              <div *ngIf="f['password'].errors?.['required']">La contraseña es requerida</div>
              <div *ngIf="f['password'].errors?.['minlength']">La contraseña debe tener al menos 6 caracteres</div>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              [class.border-red-500]="f['confirmPassword'].invalid && (f['confirmPassword'].dirty || f['confirmPassword'].touched)"
              [class.bg-red-50]="f['confirmPassword'].invalid && (f['confirmPassword'].dirty || f['confirmPassword'].touched)"
              placeholder="Confirma tu contraseña"
            >
            <div *ngIf="f['confirmPassword'].invalid && (f['confirmPassword'].dirty || f['confirmPassword'].touched)" 
                 class="mt-2 text-sm text-red-600">
              <div *ngIf="f['confirmPassword'].errors?.['required']">La confirmación de contraseña es requerida</div>
              <div *ngIf="f['confirmPassword'].errors?.['passwordMismatch']">Las contraseñas no coinciden</div>
            </div>
          </div>

          <!-- Success Message -->
          <div *ngIf="success" class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-green-700">{{ success }}</span>
          </div>

          <!-- Error Message -->
          <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-red-700">{{ error }}</span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loading || registerForm.invalid"
            class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            <div *ngIf="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>{{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}</span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-8 text-center pt-6 border-t border-gray-200">
          <p class="text-gray-600">
            ¿Ya tienes una cuenta? 
            <button (click)="goToLogin()" class="text-indigo-600 hover:text-indigo-800 font-medium ml-1 transition-colors duration-200">
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword && confirmPassword.errors && confirmPassword.errors['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const userData: RegisterRequest = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Registro exitoso. Serás redirigido al login...';

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || 'Error al registrar usuario';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
