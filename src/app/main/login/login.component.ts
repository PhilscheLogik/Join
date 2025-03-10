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
  email: string = '';
  password: string = '';
  isEmailValid: boolean = true;
  isPasswordValid: boolean = true;

  focusedInput: string = '';
  loginAttempted: boolean = false;
  eMailPattern = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
  pwPattern = /(?=.*[A-Z])(?=.*\d)(?=.*[^\w]).{6,20}/;

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
   * This method is called when an input field receives focus.
   * It sets the focused input field name and toggles the visibility of the password field.
   *
   * @param {string} inputName - The name of the input field that is being focused.
   * It updates the `focusedInput` variable with the given `inputName`,
   * and toggles the `passwordFieldActive` boolean to manage the visual state of the password field.
   *
   * @returns {void} - This method doesn't return any value.
   */
  onFocus(inputName: string) {
    this.focusedInput = inputName;
    this.passwordFieldActive = inputName === 'password';
  }

  /**
   * This method is called when an input field loses focus.
   * It clears the `focusedInput` variable to indicate that no input field is currently focused.
   *
   * @returns {void} - This method doesn't return any value.
   */
  onBlur() {
    this.focusedInput = '';
  }

  /**
   * This method is triggered when the login button is clicked.
   * It checks whether the email and password fields are valid (i.e., not empty).
   * The validity is stored in `isEmailValid` and `isPasswordValid` variables.
   *
   * The method assigns `true` to `isEmailValid` if `email` is not empty, otherwise `false`.
   * Similarly, it assigns `true` to `isPasswordValid` if `password` is not empty, otherwise `false`.
   *
   * @returns {void} - This method doesn't return any value.
   */
  onLoginClick() {
    this.loginAttempted = true;
    this.isEmailValid = !!this.email;
    this.isPasswordValid = !!this.password;

    this.validateInput();
  }

  /**
   * This method toggles the visibility of the password input field.
   * When called, it switches the value of `passwordVisible` and `isVisibility` properties.
   *
   * - If `passwordVisible` is `false`, it will be set to `true` to display the password.
   * - If `passwordVisible` is `true`, it will be set to `false` to hide the password.
   *
   * Similarly, `isVisibility` is toggled to control additional visual elements related to password visibility.
   *
   * @returns {void} - This method doesn't return any value.
   */
  toggleVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.isVisibility = !this.isVisibility;
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

  /**
   * Handles navigation from the sign-up view to the login view.
   * Hides the sign-up form and displays the login form.
   */
  linkSignUp() {
    this.navigationService.isSignUpVisible = false;
    this.navigationService.isLoginVisible = true;
  }

  linkContent() {
    this.navigationService.isContentVisible = false;
    this.navigationService.isLoginVisible = true;
  }

  validateInput() {
    if (
      this.eMailPattern.test(this.email) &&
      this.pwPattern.test(this.password)
    ) {
      this.authService.login(this.email, this.password);
      this.checkSummaryAnimation();
      this.linkContent();      
    }
  }

  checkSummaryAnimation() {
    setTimeout(() => {}, 10000);
    this.navigationService.isAnimationSummarydone = true;
  }
}
