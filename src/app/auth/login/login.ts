import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthStore } from './login-store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4"
    >
      <div
        class="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95"
      >
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
          <p class="text-gray-600">Accede a tu panel de administración</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              [ngModel]="authStore.loginFormData().email"
              (ngModelChange)="onEmailChange($event)"
              name="email"
              class="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              [class]="getInputClasses('email')"
              placeholder="Ingresa tu correo electrónico"
              autocomplete="email"
            />
            @if (authStore.emailError()) {
            <div class="mt-2 text-sm text-red-600 flex items-center space-x-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ authStore.emailError() }}</span>
            </div>
            }
          </div>

          <!-- Password Field -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <div class="relative">
              <input
                id="password"
                [type]="showPassword ? 'text' : 'password'"
                [ngModel]="authStore.loginFormData().password"
                (ngModelChange)="onPasswordChange($event)"
                name="password"
                class="w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                [class]="getInputClasses('password')"
                placeholder="Ingresa tu contraseña"
                autocomplete="current-password"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                @if (showPassword) {
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  ></path>
                </svg>
                } @else {
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
                }
              </button>
            </div>
            @if (authStore.passwordError()) {
            <div class="mt-2 text-sm text-red-600 flex items-center space-x-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ authStore.passwordError() }}</span>
            </div>
            }
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                [ngModel]="authStore.loginFormData().rememberMe"
                (ngModelChange)="onRememberMeChange($event)"
                name="rememberMe"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
              />
              <label for="rememberMe" class="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>

            <button
              type="button"
              class="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <!-- Error Message -->
          @if (authStore.loginError()) {
          <div
            class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3"
          >
            <svg
              class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <h4 class="text-sm font-medium text-red-800">
                Error al iniciar sesión
              </h4>
              <p class="text-sm text-red-700 mt-1">
                {{ authStore.loginError() }}
              </p>
            </div>
          </div>
          }

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="!authStore.canSubmitForm()"
            class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-indigo-500 disabled:hover:to-purple-600 flex items-center justify-center space-x-2"
          >
            @if (authStore.loginLoading()) {
            <div
              class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
            ></div>
            }
            <span>{{
              authStore.loginLoading()
                ? 'Iniciando sesión...'
                : 'Iniciar Sesión'
            }}</span>
          </button>
        </form>

        <!-- Additional Options -->
        <div class="mt-8 space-y-4">
          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          <!-- Social Login Buttons -->
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            <button
              type="button"
              class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                />
              </svg>
              Twitter
            </button>
          </div>
        </div>

        <!-- Register Link -->
        <div class="mt-8 text-center pt-6 border-t border-gray-200">
          <p class="text-gray-600">
            ¿No tienes una cuenta?
            <button
              type="button"
              (click)="goToRegister()"
              class="text-indigo-600 hover:text-indigo-800 font-medium ml-1 transition-colors duration-200 hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Animaciones personalizadas */
      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-5px);
        }
        75% {
          transform: translateX(5px);
        }
      }

      .shake {
        animation: shake 0.5s ease-in-out;
      }

      /* Estados de input mejorados */
      .input-error {
        @apply border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500;
      }

      .input-success {
        @apply border-green-500 bg-green-50 focus:ring-green-500 focus:border-green-500;
      }

      .input-default {
        @apply border-gray-300 bg-gray-50 focus:bg-white;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  // ✅ Inyectar el store
  authStore = inject(AuthStore);

  // ✅ Estado local del componente
  showPassword = false;

  ngOnInit(): void {
    // ✅ Limpiar formulario al inicializar
    this.authStore.resetLoginForm();

    // ✅ Limpiar errores previos
    this.authStore.clearErrors();
  }

  // ✅ Event handlers que delegan al store
  onEmailChange(value: string): void {
    this.authStore.updateLoginFormField('email', value);
  }

  onPasswordChange(value: string): void {
    this.authStore.updateLoginFormField('password', value);
  }

  onRememberMeChange(value: boolean): void {
    this.authStore.updateLoginFormField('rememberMe', value);
  }

  onSubmit(): void {
    this.authStore.submitLoginForm();
  }

  goToRegister(): void {
    this.authStore.navigateToRegister();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // ✅ Método para obtener las clases CSS del input basado en validación
  getInputClasses(field: 'email' | 'password'): string {
    const hasError =
      field === 'email'
        ? this.authStore.emailError()
        : this.authStore.passwordError();

    const formData = this.authStore.loginFormData();
    const fieldValue = formData[field] as string;
    const touched = this.authStore.loginFormTouched()[field];

    if (hasError) {
      return 'input-error';
    } else if (touched && fieldValue?.trim()) {
      return 'input-success';
    }

    return 'input-default';
  }
}
