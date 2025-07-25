import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService, AddCartItemRequest } from '../shared/cart.service';

interface Dish {
  id: number; // ✅ Required for cart request
  name: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
    @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  categories = [
    { name: 'All', icon: 'https://i.pinimg.com/736x/23/6b/a5/236ba56962a3ba362a47fcbc634f206e.jpg' },
    { name: 'Burgers', icon: 'https://i.pinimg.com/736x/23/b1/62/23b162c987e481b7ba2916aebd1abc66.jpg' },
    { name: 'Pizza', icon: 'https://i.pinimg.com/736x/31/ed/a3/31eda3c4d743213925af09a0e6194cae.jpg' },
    { name: 'Drinks', icon: 'https://i.pinimg.com/736x/ae/28/94/ae2894eebb3edc2c406e16b7cb35d502.jpg' },
    { name: 'Fries', icon: 'https://i.pinimg.com/1200x/7b/78/5d/7b785d3928b1763856086f8a7ae4951e.jpg' },
    { name: 'Sushi', icon: 'https://i.pinimg.com/736x/04/67/17/0467170f893a45beb492900df7ba41e1.jpg' },
    { name: 'Tikka', icon: 'https://i.pinimg.com/1200x/99/1d/90/991d901a658f71a6709052c884bf546e.jpg' },
    { name: 'Biriyani', icon: 'https://i.pinimg.com/1200x/1a/59/f0/1a59f0e988c227075ce7a6e261f9f362.jpg' },
    { name: 'Noodels', icon: 'https://i.pinimg.com/1200x/9f/3f/a9/9f3fa907e12bd0eaec676b18a0def9d2.jpg' },
  ];

  selectedCategory: string | null = null;
  filteredDishes: Dish[] = [];

  dishes: Dish[] = [
    {
      id: 1,
      name: 'Cheese Burger',
      price: 129,
      image: 'https://i.pinimg.com/736x/31/ed/a3/31eda3c4d743213925af09a0e6194cae.jpg',
      category: 'Burgers',
      available: true
    },
    {
      id: 2,
      name: 'Veg Pizza',
      price: 199,
      image: 'assets/dishes/pizza.jpg',
      category: 'Pizza',
      available: false
    },
    // Add more dishes here...
  ];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.filteredDishes = this.dishes;
    this.selectedCategory = 'All';
  }

  selectCategory(category: { name: string }) {
    this.selectedCategory = category.name;
    if (category.name === 'All') {
      this.filteredDishes = this.dishes;
    } else {
      this.filteredDishes = this.dishes.filter(
        dish => dish.category === category.name
      );
    }
  }

  clearCategory() {
    this.selectedCategory = null;
    this.filteredDishes = [];
  }

  addToCart(dish: Dish) {
    const req: AddCartItemRequest = {
      foodId: dish.id,
      quantity: 1
    };
    this.cartService.addItemToCart(req).subscribe({
      next: () => {
        console.log(`${dish.name} added to cart`);
        this.cartService.refreshCart(); // ✅ optional if you want cart UI to update live
      },
      error: (err) => console.error('Failed to add to cart', err)
    });
  }
  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -150, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 150, behavior: 'smooth' });
  }
}
