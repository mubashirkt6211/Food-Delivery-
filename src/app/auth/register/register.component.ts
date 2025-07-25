import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role = ''; // Should be either ROLE_CUSTOMER or ROLE_RESTAURANT_OWNER

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  register(): void {
    if (!this.name || !this.email || !this.password || !this.role) {
      this.toastr.warning('Please fill all fields', '⚠️ Missing Fields');
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.toastr.warning('Please enter a valid email address', '⚠️ Invalid Email');
      return;
    }

    const user = {
      fullName: this.name,
      email: this.email,
      password: this.password,
      role: this.role // Already in correct format: ROLE_CUSTOMER or ROLE_RESTAURANT_OWNER
    };

    this.auth.signup(user).subscribe({
      next: (res) => {
        if (res?.jwt) {
          this.toastr.success('🎉 Registration successful!', '✅ Welcome Aboard');

          // Store JWT and role immediately for smoother navigation
          localStorage.setItem('jwt_token', res.jwt);
          localStorage.setItem('user_role', res.role);
          this.auth.isLoggedIn$.next(true);

          setTimeout(() => {
            const storedRole = this.auth.getRole();
            if (storedRole === 'ROLE_RESTAURANT_OWNER') {
              this.router.navigate(['/owner']);
            } else {
              this.router.navigate(['/']);
            }
          }, 100);
        } else {
          this.toastr.error('No token received from server', '❌ JWT Missing');
        }
      },
      error: (err) => {
        const errorMsg = err?.error?.message || 'Registration failed';
        this.toastr.error(errorMsg, '❌ Error');
      }
    });
  }

  private validateEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }
}
