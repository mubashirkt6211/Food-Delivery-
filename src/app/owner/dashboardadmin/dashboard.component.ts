import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponentAdmin implements AfterViewInit, OnInit {
  ownerName: string = 'Restaurant Owner';
  dropdownOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser?.(); // use optional chaining to avoid crash
    this.ownerName = user?.name || 'Restaurant Owner';
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.dropdownOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngAfterViewInit(): void {
    new Chart('revenueChart', {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue',
            data: [40000, 55000, 42000, 48000, 60000, 50000],
            backgroundColor: '#f97316',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
      },
    });

    new Chart('performanceChart', {
      type: 'doughnut',
      data: {
        labels: ['View Count', 'Percentage'],
        datasets: [
          {
            data: [65, 35],
            backgroundColor: ['#3b82f6', '#10b981'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
      },
    });
  }
}
