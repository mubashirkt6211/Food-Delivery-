import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OwnerService } from '../../shared/owner.service';

@Component({
  selector: 'app-add-restaurant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addrestaurants.component.html',
  styleUrls: ['./addrestaurants.component.css']
})
export class AddRestaurantComponent {
  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    cuisineType: ['', Validators.required],
    images: ['', Validators.required], // Input: comma-separated string

    openingHours: ['', Validators.required],

    contactInformation: this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      twitter: [''],
      instagram: ['']
    }),

    address: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    })
  });

  constructor(
    private fb: FormBuilder,
    private ownerService: OwnerService,
    private router: Router
  ) {}

onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const formValue = this.form.value;

  const request = {
    ...formValue,
    images: (formValue.images || '')
      .split(',')
      .map((url: string) => url.trim())
  };

  this.ownerService.createRestaurant(request).subscribe({
    next: () => {
      alert('✅ Restaurant Added!');
      this.router.navigate(['/owner/my-restaurant']);
    },
    error: (err) => {
      console.error('❌ Error adding restaurant:', err);

      if (err.status === 409) {
        alert('⚠️ You can only add one restaurant as an owner.');
      } else {
        alert(`Error ${err.status}: ${err.error?.message || 'Failed to add restaurant.'}`);
      }
    }
  });
}


}
