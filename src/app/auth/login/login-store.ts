import { Injectable, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import { Router } from '@angular/router';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';
// ✅ Separar imports correctamente
import { AuthService } from '../auth.service';
import { LoginApiService, LoginRequest, LoginResponse, User } from './api';

// ✅ Interfaces para el formulario de login
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormValidation {
  email: { isValid: boolean; errors: string[] };
  password: { isValid: boolean; errors: string[] };
  isFormValid: boolean;
}

interface LoginFormTouched {
  email: boolean;
  password: boolean;
}

interface LoginState {
  user: User | null;
  loginLoading: boolean;
  loginError: string | null;
  returnUrl: string;

  loginForm: {
    data: LoginFormData;
    validation: LoginFormValidation;
    touched: LoginFormTouched;
    submitted: boolean;
  };
}

const initialState: LoginState = {
  user: null,
  loginLoading: false,
  loginError: null,
  returnUrl: '/dashboard',

  loginForm: {
    data: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validation: {
      email: { isValid: false, errors: [] },
      password: { isValid: false, errors: [] },
      isFormValid: false,
    },
    touched: {
      email: false,
      password: false,
    },
    submitted: false,
  },
};

// ✅ Función de validación
function validateLoginForm(data: LoginFormData): LoginFormValidation {
  const validation: LoginFormValidation = {
    email: { isValid: false, errors: [] },
    password: { isValid: false, errors: [] },
    isFormValid: false,
  };

  // Validar email
  if (!data.email.trim()) {
    validation.email.errors.push('El correo electrónico es requerido');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    validation.email.errors.push('Formato de correo electrónico inválido');
  } else {
    validation.email.isValid = true;
  }

  // Validar password
  if (!data.password) {
    validation.password.errors.push('La contraseña es requerida');
  } else if (data.password.length < 3) {
    validation.password.errors.push(
      'La contraseña debe tener al menos 3 caracteres'
    );
  } else {
    validation.password.isValid = true;
  }

  validation.isFormValid =
    validation.email.isValid && validation.password.isValid;
  return validation;
}

@Injectable({ providedIn: 'root' })
export class AuthStore extends signalStore(
  withState(initialState),

  withComputed((store) => ({
    loginFormData: computed(() => store.loginForm().data),
    loginFormValidation: computed(() => store.loginForm().validation),
    loginFormTouched: computed(() => store.loginForm().touched),
    isFormSubmitted: computed(() => store.loginForm().submitted),

    emailError: computed(() => {
      const form = store.loginForm();
      const field = form.validation.email;
      return (form.touched.email || form.submitted) && !field.isValid
        ? field.errors[0] || null
        : null;
    }),

    passwordError: computed(() => {
      const form = store.loginForm();
      const field = form.validation.password;
      return (form.touched.password || form.submitted) && !field.isValid
        ? field.errors[0] || null
        : null;
    }),

    canSubmitForm: computed(() => {
      const form = store.loginForm();
      return form.validation.isFormValid && !store.loginLoading();
    }),
  })),

  withMethods((store) => {
    // ✅ Inyecciones correctas - separar API service de Auth service
    const loginApiService = inject(LoginApiService);
    const authService = inject(AuthService);
    const router = inject(Router);

    return {
      // ✅ Método para inicializar con returnUrl
      initializeStore(): void {
        // ✅ Obtener returnUrl desde la URL actual
        const urlTree = router.parseUrl(router.url);
        const returnUrl = urlTree.queryParams['returnUrl'] || '/dashboard';

        patchState(store, {
          returnUrl: returnUrl,
        });

        // Si ya está autenticado, redirigir
        if (authService.isAuthenticated()) {
          console.log('User already authenticated, redirecting to:', returnUrl);
          router.navigate([returnUrl]);
        }
      },

      updateLoginFormField(
        field: keyof LoginFormData,
        value: string | boolean
      ): void {
        const currentForm = store.loginForm();
        const updatedData = { ...currentForm.data, [field]: value };
        const updatedTouched = { ...currentForm.touched };

        // Marcar como touched si es string (email/password)
        if (typeof value === 'string') {
          updatedTouched[field as 'email' | 'password'] = true;
        }

        const validation = validateLoginForm(updatedData);

        patchState(store, {
          loginForm: {
            ...currentForm,
            data: updatedData,
            touched: updatedTouched,
            validation,
          },
        });
      },

      resetLoginForm(): void {
        patchState(store, {
          loginForm: initialState.loginForm,
          loginError: null,
        });
      },

      clearErrors(): void {
        patchState(store, {
          loginError: null,
        });
      },

      submitLoginForm(): void {
        const currentForm = store.loginForm();

        patchState(store, {
          loginForm: {
            ...currentForm,
            submitted: true,
            touched: {
              email: true,
              password: true,
            },
          },
        });

        const validation = validateLoginForm(currentForm.data);
        if (!validation.isFormValid) {
          patchState(store, {
            loginForm: {
              ...store.loginForm(),
              validation,
            },
          });
          return;
        }

        const loginData: LoginRequest = {
          email: currentForm.data.email.trim().toLowerCase(),
          password: currentForm.data.password,
        };

        console.log('📤 Submitting login:', { email: loginData.email });
        // ✅ Usar this.login en lugar de storeMethods.login
        this.login(loginData);
      },

      login: rxMethod<LoginRequest>(
        pipe(
          tap(() => {
            console.log('🔄 Starting login process...');
            patchState(store, {
              loginLoading: true,
              loginError: null,
            });
          }),
          switchMap((loginData) =>
            loginApiService.login(loginData).pipe(
              tap((response: LoginResponse) => {
                console.log('✅ Login API response:', response);
                console.log('🔍 Response keys:', Object.keys(response));
                console.log('🔍 Access token:', response.access_token);

                // ✅ Verificar que el token existe antes de guardar
                if (!response.access_token) {
                  console.error('❌ No access_token in response:', response);
                  patchState(store, {
                    loginLoading: false,
                    loginError: 'Token no recibido del servidor',
                  });
                  return;
                }

                // ✅ Guardar token y usuario
                authService.login(response.access_token, response.user);

                // ✅ Verificar que se guardó correctamente
                const isAuth = authService.isAuthenticated();
                const storedToken = authService.getToken();
                console.log('🔍 Is authenticated after login:', isAuth);
                console.log(
                  '🔍 Stored token:',
                  storedToken ? 'Token exists' : 'No token stored'
                );

                patchState(store, {
                  user: response.user,
                  loginLoading: false,
                });

                // ✅ Solo navegar si la autenticación es exitosa
                if (isAuth) {
                  // ✅ Navegar después de un pequeño delay
                  setTimeout(() => {
                    const returnUrl = store.returnUrl();
                    console.log('🔄 Redirecting to:', returnUrl);

                    router.navigate([returnUrl]).then(
                      (success) => {
                        console.log('✅ Navigation success:', success);
                        console.log('🔍 Current URL:', router.url);
                        console.log('🎯 Target URL was:', returnUrl);

                        if (success) {
                          const currentUrl = router.url;
                          if (
                            returnUrl === '/dashboard' &&
                            !currentUrl.includes('/dashboard')
                          ) {
                            console.log(
                              '⚠️ Expected dashboard but got:',
                              currentUrl
                            );
                            router.navigate(['/dashboard']);
                          } else {
                            console.log(
                              '✅ Successfully navigated to:',
                              currentUrl
                            );
                          }
                        } else {
                          console.log(
                            '⚠️ Navigation returned false, trying dashboard fallback'
                          );
                          router.navigate(['/dashboard']);
                        }
                      },
                      (error) => {
                        console.error('❌ Navigation failed:', error);
                        router.navigate(['/dashboard']);
                      }
                    );
                  }, 100); // Reducir delay
                } else {
                  console.error('❌ Authentication failed after login');
                  patchState(store, {
                    loginLoading: false,
                    loginError: 'Error de autenticación',
                  });
                }
              }),
              catchError((error: any) => {
                console.error('❌ Login failed:', error);
                console.error('❌ Error details:', {
                  status: error.status,
                  message: error.message,
                  error: error.error,
                });

                const errorMessage =
                  error.error?.message ||
                  error.message ||
                  'Error al iniciar sesión';

                patchState(store, {
                  loginLoading: false,
                  loginError: errorMessage,
                });

                return EMPTY;
              })
            )
          )
        )
      ),

      navigateToRegister(): void {
        router.navigate(['/register']);
      },

      setReturnUrl(url: string): void {
        patchState(store, {
          returnUrl: url,
        });
      },
    };
  }),

  withHooks({
    onInit(store) {
      console.log('🚀 AuthStore initialized');
      store.initializeStore();
    },
    onDestroy() {
      console.log('💥 AuthStore destroyed');
    },
  })
) {}
