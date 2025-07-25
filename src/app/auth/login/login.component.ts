import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // ✅ Toast import

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService // ✅ Inject ToastrService
  ) {}

login(): void {
  if (!this.email || !this.password) {
    this.toastr.warning('Please enter both email and password.');
    return;
  }

  this.isLoading = true;

  this.auth.login({ email: this.email, password: this.password }).subscribe({
    next: (res: any) => {
      const token = res.jwt || res.token || res.accessToken;
      if (!token) {
        this.toastr.error('Token missing in response.');
        this.isLoading = false;
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded Token:', payload);

      const role = payload?.authorities || res.role;

      if (role === 'ROLE_RESTAURANT_OWNER') {
        this.router.navigate(['/owner/dashboard']);
      } else if (role === 'ROLE_CUSTOMER') {
        this.router.navigate(['/user/dashboard']);
      } else {
        this.toastr.error('❌ Unknown role: ' + role);
        return;
      }

      this.toastr.success('🎉 Login successful!');
      this.isLoading = false;
    },
    error: (err) => {
      this.toastr.error(err.error?.message || 'Login failed.');
      this.isLoading = false;
    },
  });
}




}
