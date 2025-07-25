import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CartService, CartItem, UpdateCartItemRequest, Cart } from '../shared/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  deliveryCharge = 30;
  gstRate = 0.05;
  showAddressForm = false;

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe({
      next: (cart) => {
        if (cart) {
          this.cartItems = cart.items;
        }
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.toastr.error('Oops, failed to load cart.');
      }
    });

    this.cartService.refreshCart();
  }

  loadCart(): void {
    this.cartService.getUserCart().subscribe({
      next: (cart: Cart) => {
        this.cartItems = cart.items;
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.toastr.error('Oops, failed to load cart.');
      }
    });
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  }

  getGST(): number {
    return this.getSubtotal() * this.gstRate;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getGST() + this.deliveryCharge;
  }

  increaseQty(item: CartItem): void {
    const req: UpdateCartItemRequest = {
      cartItemId: item.id,
      quantity: item.quantity + 1
    };
    this.cartService.updateCartItemQuantity(req).subscribe({
      next: (updatedItem) => {
        item.quantity = updatedItem.quantity;
        this.toastr.success(`${item.food.name} selected`, 'Updated');
      },
      error: () => this.toastr.error('Failed to increase quantity.')
    });
  }

  decreaseQty(item: CartItem): void {
    if (item.quantity > 1) {
      const req: UpdateCartItemRequest = {
        cartItemId: item.id,
        quantity: item.quantity - 1
      };
      this.cartService.updateCartItemQuantity(req).subscribe({
        next: (updatedItem) => {
          item.quantity = updatedItem.quantity;
          this.toastr.info(`${item.food.name} unselected`, 'Updated');
        },
        error: () => this.toastr.error('Failed to decrease quantity.')
      });
    } else {
      this.removeItem(item.id, item.food.name);
    }
  }

  removeItem(itemId: number, foodName: string): void {
    this.cartService.removeCartItem(itemId).subscribe({
      next: (cart: Cart) => {
        this.cartItems = cart.items;
        this.toastr.warning(`${foodName} removed from cart.`, 'Item Removed');
      },
      error: () => this.toastr.error('Failed to remove item.')
    });
  }

  onCheckout(): void {
    if (this.cartItems.length === 0) {
      this.toastr.error('Cart is empty.');
      return;
    }

const restaurantId = this.cartItems[0]?.food?.restaurant?.id;

    if (!restaurantId) {
      this.toastr.error('Restaurant ID not found in cart.');
      return;
    }

    this.router.navigate(['/user/address', restaurantId]);
  }
  goToFoodPage() {
  this.router.navigate(['user/foods']);
}
}
