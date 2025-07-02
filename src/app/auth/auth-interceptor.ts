import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, finalize } from 'rxjs';
import { AuthService } from './auth.service';
import { LoadingService } from '../shared/services/loading.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const loadingService = inject(LoadingService);
  const router = inject(Router);

  // Show loading for API requests
  loadingService.show();

  // Agregar token a las peticiones
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expirado o inválido
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    }),
    finalize(() => {
      // Hide loading when request completes
      loadingService.hide();
    })
  );
};
