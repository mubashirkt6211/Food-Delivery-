import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartComponent } from '../cart/cart.component';
import { AuthService } from '../shared/auth.service';
import { CartService } from '../shared/cart.service'; // ✅ Import your cart service

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements OnInit {
  dropdownOpen = false;
  isOwner = false;
  isCustomer = false;
  isLoggedIn = false;

  cartCount = 0; // ✅ Add cart count variable

  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartService // ✅ Inject cart service
  ) {}

  ngOnInit(): void {
    this.authService.role$.subscribe(role => {
      this.isOwner = role === 'ROLE_RESTAURANT_OWNER';
      this.isCustomer = role === 'ROLE_CUSTOMER';
    });

    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    // ✅ Subscribe to cart changes
    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.length;
    });
  }

  logout() {
    this.authService.logout();
    this.dropdownOpen = false;
    this.router.navigate(['/dashboard']);
  }

  getUserName(): string {
    const user = this.authService.getUser();
    return user?.name || 'User';
  }

  handleDropdownClick() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }

  goToFavorites(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['user/favorites']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
