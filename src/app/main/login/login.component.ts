import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../shared/navi/navigation.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  passwordVisible: boolean = false;
  passwordFieldActive: boolean = false;
  isVisibility: boolean = true;

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

  /**
   * Toggles the visibility of the password input field.
   *
   * This method switches between showing and hiding the password by toggling the `passwordVisible`
   * and `isVisibility` properties.
   *
   * @returns {void} This method does not return anything.
   */
  toggleVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.isVisibility = !this.isVisibility;
  }

  /**
   * Toggles the active state of the password input field on focus.
   *
   * This method updates the `passwordFieldActive` property, which can be used for styling or
   * UI changes when the password input field is focused.
   *
   * @returns {void} This method does not return anything.
   */
  onFocus() {
    this.passwordFieldActive = !this.passwordFieldActive;
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
}
