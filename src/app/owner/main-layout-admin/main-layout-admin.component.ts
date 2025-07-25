import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeftSidebarComponent } from '../../left-sidebar/left-sidebar.component';

@Component({
  selector: 'app-main-layout-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, LeftSidebarComponent],
  templateUrl: './main-layout-admin.component.html',
  styleUrls: ['./main-layout-admin.component.css'],
})
export class MainLayoutAdminComponent implements OnInit {
  // Accept inputs from parent
  @Input() isLeftSidebarCollapsed!: boolean;
  @Input() screenWidth!: number;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();

  // Local signals
  localSidebarCollapsed = signal<boolean>(false);
  localScreenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize() {
    const width = window.innerWidth;
    this.localScreenWidth.set(width);
    if (width < 768) {
      this.localSidebarCollapsed.set(true);
      this.changeIsLeftSidebarCollapsed.emit(true);
    }
  }

  ngOnInit(): void {
    // Initialize local signals from @Input values
    this.localSidebarCollapsed.set(this.isLeftSidebarCollapsed);
    this.localScreenWidth.set(this.screenWidth);
  }

  changeIsLeftSidebarCollapsedFromSidebar(value: boolean): void {
    this.localSidebarCollapsed.set(value);
    this.changeIsLeftSidebarCollapsed.emit(value);
  }
}
