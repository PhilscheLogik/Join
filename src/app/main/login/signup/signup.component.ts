import { Component, inject, ViewChild } from '@angular/core';
import { NavigationService } from '../../../shared/navi/navigation.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  /** Injected Services */
  navigationService = inject(NavigationService);
  authService = inject(AuthService);

  /** Form Reference */
  @ViewChild('signupForm') signupForm!: NgForm;

  /** UI State */
  isSignUpActive: boolean = false; // Activated when all required inputs are filled properly
  showSignUpSuccess: boolean = false;

  /** User Input */
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  acceptedPolicy: boolean = false; // New property for checkbox

  /** Validation States */
  isNameValid: boolean = true;
  isEmailValid: boolean = true;
  isPasswordValid: boolean = true;
  isPasswordEqual: boolean = true;
  isPolicyAccepted: boolean = true; // New validation state for checkbox

  /** Password Visibility States */
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  nameFieldActive: boolean = false;
  passwordFieldActive: boolean = false;
  confirmPasswordFieldActive: boolean = false;
  isVisibility: boolean = true;
  isConfirmVisibility: boolean = true;

  /** Input Focus State */
  focusedInput: string = '';
  signUpAttempted: boolean = false;

  /** Validation Patterns */
  namePattern = /[a-zA-ZäüößÄÜÖ\s]{3,}/;
  eMailPattern = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
  pwPattern = /(?=.*[A-Z])(?=.*\d)(?=.*[^\w]).{6,20}/;

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
    this.nameFieldActive = inputName === 'name';
    this.passwordFieldActive = inputName === 'password';
    this.confirmPasswordFieldActive = inputName === 'confirm-password';
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
   * Checks if all form fields are valid and the privacy policy is accepted
   * @returns {boolean} Returns true if all validation conditions are met, false otherwise
   */
  isFormValid(): boolean {
    return (
      // this.namePattern.test(this.name) &&          // Name matches pattern
      // this.eMailPattern.test(this.email) &&        // Email matches pattern
      // this.pwPattern.test(this.password) &&        // Password matches pattern
      !!this.name &&
      !!this.email &&
      !!this.password &&
      !!this.confirmPassword && // Passwords match
      this.acceptedPolicy // Privacy policy checkbox is checked
    );
  }

  /**
   * Handles the sign-up button click event and validates the form input fields.
   *
   * The function performs the following steps:
   * 1. Marks the sign-up attempt as initiated.
   * 2. Validates the user's name, email, password, and password confirmation using predefined patterns.
   * 3. If all fields are valid:
   *    - Calls `validateInput()` for further validation.
   *    - Displays a toast message indicating successful registration.
   *    - Hides the toast message automatically after 2 seconds.
   *
   * @returns {void} This function does not return any value.
   */
  onSignUpClick(): void {
    this.signUpAttempted = true;

    this.isNameValid = this.namePattern.test(this.name);
    this.isEmailValid = this.eMailPattern.test(this.email);
    this.isPasswordValid = this.pwPattern.test(this.password);
    this.isPasswordEqual = this.password === this.confirmPassword;

    if (
      this.isNameValid &&
      this.isEmailValid &&
      this.isPasswordValid &&
      this.isPasswordEqual
    ) {
      this.validateInput();
      this.showSignUpSuccess = true;

      setTimeout(() => {
        this.showSignUpSuccess = false;
      }, 2000);
    }
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
  toggleConfirmVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
    this.isConfirmVisibility = !this.isConfirmVisibility;
  }

  /**
   * Redirects the user to the login page after signing up.
   * This method updates the navigation state to display the login view.
   *
   * @returns {void} This function does not return any value.
   */
  linkLogin(): void {
    this.navigationService.isSignUpVisible = true;
    this.navigationService.isLoginVisible = false;
  }

  /**
   * Validates user input fields (email, password, and name).
   *
   * - If all fields match their respective patterns, the user is signed up via `authService.signUp()`.
   * - After a successful sign-up, the user is redirected to the login page after a 3-second delay.
   *
   * @returns {void} This function does not return any value.
   */
  validateInput(): void {
    if (
      this.eMailPattern.test(this.email) &&
      this.pwPattern.test(this.password) &&
      this.namePattern.test(this.name)
    ) {
      this.authService.signUp(this.email, this.password, this.name);

      setTimeout(() => {
        this.linkLogin();
      }, 3000);
    }
  }

  /**
   * Updates the navigation state to show the sign-up page and hide other content.
   *
   * @returns {void} This function does not return any value.
   */
  linkContent(): void {
    this.navigationService.isContentVisible = false;
    this.navigationService.isSignUpVisible = true;
  }
}
