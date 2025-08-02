import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { LoadingService } from '../services/loading-service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Mostrar loading
    this.loadingService.show();

    // Clonar la request para añadir headers
    let authReq = req;

    // Añadir token de autenticación si existe
    const token = this.authService.getToken();
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Añadir headers comunes
    authReq = authReq.clone({
      setHeaders: {
        'Content-Type': authReq.headers.get('Content-Type') || 'application/json',
        'Accept': 'application/json'
      }
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejar errores específicos
        if (error.status === 401) {
          // Token expirado o inválido
          this.authService.logout();
        }

        return throwError(() => error);
      }),
      finalize(() => {
        // Ocultar loading
        this.loadingService.hide();
      })
    );
  }
}
