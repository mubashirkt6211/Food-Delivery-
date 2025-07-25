import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// -------- Address Interface --------
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode?: number;
}

// -------- Dish Interface --------
export interface Dish {
  name: string;
  price: number;
}

// -------- Order Item Interface --------
export interface OrderItem {
  food: Dish;
  quantity: number;
}

// -------- Order Request Interface --------
export interface OrderRequest {
  restaurantId: number;
  deliveryAddress: Address;
}

// -------- Full Order Interface --------
export interface Order {
  id: number;
  orderStatus: string;
  createdAt: string;
  totalItem: number;
  totalPrice: number;
  items: OrderItem[];
  deliveryAddress: Address;
}
export interface PaymentResponse {
  payment_url: string;
}

// -------- Order Service --------
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // ✅ Returns headers with JWT
  private getAuthHeaders(): HttpHeaders {
    const jwt = localStorage.getItem('jwt');
    return new HttpHeaders({
      Authorization: jwt ? `Bearer ${jwt}` : ''
    });
  }

  // ✅ Place a new order
 // Replace the Order return type with PaymentResponse
placeOrder(orderRequest: OrderRequest): Observable<PaymentResponse> {
  return this.http.post<PaymentResponse>(`${this.baseUrl}/order`, orderRequest, {
    headers: this.getAuthHeaders()
  });
}


  // ✅ Get order history for the current user
  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/order/user`, {
      headers: this.getAuthHeaders()
    });
  }
cancelOrder(orderId: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${orderId}/cancel`, {
    headers: this.getAuthHeaders()
  });
}
// ✅ Add this interface at the top or near other interfaces



}
