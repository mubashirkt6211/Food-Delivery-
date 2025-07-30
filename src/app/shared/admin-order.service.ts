import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// -------- Order Interfaces --------
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode?: number;
}

export interface Dish {
  name: string;
  price: number;
}

export interface OrderItem {
  food: Dish;
  quantity: number;
}

export interface Order {
  id: number;
  orderStatus: string;
  createdAt: string;
  totalItem: number;
  totalPrice: number;
  totalAmount?: number;
  items: OrderItem[];
  deliveryAddress: Address;
  restaurant?: any;
  customer?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AdminOrderService {
  // 👇 Directly defined API base URL here
  private baseUrl = 'http://localhost:8080/api/admin/order';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const jwt = localStorage.getItem('jwt');
    return new HttpHeaders({
      Authorization: jwt ? `Bearer ${jwt}` : '',
    });
  }

  // ✅ Get all restaurant orders (optionally filter by status)
  getRestaurantOrders(orderStatus?: string): Observable<Order[]> {
    let params = new HttpParams();
    if (orderStatus) {
      params = params.set('order_status', orderStatus);
    }

    return this.http.get<Order[]>(`${this.baseUrl}/restaurant`, {
      headers: this.getAuthHeaders(),
      params,
    });
  }

  // ✅ Update order status (e.g., to DELIVERED, CANCELLED)
  updateOrderStatus(orderId: number, orderStatus: string): Observable<Order> {
    return this.http.put<Order>(
      `${this.baseUrl}/${orderId}/${orderStatus}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}
