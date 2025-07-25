import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  standalone: true,
  template: `<p class="text-center mt-10 text-gray-600">Redirecting...</p>`,
})
export class RedirectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const roles: string[] = payload?.authorities || [];

        if (roles.includes('ROLE_RESTAURANT_OWNER')) {
          this.router.navigate(['/owner']);
        } else if (roles.includes('ROLE_CUSTOMER')) {
          this.router.navigate(['/user/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      } catch (e) {
        console.error('Invalid token format:', e);
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
