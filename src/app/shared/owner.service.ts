import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Matching the backend structure exactly
export interface ContactInformation {
  email: string;
  mobile: string;
  twitter?: string;
  instagram?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Restaurant {
  id?: number;
  name: string;
  description: string;
  cuisineType: string;
  images: string[];
  contactInformation: ContactInformation;
  openingHours: string;
  address: Address;
  open: boolean; // ✅ type-safe
  status?: string; // derived from open
}


@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  private baseUrl = '/api/admin/restaurants';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    console.log('🔐 Sending token:', token); // for debugging
    return new HttpHeaders({
      Authorization: token || '', // ✅ raw token
    });
  }

  createRestaurant(data: Restaurant): Observable<Restaurant> {
    return this.http.post<Restaurant>(this.baseUrl, data, {
      headers: this.getAuthHeaders(),
    });
  }

  updateRestaurant(id: number, data: Restaurant): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${this.baseUrl}/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteRestaurant(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateRestaurantStatus(id: number): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${this.baseUrl}/${id}/status`, {}, {
      headers: this.getAuthHeaders(),
    });
  }

  getMyRestaurant(): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.baseUrl}/user`, {
      headers: this.getAuthHeaders(),
    });
  }
}
