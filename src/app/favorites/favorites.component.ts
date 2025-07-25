import { Component, OnInit } from '@angular/core';
import { JsonPipe, NgIf, NgFor } from '@angular/common'; // ✅ import JsonPipe, NgIf, NgFor
import { RestaurantService } from '../shared/restaurant.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [JsonPipe, NgIf, NgFor], // ✅ include required pipes
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoriteComponent implements OnInit {
  favorites: any[] = [];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.getFavoriteRestaurants().subscribe({
      next: (data) => {
        this.favorites = data;
        console.log("Fetched favorites:", data);
      },
      error: (err) => {
        console.error("Failed to load favorites", err);
      }
    });
  }
}
