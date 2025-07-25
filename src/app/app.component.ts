import { Component, HostListener, OnInit, signal } from '@angular/core';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { MainComponent } from './main/main.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LeftSidebarComponent, MainComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // ✅ corrected: 'styleUrls' not 'styleUrl'
})
export class AppComponent implements OnInit {
  // ✅ Create signals
  isLeftSidebarCollapsed = signal(false);
  screenWidth = signal(window.innerWidth);

  // ✅ Automatically update screen width & collapse state
  @HostListener('window:resize')
  onResize(): void {
    const width = window.innerWidth;
    this.screenWidth.set(width);
    if (width < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(window.innerWidth < 768);
  }

  // ✅ Triggered by sidebar toggle output
  changeIsLeftSidebarCollapsed(newState: boolean): void {
    this.isLeftSidebarCollapsed.set(newState);
  }
}
