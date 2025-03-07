import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../shared/navi/navigation.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  /** Inject Services */
  navigationService = inject(NavigationService);
  authService = inject(AuthService);
  /** UI States */
  isPageLoaded: boolean = false;
  isLogoShifted: boolean = false;

  /**
   * Lifecycle hook that is called after component initialization.
   *
   * This method triggers a delayed animation effect:
   * - First, it sets `isPageLoaded` to `true` after 200ms, making the page visible.
   * - Then, it shifts the logo after an additional 400ms (total 600ms).
   *
   * @returns {void} This method does not return anything.
   */
  ngOnInit(): void {
    setTimeout(() => {
      this.isPageLoaded = true;
    }, 200);

    setTimeout(() => {
      this.isLogoShifted = true;
    }, 600);
  }

  passwordVisible: boolean = false;
  passwordFieldActive: boolean = false;
  lockIconVisable: boolean = true;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleLockIcon() {
    this.lockIconVisable = !this.lockIconVisable;
  }

  onFocus() {
    this.passwordFieldActive = !this.passwordFieldActive; // Aktiviert das Passwortfeld
  }

  /**
   * Selects an item by its index.
   *
   * This method sets the selected item in the navigation service based on the provided index. It updates the currently
   * selected item to the one corresponding to the given index.
   *
   * @param {number} index - The index of the item to be selected.
   * @returns {void} This method does not return anything.
   */
  selectItem(index: number) {
    this.navigationService.setSelectedItem(index);
  }

  getTestCreate() {
    this.authService.createUser();
  }

  getTestLogin() {
    this.authService.loginUser();
  }
}
