import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { OwnerAddCategoryComponent } from '../add-category/add-category.component';

interface Dish {
  id?: number;
  name: string;
  description: string;
  price: number;
  images: string[]; // 👈 Use this for data from backend
  vegetarian: boolean;
  seasonal: boolean;
  available?: boolean;
  category?: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-owner-add-dish',
  standalone: true,
  imports: [CommonModule, FormsModule, OwnerAddCategoryComponent],
  templateUrl: './add-dishes.component.html'
})
export class OwnerAddDishComponent implements OnInit {
  newDish = {
    name: '',
    description: '',
    price: 0,
    image: '', // 👈 input field value, mapped to images[0]
    vegetarian: false,
    seasonal: false
  };

  restaurantId: number = 0;
  categoryId: number | null = null;
  categories: Category[] = [];
  dishes: Dish[] = [];
  loading = false;
  showAddCategoryForm = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.decodeJwt();
    this.fetchCategories();
    this.fetchDishes();
  }

  decodeJwt(): void {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.restaurantId = decoded?.restaurantId || 0;
        if (!this.restaurantId) {
          // this.toastr.error('❌ Restaurant ID not found in token');
        }
      } catch (e) {
        console.error('❌ Error decoding token', e);
        this.toastr.error('❌ Invalid token');
      }
    } else {
      this.toastr.error('❌ JWT token not found');
    }
  }

  getAuthHeader(): HttpHeaders {
    const token = localStorage.getItem('jwtToken') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  fetchCategories(): void {
    this.http.get<Category[]>('/api/category/restaurant', { headers: this.getAuthHeader() }).subscribe({
      next: (res) => this.categories = res,
      error: () => this.toastr.error('❌ Failed to load categories')
    });
  }

  fetchDishes(): void {
    this.http.get<Dish[]>('/api/admin/food/all', { headers: this.getAuthHeader() }).subscribe({
      next: (res) => this.dishes = res,
      error: () => this.toastr.error('❌ Failed to load dishes')
    });
  }

  addDish(): void {
    if (!this.newDish.name || !this.categoryId || this.newDish.price <= 0) {
      this.toastr.warning('⚠️ Please fill all required fields');
      return;
    }

    const body = {
      name: this.newDish.name,
      description: this.newDish.description,
      price: this.newDish.price,
      images: [this.newDish.image], // 👈 Wrap image string into array
      vegetarian: this.newDish.vegetarian,
      seasonal: this.newDish.seasonal,
      categoryId: this.categoryId
    };

    this.loading = true;

    this.http.post('/api/admin/food', body, { headers: this.getAuthHeader() }).subscribe({
      next: () => {
        this.toastr.success('✅ Dish added successfully!');
        this.resetForm();
        this.fetchDishes();
        this.loading = false;
      },
      error: (err) => {
        console.error('Add Dish Error', err);
        this.toastr.error('❌ Failed to add dish');
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.newDish = {
      name: '',
      description: '',
      price: 0,
      image: '',
      vegetarian: false,
      seasonal: false
    };
    this.categoryId = null;
  }

  toggleCategoryForm(): void {
    this.showAddCategoryForm = !this.showAddCategoryForm;
  }

  handleNewCategory(): void {
    this.fetchCategories();
    this.showAddCategoryForm = false;
  }

  deleteDish(dishId: number): void {
    if (!confirm('Are you sure you want to delete this dish?')) return;

    this.http.delete(`/api/admin/food/${dishId}`, { headers: this.getAuthHeader() }).subscribe({
      next: () => {
        this.toastr.success('✅ Dish deleted successfully');
        this.fetchDishes();
      },
      error: () => this.toastr.error('❌ Failed to delete dish')
    });
  }

  toggleAvailability(dishId: number): void {
    this.http.put(`/api/admin/food/${dishId}`, null, { headers: this.getAuthHeader() }).subscribe({
      next: () => {
        this.toastr.success('✅ Dish availability updated');
        this.fetchDishes();
      },
      error: () => this.toastr.error('❌ Failed to update availability')
    });
  }
pastelColors = [
  'bg-pink-50',
  'bg-yellow-50',
  'bg-blue-50',
  'bg-green-50',
  'bg-purple-50',
  'bg-orange-50',
];


}
