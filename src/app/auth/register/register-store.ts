import { Injectable, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  withHooks,
  patchState,
} from '@ngrx/signals';
import { tapResponse } from '@ngrx/operators';
import { computed } from '@angular/core';
import { Router } from '@angular/router';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';
import {
  RegisterApiService,
  RegisterRequest,
  RegisterResponse,
  User,
} from './api';

// ✅ Interfaces para el formulario de registro
interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormValidation {
  firstName: { isValid: boolean; errors: string[] };
  lastName: { isValid: boolean; errors: string[] };
  email: { isValid: boolean; errors: string[] };
  password: { isValid: boolean; errors: string[] };
  confirmPassword: { isValid: boolean; errors: string[] };
  isFormValid: boolean;
}

interface RegisterFormTouched {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

interface RegisterState {
  user: User | null;
  registerLoading: boolean;
  emailCheckLoading: boolean;
  registerError: string | null;
  success: string | null;

  showPassword: boolean;
  showConfirmPassword: boolean;

  registerForm: {
    data: RegisterFormData;
    validation: RegisterFormValidation;
    touched: RegisterFormTouched;
    submitted: boolean;
  };
}

const initialState: RegisterState = {
  user: null,
  registerLoading: false,
  emailCheckLoading: false,
  registerError: null,
  success: null,

  showPassword: false,
  showConfirmPassword: false,

  registerForm: {
    data: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validation: {
      firstName: { isValid: false, errors: [] },
      lastName: { isValid: false, errors: [] },
      email: { isValid: false, errors: [] },
      password: { isValid: false, errors: [] },
      confirmPassword: { isValid: false, errors: [] },
      isFormValid: false,
    },
    touched: {
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      confirmPassword: false,
    },
    submitted: false,
  },
};

// ✅ Función de validación
function validateRegisterForm(data: RegisterFormData): RegisterFormValidation {
  const validation: RegisterFormValidation = {
    firstName: { isValid: false, errors: [] },
    lastName: { isValid: false, errors: [] },
    email: { isValid: false, errors: [] },
    password: { isValid: false, errors: [] },
    confirmPassword: { isValid: false, errors: [] },
    isFormValid: false,
  };

  // Validar firstName
  if (!data.firstName.trim()) {
    validation.firstName.errors.push('El nombre es requerido');
  } else if (data.firstName.trim().length < 2) {
    validation.firstName.errors.push('El nombre debe tener al menos 2 caracteres');
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.firstName)) {
    validation.firstName.errors.push('El nombre solo puede contener letras');
  } else {
    validation.firstName.isValid = true;
  }

  // Validar lastName
  if (!data.lastName.trim()) {
    validation.lastName.errors.push('El apellido es requerido');
  } else if (data.lastName.trim().length < 2) {
    validation.lastName.errors.push('El apellido debe tener al menos 2 caracteres');
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.lastName)) {
    validation.lastName.errors.push('El apellido solo puede contener letras');
  } else {
    validation.lastName.isValid = true;
  }

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
  } else if (data.password.length < 6) {
    validation.password.errors.push('La contraseña debe tener al menos 6 caracteres');
  } else {
    validation.password.isValid = true;
  }

  // Validar confirmPassword
  if (!data.confirmPassword) {
    validation.confirmPassword.errors.push('La confirmación de contraseña es requerida');
  } else if (data.password !== data.confirmPassword) {
    validation.confirmPassword.errors.push('Las contraseñas no coinciden');
  } else {
    validation.confirmPassword.isValid = true;
  }

  // Validar formulario completo
  validation.isFormValid =
    validation.firstName.isValid &&
    validation.lastName.isValid &&
    validation.email.isValid &&
    validation.password.isValid &&
    validation.confirmPassword.isValid;

  return validation;
}

@Injectable({ providedIn: 'root' })
export class RegisterStore extends signalStore(
  withState(initialState),

  withComputed((store) => ({
    registerFormData: computed(() => store.registerForm().data),
    registerFormValidation: computed(() => store.registerForm().validation),
    registerFormTouched: computed(() => store.registerForm().touched),
    isFormSubmitted: computed(() => store.registerForm().submitted),

    firstNameError: computed(() => {
      const form = store.registerForm();
      const field = form.validation.firstName;
      return (form.touched.firstName || form.submitted) && !field.isValid
        ? field.errors[0] || null
        : null;
    }),

    lastNameError: computed(() => {
      const form = store.registerForm();
      const field = form.validation.lastName;
      return (form.touched.lastName || form.submitted) && !field.isValid
        ? field.errors[0] || null
        : null;
    }),

    emailError: computed(() => {
      const form = store.registerForm();
      const field = form.validation.email;
      return (form.touched.email || form.submitted) && !field.isValid
        ? field.errors[0] || null
        : null;
    }),

    passwordError: computed(() => {
      const form = store.registerForm();
      const field = form.validation.password;
      return (form.touched.password || form.submitted) && !field.isValid
        ? field.errors[0] || null
        : null;
    }),

    confirmPasswordError: computed(() => {
      const form = store.registerForm();
      const field = form.validation.confirmPassword;
      return (form.touched.confirmPassword || form.submitted) && !field.isValid
        ? field.errors[0] || null
        : null;
    }),

    canSubmitForm: computed(() => {
      const form = store.registerForm();
      return form.validation.isFormValid && !store.registerLoading();
    }),

    formProgress: computed(() => {
      const form = store.registerForm();
      const fields = [
        form.validation.firstName.isValid,
        form.validation.lastName.isValid,
        form.validation.email.isValid,
        form.validation.password.isValid,
        form.validation.confirmPassword.isValid,
      ];
      const validFields = fields.filter(Boolean).length;
      return Math.round((validFields / fields.length) * 100);
    }),
  })),

  withMethods((store) => {
    const registerApi = inject(RegisterApiService);
    const router = inject(Router);

    // ✅ Definir storeMethods como const para poder referenciarlos
    const storeMethods = {
      updateFormField(field: keyof RegisterFormData, value: string): void {
        const currentForm = store.registerForm();
        const updatedData = { ...currentForm.data, [field]: value };
        const updatedTouched = { ...currentForm.touched, [field]: true };
        const validation = validateRegisterForm(updatedData);

        patchState(store, {
          registerForm: {
            ...currentForm,
            data: updatedData,
            touched: updatedTouched,
            validation,
          },
        });
      },

      resetRegisterForm(): void {
        patchState(store, {
          registerForm: initialState.registerForm,
          registerError: null,
          success: null,
        });
      },

      submitRegistration(): void {
        const currentForm = store.registerForm();

        patchState(store, {
          registerForm: {
            ...currentForm,
            submitted: true,
            touched: {
              firstName: true,
              lastName: true,
              email: true,
              password: true,
              confirmPassword: true,
            },
          },
        });

        const validation = validateRegisterForm(currentForm.data);
        if (!validation.isFormValid) {
          patchState(store, {
            registerForm: {
              ...store.registerForm(),
              validation,
            },
          });
          return;
        }

        // ✅ Datos para el API
        const registerData: RegisterRequest = {
          firstName: currentForm.data.firstName.trim(),
          lastName: currentForm.data.lastName.trim(),
          email: currentForm.data.email.trim().toLowerCase(),
          password: currentForm.data.password,
        };

        // ✅ Llamar al método register usando storeMethods
        storeMethods.register(registerData);
      },

      register: rxMethod<RegisterRequest>(
        pipe(
          tap(() => {
            patchState(store, {
              registerLoading: true,
              registerError: null,
              success: null,
            });
          }),
          switchMap((userData) =>
            registerApi.register(userData).pipe(
              tapResponse({
                next: (response: RegisterResponse) => {
                  console.log('✅ Registration successful');

                  patchState(store, {
                    user: response.user,
                    registerLoading: false,
                    success: 'Registro exitoso. Serás redirigido al login...',
                  });

                  setTimeout(() => {
                    router.navigate(['./dashboard']);
                  }, 2000);
                },
                error: (error: Error) => {
                  console.error('❌ Registration failed:', error.message);
                  patchState(store, {
                    registerLoading: false,
                    registerError: error.message,
                  });
                },
              })
            )
          )
        )
      ),

      togglePasswordVisibility(): void {
        patchState(store, {
          showPassword: !store.showPassword(),
        });
      },

      toggleConfirmPasswordVisibility(): void {
        patchState(store, {
          showConfirmPassword: !store.showConfirmPassword(),
        });
      },

      goToLogin(): void {
        router.navigate(['/login']);
      },
    };

    // ✅ Retornar storeMethods
    return storeMethods;
  }),

  withHooks({
    onInit(store) {
      console.log('🚀 RegisterStore initialized');
      store.resetRegisterForm();
    },
    onDestroy() {
      console.log('💥 RegisterStore destroyed');
    },
  })
) {}
