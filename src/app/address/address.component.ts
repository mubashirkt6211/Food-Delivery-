import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, PaymentResponse, Address as AddressModel } from '../shared/order.service';
import { CartService } from '../shared/cart.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../shared/auth.service';
import { CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf, NgFor, JsonPipe],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  restaurantId!: number;

  address: AddressModel = {
    street: '',
    city: '',
    state: '',
    zipCode: 0
  };

  savedAddresses: AddressModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cartService: CartService,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.restaurantId = Number(this.route.snapshot.paramMap.get('restaurantId'));
    const user = this.authService.getUser();

    if (user?.id) {
      this.http.get<AddressModel[]>(`/api/users/${user.id}/addresses`).subscribe({
        next: (addresses) => (this.savedAddresses = addresses),
        error: () => this.toastr.warning('Could not load saved addresses')
      });
    }
  }

  useSavedAddress(addr: AddressModel) {
    this.address = { ...addr };
    this.toastr.info('Address filled into the form');
  }

  placeOrder(selectedAddress?: AddressModel) {
    const deliveryAddress = selectedAddress || this.address;

    const payload = {
      restaurantId: this.restaurantId,
      deliveryAddress
    };

    this.orderService.placeOrder(payload).subscribe({
      next: (response: PaymentResponse) => {
        this.cartService.clearCart().subscribe({
          next: () => {
            this.toastr.success('Redirecting to payment...');
            window.location.href = response.payment_url;
          },
          error: () => {
            this.toastr.warning('Redirecting to payment, but cart was not cleared');
            window.location.href = response.payment_url;
          }
        });
      },
      error: () => this.toastr.error('Failed to place order.')
    });
  }
}
