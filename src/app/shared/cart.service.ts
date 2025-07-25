import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap,map } from 'rxjs/operators';

export interface FoodSummary {
  id: number;
  name: string;
  price: number;
  images: string[];
  restaurant: {
    id: number;
    name: string;
  };
}



export interface CartItem {
  id: number;
  food: FoodSummary;
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  id: number;
  total: number;
  items: CartItem[];
}

export interface AddCartItemRequest {
  foodId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartItemId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://localhost:8080/api';
  private localStorageKey = 'userCart';

  private cartSubject = new BehaviorSubject<Cart | null>(this.loadCartFromStorage());
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshCart(); // Load latest from backend on init
  }

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('jwtToken') || '';
    return {
      headers: new HttpHeaders({ Authorization: token }),
    };
  }

  private saveCartToStorage(cart: Cart | null): void {
    if (cart) {
      localStorage.setItem(this.localStorageKey, JSON.stringify(cart));
    } else {
      localStorage.removeItem(this.localStorageKey);
    }
  }

  private loadCartFromStorage(): Cart | null {
    const stored = localStorage.getItem(this.localStorageKey);
    return stored ? JSON.parse(stored) : null;
  }

  setCart(cart: Cart) {
    this.cartSubject.next(cart);
    this.saveCartToStorage(cart);
  }

  refreshCart(): void {
  this.getUserCart().subscribe({
    next: (cart) => this.cartSubject.next(cart),
    error: (err) => console.error('Failed to refresh cart:', err)
  });
}

  getUserCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/cart`, this.getHeaders()).pipe(
      tap((cart) => this.setCart(cart))
    );
  }

  addItemToCart(req: AddCartItemRequest): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.baseUrl}/cart/add`, req, this.getHeaders()).pipe(
      tap(() => this.refreshCart())
    );
  }

  updateCartItemQuantity(req: UpdateCartItemRequest): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.baseUrl}/cart-item/update`, req, this.getHeaders()).pipe(
      tap(() => this.refreshCart())
    );
  }

  removeCartItem(cartItemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.baseUrl}/cart-item/${cartItemId}/remove`, this.getHeaders()).pipe(
      tap((cart) => this.setCart(cart))
    );
  }

  clearCart(): Observable<Cart> {
    return this.http.put<Cart>(`${this.baseUrl}/cart/clear`, {}, this.getHeaders()).pipe(
      tap((cart) => this.setCart(cart))
    );
  }
cartItems$ = this.cart$.pipe(
  map(cart => cart?.items ?? []) // return empty array if cart is null
);

}
