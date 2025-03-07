import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../navi/navigation.service';
import { AuthService } from '../../main/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  navigationService = inject(NavigationService);
  authService = inject(AuthService);

  selectItem(index: number) {
    this.navigationService.setSelectedItem(index);
  }

  // isOverlayVisible: boolean = false;
  overlayState = true;
  isOpen = false;
  isClosing = false;

  toggleOverlay() {
    this.isOpen = !this.isOpen;
    this.overlayState = !this.overlayState;
  }

  closeOverlay() {
    this.isOpen = false;
  }
}
