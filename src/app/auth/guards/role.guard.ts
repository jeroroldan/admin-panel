import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../auth.service';
import { UserRole } from '../models/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkRole(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkRole(childRoute);
  }

  private checkRole(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as UserRole[];

    console.log('🔍 RoleGuard check:', {
      requiredRoles,
      userRole: this.authService.getUserRole(),
      isAuthenticated: this.authService.isAuthenticated(),
    });

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Verificar si está autenticado
    if (!this.authService.isAuthenticated()) {
      console.log('❌ Not authenticated, redirecting to login');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: route.url.join('/') },
      });
      return false;
    }

    // Verificar si tiene el rol requerido
    const hasRole = this.authService.hasAnyRole(requiredRoles);

    if (!hasRole) {
      console.log('❌ Insufficient permissions, redirecting to dashboard');
      this.router.navigate(['/dashboard']);
      return false;
    }

    console.log('✅ Role check passed');
    return true;
  }
}
