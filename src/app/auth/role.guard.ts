import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  private normalize(role: string | null): string | null {
    switch (role) {
      case 'ROLE_RESTAURANT_OWNER': return 'OWNER';
      case 'ROLE_CUSTOMER': return 'CUSTOMER';
      case 'ROLE_ADMIN': return 'ADMIN';
      default: return null;
    }
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role']; // 'OWNER'
    const userRole = this.authService.getRole(); // 'ROLE_RESTAURANT_OWNER'

    if (this.normalize(userRole) === requiredRole) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
