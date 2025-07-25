import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private baseUrl = 'http://localhost:8080/api/restaurants';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt') || localStorage.getItem('jwtToken'); // ✅ include both just in case
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAllRestaurants(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  searchRestaurants(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/search?keyword=${keyword}`,
      { headers: this.getAuthHeaders() }
    );
  }

  addToFavorites(restaurantId: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${restaurantId}/add-favorites`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  getDishesByRestaurant(restaurantId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `/api/food/restaurant/${restaurantId}`,
      { headers: this.getAuthHeaders() } // ✅ unified call
    );
  }

  getFavoriteRestaurants(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/favorites`,
      { headers: this.getAuthHeaders() }
    );
  }
}
