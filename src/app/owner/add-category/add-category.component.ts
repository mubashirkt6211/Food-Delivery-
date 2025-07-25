import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-owner-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category.component.html'
})
export class OwnerAddCategoryComponent implements OnInit {
  @Output() categoryAdded = new EventEmitter<void>();

  categoryName: string = '';
  categories: Category[] = [];
  loading = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken') || ''}`
    });
  }

  loadCategories(): void {
    this.http.get<Category[]>('/api/category/restaurant', { headers: this.getAuthHeaders() }).subscribe({
      next: (res) => this.categories = res,
      error: (err) => {
        console.error('❌ Failed to load categories', err);
        this.toastr.error('❌ Failed to load categories');
      }
    });
  }

  addCategory(): void {
    if (!this.categoryName.trim()) {
      this.toastr.warning('⚠️ Please enter a category name');
      return;
    }

    const body = { name: this.categoryName };

    this.loading = true;

    this.http.post<Category>('/api/admin/category', body, { headers: this.getAuthHeaders() }).subscribe({
      next: (newCategory) => {
        this.toastr.success('✅ Category added successfully');
        this.categories.push(newCategory);
        this.categoryName = '';
        this.loading = false;
        this.categoryAdded.emit(); // notify parent
      },
      error: (err) => {
        console.error('❌ Failed to add category', err);
        this.toastr.error('❌ Failed to add category');
        this.loading = false;
      }
    });
  }
 deleteCategory(categoryId: number): void {
  if (!confirm('Are you sure you want to delete this category?')) return;

  this.http.delete(`/api/admin/category/${categoryId}`, {
    headers: this.getAuthHeaders()
  }).subscribe({
    next: () => {
      this.toastr.success('🗑️ Category deleted successfully');
      this.loadCategories(); // 🔄 REFRESH FROM BACKEND
    },
    error: (err) => {
      console.error('❌ Failed to delete category', err);
      this.toastr.error(err.error || '❌ Failed to delete category');
    }
  });
}


}
