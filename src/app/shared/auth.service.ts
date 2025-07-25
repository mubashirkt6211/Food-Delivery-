import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private jwtKey = 'jwt_token';
  private roleKey = 'user_role';
  private userKey = 'user';

  // Reactive subjects
  isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  private roleSubject = new BehaviorSubject<string | null>(this.getRole());
  role$ = this.roleSubject.asObservable(); // Observable for components

  constructor(private http: HttpClient) {}

  // --- Auth APIs ---
  signup(data: { email: string; password: string; fullName: string; role: string }) {
    return this.http.post<any>(`${this.baseUrl}/signup`, data).pipe(
      tap(res => this.storeAuth(res))
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.baseUrl}/signin`, data).pipe(
      tap(res => this.storeAuth(res))
    );
  }

  // --- Store JWT and role ---
private storeAuth(response: any) {
  const token = response.jwt || response.token || response.accessToken;
  const payload = JSON.parse(atob(token.split('.')[1]));
  const role = payload?.authorities || response.role;

  localStorage.setItem(this.jwtKey, token);
  localStorage.setItem(this.roleKey, role);
  localStorage.setItem(this.userKey, JSON.stringify(response.user ?? {}));

  this.isLoggedIn$.next(true);
  this.roleSubject.next(role); // ✅ Update roleSubject
}



  // --- Getters ---
  getToken(): string | null {
    return localStorage.getItem(this.jwtKey);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

isOwner(): boolean {
  const token = this.getToken();
  if (!token) return false;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const authorities = payload?.authorities;
  if (!authorities) return false;

  return Array.isArray(authorities)
    ? authorities.includes('ROLE_RESTAURANT_OWNER')
    : authorities === 'ROLE_RESTAURANT_OWNER';
}



  isCustomer(): boolean {
    return this.getRole() === 'ROLE_CUSTOMER';
  }

  // --- Logout ---
  logout() {
    localStorage.removeItem(this.jwtKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userKey);

    this.isLoggedIn$.next(false);
    this.roleSubject.next(null);
  }
  getCurrentUser(): any {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (error) {
      return null;
    }
  }
  return null;
}

}
