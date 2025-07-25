import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminOrderService } from '../../shared/admin-order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  restaurantId: number = 0;

  constructor(private adminOrderService: AdminOrderService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const decoded: any = this.decodeJWT(token);
      console.log('🔓 Decoded JWT:', decoded);

      this.restaurantId = decoded?.restaurantId;
      if (this.restaurantId) {
        this.loadOrders();
      } else {
        console.error('❌ restaurantId not found in token payload');
      }
    } else {
      console.error('❌ No JWT token found in localStorage');
    }
  }

  loadOrders(): void {
    console.log('📦 Fetching orders for restaurant ID:', this.restaurantId);
    this.adminOrderService.getOrdersByRestaurant(this.restaurantId).subscribe({
      next: (data) => {
        console.log('✅ Orders fetched:', data);
        this.orders = data;
      },
      error: (err) => {
        console.error('❌ Failed to load orders:', err);
        this.orders = [];
      },
    });
  }

  updateStatus(orderId: number, newStatus: string): void {
    if (!orderId || !newStatus) return;
    console.log(`🔄 Updating status for order #${orderId} to '${newStatus}'`);
    this.adminOrderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        console.log(`✅ Order #${orderId} status updated to ${newStatus}`);
        this.loadOrders();
      },
      error: (err) => {
        console.error('❌ Failed to update order status:', err);
      },
    });
  }

  private decodeJWT(token: string): any {
    try {
      const base64Payload = token.split('.')[1];
      const jsonPayload = atob(base64Payload);
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('❌ JWT decoding failed:', error);
      return null;
    }
  }
}
