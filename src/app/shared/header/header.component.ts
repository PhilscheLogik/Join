import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../navi/navigation.service';
import { AuthService } from '../../main/services/auth.service';
import { ContactsService } from '../../main/services/contacts.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  contactService = inject(ContactsService);
  navigationService = inject(NavigationService);
  authService = inject(AuthService);

  overlayState = true;
  isOpen = false;
  isClosing = false;
  // isOverlayVisible: boolean = false;

  /**
   * Setzt das aktuell ausgewählte Navigations-Item.
   * @param {number} index - Der Index des auszuwählenden Elements.
   */
  selectItem(index: number) {
    this.navigationService.setSelectedItem(index);
  }

  /**
   * Öffnet oder schließt das Overlay.
   */
  toggleOverlay() {
    this.isOpen = !this.isOpen;
    this.overlayState = !this.overlayState;
  }

  /**
   * Schließt das Overlay.
   */
  closeOverlay() {
    this.isOpen = false;
  }

  linkLogin() {
    this.navigationService.isContentVisible = true;
    this.navigationService.isLoginVisible = false;
  }
}
