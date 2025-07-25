import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../shared/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer.component.html',
})
export class OfferComponent {
  constructor(private cartService: CartService, private toastr: ToastrService) {}

  discountedDishes = [
    {
      id: 101,
      name: 'Cheesy Burger',
      description: 'Grilled beef, cheddar, lettuce',
      image: 'assets/dishes/burger.png',
      originalPrice: 199,
      discount: 20,
      tags: ['🔥 Spicy', '🍔 Bestseller'],
    },
    {
      id: 102,
      name: 'Loaded Pizza',
      description: 'Double cheese, olives, capsicum',
      image: 'assets/dishes/pizza.png',
      originalPrice: 299,
      discount: 25,
      tags: ['🌱 Veg', '🧀 Extra Cheese'],
    },
    {
      id: 103,
      name: 'Veggie Wrap',
      description: 'Fresh veggies, spicy mayo',
      image: 'https://i.pinimg.com/736x/92/bb/1b/92bb1b90b98c3ee377b40d439205663e.jpg',
      originalPrice: 149,
      discount: 15,
      tags: ['🌯 Wrap', '🥗 Healthy'],
    },
    {
      id: 104,
      name: 'Tandoori Paneer',
      description: 'Paneer, onion, bell pepper, spices',
      image: 'https://i.pinimg.com/originals/50/ea/fd/50eafdbbc4ee69a4b71fdf7f3762fdbe.jpg',
      originalPrice: 179,
      discount: 18,
      tags: ['🔥 Spicy', '🧡 Indian'],
    },
  ];

  getDiscountedPrice(dish: any): number {
    return Math.round(dish.originalPrice - (dish.originalPrice * dish.discount) / 100);
  }

  addToCart(dish: any) {
    const price = this.getDiscountedPrice(dish);
    const request = {
      foodId: dish.id,
      quantity: 1,
    };

    this.cartService.addItemToCart(request).subscribe({
      next: () => {
        this.toastr.success(`${dish.name} added to cart!`, 'Success');
      },
      error: (err) => {
        console.error('Add to cart failed', err);
        this.toastr.error('Could not add to cart.');
      },
    });
  }
}
