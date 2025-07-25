import { Component, OnInit } from '@angular/core';
import { OwnerService, Restaurant } from '../../shared/owner.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css'],
})
export class RestaurantDetailsComponent implements OnInit {
  restaurant: Restaurant = {
    id: 0,
    name: '',
    description: '',
    cuisineType: '',
    images: [],
    openingHours: '',
    open: false,
    status: 'CLOSED',
    contactInformation: {
      email: '',
      mobile: '',
      twitter: '',
      instagram: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  };

  isEditing = false;
  loading = false;
  errorMessage = '';
  newImageUrl = '';

  constructor(
    private ownerService: OwnerService,
    private router: Router,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    this.loadRestaurant();
  }

  loadRestaurant(): void {
    this.loading = true;
    this.ownerService.getMyRestaurant().subscribe({
      next: (data) => {
        this.restaurant = {
          id: data.id ?? 0,
          name: data.name ?? '',
          description: data.description ?? '',
          cuisineType: data.cuisineType ?? '',
          images: data.images ?? [],
          openingHours: data.openingHours ?? '',
          open: data.open ?? false,
          status: data.status ?? (data.open ? 'OPEN' : 'CLOSED'),
          contactInformation: {
            email: data.contactInformation?.email || '',
            mobile: data.contactInformation?.mobile || '',
            twitter: data.contactInformation?.twitter || '',
            instagram: data.contactInformation?.instagram || ''
          },
          address: {
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            zipCode: data.address?.zipCode || ''
          }
        };

        this.loading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        this.errorMessage = 'Failed to load restaurant.';
        this.toastr.error(this.errorMessage, 'Error');
        console.error('❌ Restaurant load error:', err);
        this.loading = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    if (!this.restaurant || !this.restaurant.id) return;

    this.ownerService.updateRestaurant(this.restaurant.id, this.restaurant).subscribe({
      next: (updated) => {
        this.restaurant = updated;
        this.isEditing = false;
        this.toastr.success('Restaurant updated successfully!', 'Success');
      },
      error: (err) => {
        this.toastr.error('Update failed. Please try again.', 'Error');
        console.error('❌ Update error:', err);
      }
    });
  }

  deleteRestaurant(): void {
    if (!this.restaurant?.id) return;
    if (confirm('Are you sure you want to delete this restaurant?')) {
      this.ownerService.deleteRestaurant(this.restaurant.id).subscribe({
        next: () => {
          this.toastr.success('Restaurant deleted successfully!', 'Deleted');
          this.router.navigate(['/admin/restaurants']);
        },
        error: (err) => {
          this.toastr.error('Failed to delete the restaurant.', 'Error');
          console.error('❌ Delete error:', err);
        }
      });
    }
  }

  toggleStatus(): void {
    if (!this.restaurant?.id) return;

    this.ownerService.updateRestaurantStatus(this.restaurant.id).subscribe({
      next: (updated) => {
        this.restaurant.status = updated.status || (updated.open ? 'OPEN' : 'CLOSED');
        const message = this.restaurant.status === 'OPEN' ? 'Restaurant is now Open' : 'Restaurant is now Closed';
        this.toastr.success(message, 'Status Updated');
      },
      error: (err) => {
        this.toastr.error('Failed to update restaurant status.', 'Error');
        console.error('❌ Status toggle error:', err);
      }
    });
  }

  addImage(): void {
    const trimmed = this.newImageUrl.trim();
    const duplicate = this.restaurant.images.some(
      img => img.trim().toLowerCase() === trimmed.toLowerCase()
    );

    if (trimmed && !duplicate) {
      this.restaurant.images.push(trimmed);
      this.newImageUrl = '';
      this.toastr.success('Image added.', 'Success');
    } else if (duplicate) {
      this.toastr.warning('This image already exists.', 'Warning');
    }
  }

  removeImage(index: number): void {
    this.restaurant.images.splice(index, 1);
    this.toastr.info('Image removed.', 'Removed'); 
  }
}
