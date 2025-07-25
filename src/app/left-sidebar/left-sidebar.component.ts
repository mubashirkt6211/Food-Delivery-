import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  @Input() isLeftSidebarCollapsed!: boolean;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();

  items: any[] = [];

  isOwner = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isOwner = this.authService.isOwner();
    this.setupMenuItems();
  }

  setupMenuItems() {
    if (this.isOwner) {
      this.items = [
        { routeLink: '/owner/dashboard', icon: 'fas fa-user-tie', label: 'Dashboard' },
        { routeLink: '/owner/add', icon: 'fas fa-utensils', label: 'Add Restaurant' },
        { routeLink: '/owner/my-restaurant', icon: 'fas fa-store', label: 'My Restaurant' },
        { routeLink: '/owner/my-dishes', icon: 'fas fa-bowl-rice', label: 'My Dishes' },
        { routeLink: '/owner/admin-orders', icon: 'fas fa-truck', label: 'Orders' }

      ];
    } else {
      this.items = [
        { routeLink: '/user/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
        { routeLink: '/user/foods', icon: 'fas fa-pizza-slice', label: 'Foods' },
        { routeLink: '/user/restaurant', icon: 'fas fa-store', label: 'Restaurants' },
        { routeLink: '/user/favorites', icon: 'fas fa-heart', label: 'Favorite' },
        { routeLink: '/user/settings', icon: 'fas fa-cog', label: 'Settings' },
        { routeLink: '/user/gift', icon: 'fas fa-gift', label: 'Gift' },
        { routeLink: '/user/orders', icon: 'fas fa-truck', label: 'Orders' }

      ];
    }
  }

  toggle(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed);
  }
}
