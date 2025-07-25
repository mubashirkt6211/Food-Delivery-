import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OfferComponent } from '../offer/offer.component';
import { CategoryComponent } from '../category/category.component';
import { FooterComponent } from '../footer/footer.component';
import { RestaurantService } from '../shared/restaurant.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, OfferComponent, CategoryComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  userName: string = 'Guest';
  searchKeyword: string = '';
  searchResults: any[] = [];
  showDropdown: boolean = false;
  isLoading: boolean = false;

  readonly favoriteDishes = [
    {
      name: 'Spicy Burger',
      description: 'Beef patty, cheese, spicy sauce',
      price: 149,
      image: 'https://i.pinimg.com/736x/23/b1/62/23b162c987e481b7ba2916aebd1abc66.jpg',
    },
    {
      name: 'Margherita Pizza',
      description: 'Classic cheese & tomato',
      price: 199,
      image: 'assets/dishes/pizza.png',
    },
    {
      name: 'Sushi Roll',
      description: 'Salmon, rice, seaweed',
      price: 299,
      image: 'assets/dishes/sushi.png',
    },
    {
      name: 'Cold Coffee',
      description: 'Chilled with cream',
      price: 89,
      image: 'assets/dishes/coffee.png',
    },
  ];

  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private router: Router
  ) {
  }

 

  searchRestaurants(): void {
    const keyword = this.searchKeyword.trim();
    if (!keyword) {
      this.searchResults = [];
      this.showDropdown = false;
      return;
    }

    this.isLoading = true;

    this.restaurantService.searchRestaurants(keyword).subscribe({
      next: (res) => {
        this.searchResults = res;
        this.showDropdown = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Search failed:', err);
        this.searchResults = [];
        this.showDropdown = false;
        this.isLoading = false;
      },
    });
  }

  selectRestaurant(restaurant: any): void {
    this.searchKeyword = restaurant.name;
    this.showDropdown = false;
    this.router.navigate(['/restaurant', restaurant.id]);
  }

  goToRestaurant(id: number): void {
    this.router.navigate(['/restaurant', id]);
  }

  hideDropdownLater(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
}
