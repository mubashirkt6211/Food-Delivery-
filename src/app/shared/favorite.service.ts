import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
     private baseUrl = 'http://localhost:8080/api/restaurants';

     constructor(private http:HttpClient){}
    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('jwt'); // ✅ get from storage
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    }
     
      addToFavorites(restaurantId: number): Observable<any> {
         return this.http.put(`${this.baseUrl}/${restaurantId}/add-favorites`, {}, {
           headers: this.getAuthHeaders(),
         });
       }
}
