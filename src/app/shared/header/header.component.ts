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
/**
 * HeaderComponent manages navigation, authentication, and overlay state.
 * It provides methods to toggle and close the overlay, navigate between sections,
 * and update the selected navigation item.
 */
export class HeaderComponent {
  /** Injected Services */
  contactService = inject(ContactsService);
  navigationService = inject(NavigationService);
  authService = inject(AuthService);

  /** Overlay State */
  overlayState: boolean = true;
  isOpen: boolean = false;
  isClosing: boolean = false;

  /**
   * Sets the currently selected navigation item.
   *
   * @param {number} index - The index of the navigation item to select.
   * @returns {void} This method does not return anything.
   */
  selectItem(index: number): void {
    this.navigationService.setSelectedItem(index);
  }

  /**
   * Toggles the overlay state.
   *
   * - If the overlay is open, it will be closed.
   * - If the overlay is closed, it will be opened.
   *
   * @returns {void} This method does not return anything.
   */
  toggleOverlay(): void {
    this.isOpen = !this.isOpen;
    this.overlayState = !this.overlayState;
  }

  /**
   * Closes the overlay.
   *
   * @returns {void} This method does not return anything.
   */
  closeOverlay(): void {
    this.isOpen = false;
  }

  /**
   * Navigates to the login page by updating visibility states.
   *
   * - Sets `isContentVisible` to `true`, making the main content visible.
   * - Sets `isLoginVisible` to `false`, hiding the login section.
   *
   * @returns {void} This method does not return anything.
   */
  linkLogin(): void {
    this.navigationService.isContentVisible = true;
    this.navigationService.isLoginVisible = false;
  }
}
