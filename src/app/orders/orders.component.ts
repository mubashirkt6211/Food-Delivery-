import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../shared/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  standalone: true, // ✅ Angular 18 standalone component
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  private orderService = inject(OrderService); 
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getUserOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load orders.');
        this.loading = false;
      }
    });
  }

 getTotalAmount(order: Order): number {
  if (order.totalPrice && order.totalPrice > 0) {
    return order.totalPrice;
  }

  // Fallback: calculate total from items
  return order.items?.reduce((sum, item) => {
    const price = item.food?.price ?? 0;
    const quantity = item.quantity ?? 0;
    return sum + (price * quantity);
  }, 0) ?? 0;
}


cancelOrder(orderId: number) {
  if (confirm('Are you sure you want to cancel this order?')) {
    this.orderService.cancelOrder(orderId).subscribe({
      next: (res) => {
        this.toastr.success(res.message); // ✅ parse message from JSON
        this.fetchOrders();
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Failed to cancel order');
      }
    });
  }
}






}
