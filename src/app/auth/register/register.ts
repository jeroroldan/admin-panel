import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterStore } from './register-store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4"
    >
      <div
        class="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95"
      >
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
          <p class="text-gray-600">Registra tu cuenta de administrador</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- First Name Field -->
          <div>
            <label
              for="firstName"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre
            </label>
            <input
              id="firstName"
              type="text"
              formControlName="firstName"
              class="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              [class]="
                firstNameError()
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-gray-50'
              "
              placeholder="Ingresa tu nombre"
            />
            @if (firstNameError()) {
            <div class="mt-2 text-sm text-red-600">
              {{ firstNameError() }}
            </div>
            }
          </div>

          <!-- Last Name Field -->
          <div>
            <label
              for="lastName"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Apellido
            </label>
            <input
              id="lastName"
              type="text"
              formControlName="lastName"
              class="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              [class]="
                lastNameError()
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-gray-50'
              "
              placeholder="Ingresa tu apellido"
            />
            @if (lastNameError()) {
            <div class="mt-2 text-sm text-red-600">
              {{ lastNameError() }}
            </div>
            }
          </div>

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
              formControlName="email"
              class="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              [class]="
                emailError()
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-gray-50'
              "
              placeholder="Ingresa tu correo electrónico"
            />
            @if (emailError()) {
            <div class="mt-2 text-sm text-red-600">
              {{ emailError() }}
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
                [type]="registerStore.showPassword() ? 'text' : 'password'"
                formControlName="password"
                class="w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                [class]="
                  passwordError()
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-gray-50'
                "
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
              </button>
            </div>
            @if (passwordError()) {
            <div class="mt-2 text-sm text-red-600">
              {{ passwordError() }}
            </div>
            }
          </div>

          <!-- Confirm Password Field -->
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirmar Contraseña
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                [type]="
                  registerStore.showConfirmPassword() ? 'text' : 'password'
                "
                formControlName="confirmPassword"
                class="w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                [class]="
                  confirmPasswordError()
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-gray-50'
                "
                placeholder="Confirma tu contraseña"
              />
              <button
                type="button"
                (click)="toggleConfirmPasswordVisibility()"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
              </button>
            </div>
            @if (confirmPasswordError()) {
            <div class="mt-2 text-sm text-red-600">
              {{ confirmPasswordError() }}
            </div>
            }
          </div>

          <!-- Progress Bar -->
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Progreso del formulario</span>
              <span class="text-indigo-600 font-medium"
                >{{ registerStore.formProgress() }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                [style.width.%]="registerStore.formProgress()"
              ></div>
            </div>
          </div>

          <!-- Success Message -->
          @if (registerStore.success()) {
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <p class="text-green-700">{{ registerStore.success() }}</p>
          </div>
          }

          <!-- Error Message -->
          @if (registerStore.registerError()) {
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-700">{{ registerStore.registerError() }}</p>
          </div>
          }

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="!registerStore.canSubmitForm()"
            class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            @if (registerStore.registerLoading()) {
            <div
              class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
            ></div>
            }
            <span>{{
              registerStore.registerLoading()
                ? 'Creando cuenta...'
                : 'Crear Cuenta'
            }}</span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-8 text-center pt-6 border-t border-gray-200">
          <p class="text-gray-600">
            ¿Ya tienes una cuenta?
            <button
              (click)="goToLogin()"
              class="text-indigo-600 hover:text-indigo-800 font-medium ml-1 transition-colors duration-200 hover:underline"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class Register implements OnInit, OnDestroy {
  // ✅ Solo inyectar el store
  registerStore = inject(RegisterStore);
  private fb = inject(FormBuilder);

  // ✅ Estado local del componente
  registerForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  // ✅ Referencias a signals para el template
  firstNameError = this.registerStore.firstNameError;
  lastNameError = this.registerStore.lastNameError;
  emailError = this.registerStore.emailError;
  passwordError = this.registerStore.passwordError;
  confirmPasswordError = this.registerStore.confirmPasswordError;

  ngOnInit(): void {
    // ✅ Inicializar el formulario
    this.registerStore.resetRegisterForm();

    // ✅ Crear formulario reactivo
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });

    // ✅ Sincronizar con el store
    this.subscriptions.push(
      this.registerForm.valueChanges.subscribe(value => {
        this.registerStore.updateFormField('firstName', value.firstName);
        this.registerStore.updateFormField('lastName', value.lastName);
        this.registerStore.updateFormField('email', value.email);
        this.registerStore.updateFormField('password', value.password);
        this.registerStore.updateFormField('confirmPassword', value.confirmPassword);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  togglePasswordVisibility(): void {
    this.registerStore.togglePasswordVisibility();
  }

  toggleConfirmPasswordVisibility(): void {
    this.registerStore.toggleConfirmPasswordVisibility();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.registerStore.submitRegistration();
    }
  }

  goToLogin(): void {
    this.registerStore.goToLogin();
  }
}
