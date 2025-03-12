import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationService } from '../navi/navigation.service';
import { AuthService } from '../../main/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  /** Injected Services */
  navigationService = inject(NavigationService);
  authService = inject(AuthService);

  /**
   * Sets the selected navigation item.
   *
   * @param {number} index - The index of the selected navigation item.
   * @returns {void} This method does not return anything.
   */
  selectItem(index: number): void {
    this.navigationService.setSelectedItem(index);
  }

  /**
   * Handles navigation to the login page by updating visibility states.
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
