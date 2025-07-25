import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private baseUrl = 'http://localhost:8080/api/admin/order';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token =
      localStorage.getItem('jwt_token') ||
      localStorage.getItem('jwt') ||
      localStorage.getItem('jwtToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // ✅ Get orders for a specific restaurant
  getOrdersByRestaurant(restaurantId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/restaurant/${restaurantId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('❌ Failed to load orders', error);
          return throwError(() => error);
        })
      );
  }

  // ✅ Update order status
  updateOrderStatus(orderId: number, newStatus: string): Observable<any> {
    return this.http
      .put(`${this.baseUrl}/${orderId}/${newStatus}`, {}, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('❌ Failed to update order status', error);
          return throwError(() => error);
        })
      );
  }
}
