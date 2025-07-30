import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminOrderService, Order } from '../../shared/admin-order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private adminOrderService: AdminOrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    console.log('📦 Fetching orders for restaurant owner');
    this.adminOrderService.getRestaurantOrders().subscribe({
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
}
