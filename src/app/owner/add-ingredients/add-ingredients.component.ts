import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-owner-add-ingredients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-ingredients.component.html'
})
export class OwnerAddIngredientsComponent implements OnInit {
  restaurantId: number = 0;
  categoryName = '';
  ingredientName = '';
  selectedCategoryId: number | null = null;
  categories: any[] = [];
  loading = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.extractRestaurantIdFromToken();
    this.loadIngredientCategories();
  }

  extractRestaurantIdFromToken(): void {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.restaurantId = decoded?.restaurantId || 0;
      } catch (e) {
        console.error('JWT decode error:', e);
        this.toastr.error('Invalid token');
      }
    }
  }

  private getAuthHeader() {
    const token = localStorage.getItem('jwtToken') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  loadIngredientCategories(): void {
    if (!this.restaurantId) return;

    this.http.get(`/api/admin/ingredients/restaurant/${this.restaurantId}/category`, this.getAuthHeader())
      .subscribe({
        next: (res: any) => this.categories = res,
        error: (err) => {
          console.error('Error loading categories:', err);
          this.toastr.error('❌ Failed to load ingredient categories');
        }
      });
  }

  addCategory(): void {
    if (!this.categoryName.trim()) {
      this.toastr.warning('⚠️ Category name is required');
      return;
    }

    const body = {
      name: this.categoryName.trim(),
      restaurantId: this.restaurantId
    };

    this.http.post(`/api/admin/ingredients/category`, body, this.getAuthHeader())
      .subscribe({
        next: () => {
          this.toastr.success('✅ Category added');
          this.categoryName = '';
          this.loadIngredientCategories();
        },
        error: (err) => {
          console.error('Error adding category:', err);
          this.toastr.error('❌ Failed to add category');
        }
      });
  }

  addIngredient(): void {
    if (!this.ingredientName.trim() || !this.selectedCategoryId) {
      this.toastr.warning('⚠️ Select category & enter ingredient');
      return;
    }

    const body = {
      name: this.ingredientName.trim(),
      categoryId: this.selectedCategoryId,
      restaurantId: this.restaurantId
    };

    this.http.post(`/api/admin/ingredients`, body, this.getAuthHeader())
      .subscribe({
        next: () => {
          this.toastr.success('✅ Ingredient added');
          this.ingredientName = '';
          this.selectedCategoryId = null;
        },
        error: (err) => {
          console.error('Error adding ingredient:', err);
          this.toastr.error('❌ Failed to add ingredient');
        }
      });
  }
}
