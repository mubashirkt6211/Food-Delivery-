import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const token = localStorage.getItem('jwtToken');

    // ✅ Allow Stripe success page without auth
    if (state.url.startsWith('/payment/ordersuccess')) {
      return true;
    }

    if (token) {
      return true;
    }

    // ❌ Redirect to login for all other protected routes
    return this.router.createUrlTree(['/login']);
  }
}
