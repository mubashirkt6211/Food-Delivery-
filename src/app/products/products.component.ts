import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem, AddCartItemRequest } from '../shared/cart.service';
import { FooterComponent } from '../footer/footer.component';
import { ToastrService } from 'ngx-toastr'; // ✅ Added toast support

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  vegetarian: boolean;
  seasonal: boolean;
  creationDate: Date;
  images: string[];
  foodCategory: {
    id: number;
    name: string;
  };
  restaurant: {
    id: number;
    name: string;
    image: string[];
    description: string;
    cuisineType: string;
    openingHours: string;
    registrationDate: Date;
    status: string;
    open: boolean;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    contactInformation: {
      email: string;
      mobile: string;
      twitter: string;
      instagram: string;
    };
    images: string[];
  };
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  @ViewChild('restaurantSection') restaurantSection!: ElementRef;

  dishes: Dish[] = [];
  selectedDish: Dish | null = null;
  selectedRestaurant: any = null;
  cartItems: CartItem[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private cart: CartService,
    private http: HttpClient,
    private toastr: ToastrService // ✅ Injected toastr
  ) {}

  ngOnInit(): void {
    this.http.get<Dish[]>('http://localhost:8080/api/food/all').subscribe({
      next: (data) => {
        this.dishes = data;
      },
      error: (err) => {
        console.error('❌ Failed to load dishes:', err);
      },
    });

    // Optional: Load cart items for count display
    this.cart.getUserCart().subscribe({
      next: (cart) => {
        this.cartItems = cart.items;
      },
    });
  }

  get allDishes(): Dish[] {
    return this.dishes;
  }

  get cartCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  get cartTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.quantity * item.food.price,
      0
    );
  }

addToCart(dish: Dish): void {
  if (!dish.available) {
    this.toastr.warning(`${dish.name} is currently unavailable.`, 'Not Available');
    return;
  }

  const request: AddCartItemRequest = {
    foodId: dish.id,
    quantity: 1,
  };

this.cart.addItemToCart(request).subscribe({
  next: () => {
    this.toastr.success(`${dish.name} added to cart.`, 'Success');
    this.cart.refreshCart(); // ✅ This now triggers update in CartComponent
  },
  error: () => {
    this.toastr.error('Could not add item to cart.', 'Error');
  }
});

}

  onSelectDish(dish: Dish): void {
    if (this.selectedDish?.id === dish.id) {
      this.clearSelection();
    } else {
      this.selectedDish = dish;

      const [openingTime = '', closingTime = ''] =
        dish.restaurant.openingHours.split(' - ');

      this.selectedRestaurant = {
        name: dish.restaurant.name,
        description: dish.restaurant.description,
        cuisine: dish.restaurant.cuisineType,
        image: dish.restaurant.images[0],
        address: `${dish.restaurant.address.street}, ${dish.restaurant.address.city}, ${dish.restaurant.address.state} - ${dish.restaurant.address.zipCode}`,
        openingTime: openingTime.trim(),
        closingTime: closingTime.trim(),
        registrationDate: new Date(dish.restaurant.registrationDate),
        ownerId: dish.restaurant.id,
        social: {
          facebook: '',
          instagram: dish.restaurant.contactInformation.instagram,
          twitter: dish.restaurant.contactInformation.twitter,
        },
      };

      this.cdr.detectChanges();
      setTimeout(() => {
        const section = document.getElementById('restaurantDetail');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  clearSelection(): void {
    this.selectedDish = null;
    this.selectedRestaurant = null;
  }

  isOpen(openingTime: string, closingTime: string): boolean {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const [openH, openM] = openingTime.split(':').map(Number);
    const [closeH, closeM] = closingTime.split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;
    return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  }

}
