import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from './login-store';
import { Subscription } from 'rxjs';

// Import reusable components
import { FormInputComponent } from '../../shared/components/form-input/form-input';
import { PasswordInputComponent } from '../../shared/components/password-input/password-input';
import { AlertComponent } from '../../shared/components/alert/alert';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormInputComponent,
    PasswordInputComponent,
    AlertComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <!-- Main login container with backdrop -->
    <div
      class="login-container"
      role="main"
      aria-labelledby="login-title">

      <!-- Login card -->
      <div class="login-card" role="dialog" aria-modal="true">

        <!-- Header -->
        <header class="login-header">
          <h1
            id="login-title"
            class="login-title">
            Iniciar Sesión
          </h1>
          <p class="login-subtitle">
            Accede a tu panel de administración
          </p>
        </header>

        <!-- Login form -->
        <form
          [formGroup]="loginForm"
          (ngSubmit)="onSubmit()"
          class="login-form"
          novalidate>

          <!-- Email field -->
          <app-form-input
            [control]="getFormControl('email')"
            label="Correo Electrónico"
            inputType="email"
            placeholder="Ingresa tu correo electrónico"
            autocomplete="email"
            [required]="true">
          </app-form-input>

          <!-- Password field -->
          <app-password-input
            [control]="getFormControl('password')"
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            [required]="true">
          </app-password-input>

          <!-- Remember me and forgot password -->
          <div class="form-options">
            <div class="remember-me">
              <input
                id="rememberMe"
                type="checkbox"
                formControlName="rememberMe"
                class="checkbox-input">
              <label for="rememberMe" class="checkbox-label">
                Recordarme
              </label>
            </div>

            <button
              type="button"
              class="forgot-password-link"
              (click)="onForgotPassword()">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <!-- Error alert -->
          <app-alert
            *ngIf="authStore.loginError()"
            type="error"
            title="Error al iniciar sesión"
            [dismissible]="true"
            (dismissed)="onDismissError()">
            {{ authStore.loginError() }}
          </app-alert>

          <!-- Submit button -->
          <button
            type="submit"
            class="submit-button"
            [disabled]="!authStore.canSubmitForm()"
            [attr.aria-describedby]="authStore.loginLoading() ? 'loading-status' : null">

            <!-- Loading spinner -->
            <app-loading-spinner
              *ngIf="authStore.loginLoading()"
              [show]="true"
              message="Iniciando sesión..."
              [size]="20"
              color="white">
            </app-loading-spinner>

            <!-- Button text -->
            <span [attr.id]="authStore.loginLoading() ? 'loading-status' : null">
              {{ authStore.loginLoading() ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </span>
          </button>
        </form>

        <!-- Social login section -->
        <div class="social-login-section">
          <div class="divider">
            <span class="divider-text">O continúa con</span>
          </div>

          <div class="social-buttons">
            <button
              type="button"
              class="social-button google-button"
              (click)="onSocialLogin('google')"
              aria-label="Iniciar sesión con Google">
              <svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button
              type="button"
              class="social-button github-button"
              (click)="onSocialLogin('github')"
              aria-label="Iniciar sesión con GitHub">
              <svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>
        </div>

        <!-- Register link -->
        <footer class="login-footer">
          <p class="register-text">
            ¿No tienes una cuenta?
            <button
              type="button"
              class="register-link"
              (click)="goToRegister()"
              aria-label="Ir a la página de registro">
              Regístrate aquí
            </button>
          </p>
        </footer>
      </div>
    </div>
  `,
  styles: [
    `
      /* Main container */
      .login-container {
        @apply min-h-screen flex items-center justify-center;
        @apply bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4;
      }

      /* Login card */
      .login-card {
        @apply max-w-md w-full;
        @apply bg-white rounded-xl shadow-2xl p-8;
        @apply backdrop-blur-sm bg-opacity-95;
      }

      /* Header */
      .login-header {
        @apply text-center mb-8;
      }

      .login-title {
        @apply text-3xl font-bold text-gray-800 mb-2;
      }

      .login-subtitle {
        @apply text-gray-600;
      }

      /* Form */
      .login-form {
        @apply space-y-6;
      }

      /* Form options */
      .form-options {
        @apply flex items-center justify-between;
      }

      .remember-me {
        @apply flex items-center;
      }

      .checkbox-input {
        @apply h-4 w-4 text-indigo-600 focus:ring-indigo-500;
        @apply border-gray-300 rounded transition-colors duration-200;
        @apply mr-2;
      }

      .checkbox-label {
        @apply text-sm text-gray-700;
      }

      .forgot-password-link {
        @apply text-sm text-indigo-600 hover:text-indigo-800;
        @apply font-medium transition-colors duration-200;
      }

      /* Submit button */
      .submit-button {
        @apply w-full bg-gradient-to-r from-indigo-500 to-purple-600;
        @apply text-white py-3 px-4 rounded-lg font-medium;
        @apply hover:from-indigo-600 hover:to-purple-700;
        @apply focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
        @apply transform hover:-translate-y-0.5 transition-all duration-200;
        @apply disabled:opacity-50 disabled:cursor-not-allowed;
        @apply disabled:transform-none disabled:hover:from-indigo-500 disabled:hover:to-purple-600;
        @apply flex items-center justify-center space-x-2;
      }

      /* Social login section */
      .social-login-section {
        @apply mt-8 space-y-4;
      }

      .divider {
        @apply relative;
      }

      .divider::before {
        @apply absolute inset-0 flex items-center;
        content: '';
        @apply border-t border-gray-300;
      }

      .divider-text {
        @apply relative flex justify-center text-sm;
        @apply px-2 bg-white text-gray-500;
      }

      .social-buttons {
        @apply grid grid-cols-2 gap-3;
      }

      .social-button {
        @apply w-full inline-flex justify-center items-center;
        @apply px-4 py-2 border border-gray-300 rounded-lg shadow-sm;
        @apply bg-white text-sm font-medium;
        @apply hover:bg-gray-50 transition-colors duration-200;
        @apply focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2;
      }

      .google-button {
        /* Google specific styling if needed */
      }

      .github-button {
        /* GitHub specific styling if needed */
      }

      .social-icon {
        @apply w-4 h-4 mr-2;
      }

      /* Footer */
      .login-footer {
        @apply mt-8 text-center pt-6 border-t border-gray-200;
      }

      .register-text {
        @apply text-gray-600;
      }

      .register-link {
        @apply text-indigo-600 hover:text-indigo-800 font-medium;
        @apply ml-1 transition-colors duration-200 hover:underline;
      }

      /* Responsive design */
      @media (max-width: 640px) {
        .login-card {
          @apply mx-4 p-6;
        }

        .login-title {
          @apply text-2xl;
        }

        .social-buttons {
          @apply grid-cols-1;
        }
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .login-card {
          @apply border-4 border-gray-900;
        }

        .submit-button {
          @apply border-2 border-white;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .submit-button {
          @apply transform-none transition-none;
        }

        .login-container {
          @apply transition-none;
        }
      }
    `,
  ],
})
/**
 * LoginComponent - Main login component with improved architecture
 *
 * Features:
 * - Reactive forms with validation
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Reusable component architecture
 * - Clean separation of concerns
 * - Type-safe implementation
 */
export class LoginComponent implements OnInit, OnDestroy {
  // Services
  authStore = inject(AuthStore);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Component state
  loginForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * Initialize component state and form
   */
  private initializeComponent(): void {
    // Reset store state
    this.authStore.resetLoginForm();
    this.authStore.clearErrors();

    // Create reactive form
    this.loginForm = this.createForm();

    // Sync form changes with store
    this.setupFormSync();
  }

  /**
   * Create reactive form with validation
   */
  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(128)
      ]],
      rememberMe: [false]
    });
  }

  /**
   * Setup form synchronization with store
   */
  private setupFormSync(): void {
    this.subscriptions.push(
      this.loginForm.valueChanges.subscribe(value => {
        this.authStore.updateLoginFormField('email', value.email || '');
        this.authStore.updateLoginFormField('password', value.password || '');
        this.authStore.updateLoginFormField('rememberMe', value.rememberMe || false);
      })
    );
  }

  /**
   * Clean up subscriptions
   */
  private cleanup(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.loginForm.valid && this.authStore.canSubmitForm()) {
      this.authStore.submitLoginForm();
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }

  /**
   * Navigate to register page
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  /**
   * Handle forgot password click
   */
  onForgotPassword(): void {
    // TODO: Implement forgot password functionality
    console.log('Forgot password clicked');
  }

  /**
   * Handle social login
   */
  onSocialLogin(provider: 'google' | 'github'): void {
    // TODO: Implement social login
    console.log(`Social login with ${provider}`);
  }

  /**
   * Dismiss error alert
   */
  onDismissError(): void {
    this.authStore.clearErrors();
  }

  /**
   * Get form control helper method
   */
  getFormControl(controlName: string): FormControl {
    return this.loginForm.get(controlName) as FormControl;
  }

  /**
   * Get CSS classes for form inputs (legacy method for backward compatibility)
   * @deprecated Use the FormInputComponent's built-in validation styling instead
   */
  getInputClasses(field: 'email' | 'password'): string {
    const control = this.loginForm.get(field);
    const hasError = this.authStore.emailError() || this.authStore.passwordError();

    if (hasError && control?.touched) {
      return 'input-error';
    } else if (control?.touched && control.value?.trim()) {
      return 'input-success';
    }

    return 'input-default';
  }

  // Public getters for template access
  get authStoreInstance() {
    return this.authStore;
  }
}
