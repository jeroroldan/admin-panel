import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  UrlSegment
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url = segments.map(segment => segment.path).join('/');
    return this.checkAuth(`/${url}`);
  }

  private checkAuth(url: string): Observable<boolean> {
    // Si no hay token, redirigir al login
    if (!this.authService.getToken()) {
      this.redirectToLogin(url);
      return of(false);
    }

    // Si ya está autenticado, permitir acceso
    if (this.authService.isAuthenticated()) {
      return of(true);
    }

    // Validar token con el servidor
    return this.authService.validateToken().pipe(
      map(response => response.valid),
      tap(isValid => {
        if (!isValid) {
          this.redirectToLogin(url);
        }
      }),
      catchError(() => {
        this.redirectToLogin(url);
        return of(false);
      })
    );
  }

  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl }
    });
  }
}
