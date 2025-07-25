import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../shared/cart.service';
import { RestaurantService } from '../shared/restaurant.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service'; // ✅ Import AuthService

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css'],
})
export class RestaurantComponent implements OnInit {
  restaurants: any[] = [];
  searchKeyword: string = '';
  favoriteIds: number[] = [];

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private restaurantService: RestaurantService,
    private authService: AuthService, // ✅ Inject AuthService
    private router: Router // ✅ Inject Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
    this.fetchRestaurants();
  }

  loadFavorites(): void {
    this.restaurantService.getFavoriteRestaurants().subscribe({
      next: (res) => {
        this.favoriteIds = res.map((r: any) => r.id);
      },
      error: () => {
        this.favoriteIds = [];
      }
    });
  }

  fetchRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (res) => {
        this.restaurants = res.map((r: any) => ({
          ...r,
          filter: 'All',
          dishes: [],
        }));

        this.restaurants.forEach((restaurant, index) => {
          this.restaurantService.getDishesByRestaurant(restaurant.id).subscribe({
            next: (dishes) => {
              this.restaurants[index].dishes = dishes;
            },
            error: (err) => {
              console.error(`❌ Failed to load dishes for ${restaurant.name}`, err);
            }
          });
        });
      },
      error: (err) => {
        console.error('❌ Failed to fetch restaurants', err);
      }
    });
  }

  searchRestaurants(): void {
    const keyword = this.searchKeyword.trim();
    if (!keyword) {
      this.fetchRestaurants();
      return;
    }

    this.restaurantService.searchRestaurants(keyword).subscribe({
      next: (res) => {
        this.restaurants = res.map((r: any) => ({
          ...r,
          filter: 'All',
          dishes: [],
        }));

        this.restaurants.forEach((restaurant, index) => {
          this.restaurantService.getDishesByRestaurant(restaurant.id).subscribe({
            next: (dishes) => {
              this.restaurants[index].dishes = dishes;
            },
            error: (err) => {
              console.error(`❌ Failed to load dishes for ${restaurant.name}`, err);
            }
          });
        });
      },
      error: (err) => {
        console.error('❌ Search failed', err);
      },
    });
  }

  addToFavorites(id: number): void {
    const isAlreadyFavorite = this.favoriteIds.includes(id);

    this.restaurantService.addToFavorites(id).subscribe({
      next: () => {
        if (isAlreadyFavorite) {
          this.favoriteIds = this.favoriteIds.filter(favId => favId !== id);
          this.toastr.info('Removed from favorites');
        } else {
          this.favoriteIds.push(id);
          this.toastr.success('Added to favorites');
        }
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.toastr.warning('Please login to manage favorites');
          this.router.navigate(['/login']);
        } else {
          this.toastr.error('Failed to update favorite');
        }
      }
    });
  }

  isFavorite(id: number): boolean {
    return this.favoriteIds.includes(id);
  }

  scrollLeft(index: number): void {
    const el = document.getElementById('dishScroll' + index);
    el?.scrollBy({ left: -200, behavior: 'smooth' });
  }

  scrollRight(index: number): void {
    const el = document.getElementById('dishScroll' + index);
    el?.scrollBy({ left: 200, behavior: 'smooth' });
  }

 isOpen(openingTime?: string, closingTime?: string): boolean {
  const defaultOpen = '09:00 AM';
  const defaultClose = '09:00 PM';

  const openTime = openingTime || defaultOpen;
  const closeTime = closingTime || defaultClose;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const open = this.getTimeInMinutes(openTime);
  const close = this.getTimeInMinutes(closeTime);

  // Debug
  console.log(`🚩 [isOpen Debug] Now: ${now.toLocaleTimeString()} (${currentMinutes}min),
               Open @ "${openTime}" → ${open},
               Close @ "${closeTime}" → ${close}`);

  // Overnight handling
  if (open > close) {
    return currentMinutes >= open || currentMinutes < close;
  } else {
    return currentMinutes >= open && currentMinutes < close;
  }
}



  getTimeInMinutes(timeStr: string): number {
    if (!timeStr) return 0;

    const [time, modifier] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (modifier?.toUpperCase() === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  getFilteredDishes(restaurant: any): any[] {
    const filter = restaurant.filter || 'All';
    return restaurant.dishes.filter((d: any) => {
      if (filter === 'Veg') return d.vegetarian === true;
      if (filter === 'Non-Veg') return d.vegetarian === false;
      if (filter === 'Seasonal') return d.seasonal === true;
      return true;
    });
  }

addToCart(dish: any, restaurant: any): void {
  if (!this.authService['isLoggedIn$'].value) {
    this.router.navigate(['/login']);
    return;
  }

  if (!this.isOpen(restaurant.openingTime, restaurant.closingTime)) {
    alert(`${restaurant.name} is currently closed. You can't place an order now.`);
    return;
  }

  this.cartService.addItemToCart({
    foodId: dish.id,
    quantity: 1
  }).subscribe({
    next: () => {
      this.toastr.success(`${dish.name} added to cart`);
    },
    error: (err) => {
      this.toastr.error('Failed to add item to cart');
      console.error(err);
    }
  });
}


  toggleFilter(restaurant: any, type: 'All' | 'Veg' | 'Non-Veg' | 'Seasonal'): void {
    restaurant.filter = type;
  }

  getFullImageUrl(imagePath: string): string {
    return imagePath || 'https://via.placeholder.com/150?text=No+Image';
  }
}
