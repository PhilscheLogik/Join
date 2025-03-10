import { Component, inject,  ViewChild } from '@angular/core';
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
  navigationService = inject(NavigationService);
  authService = inject(AuthService);

  @ViewChild('signupForm') signupForm!: NgForm;

  isSignUpActive = false; // activate if all required inputs are filled properly

  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  passwordFieldActive: boolean = false;
  confirmPasswordFieldActive: boolean = false;
  isVisibility: boolean = true;
  isConfirmVisibility: boolean = true;
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  isNameValid: boolean = true;
  isEmailValid: boolean = true;
  isPasswordValid: boolean = true;
  isPasswordEqual: boolean = true;

  focusedInput: string = '';
  signUpAttempted: boolean = false;
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
   * This method is triggered when the login button is clicked.
   * It checks whether the email and password fields are valid (i.e., not empty).
   * The validity is stored in `isEmailValid` and `isPasswordValid` variables.
   *
   * The method assigns `true` to `isEmailValid` if `email` is not empty, otherwise `false`.
   * Similarly, it assigns `true` to `isPasswordValid` if `password` is not empty, otherwise `false`.
   *
   * @returns {void} - This method doesn't return any value.
   */
  onSignUpClick() {
    this.signUpAttempted = true;
    this.isNameValid = !!this.name;
    this.isEmailValid = !!this.email;
    this.isPasswordValid = !!this.password;
    this.isPasswordEqual = !!this.confirmPassword;

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

  linkLogin() {
    this.navigationService.isSignUpVisible = true;
    this.navigationService.isLoginVisible = false;
  }

  validateInput() {
    if (
      this.eMailPattern.test(this.email) &&
      this.pwPattern.test(this.password) && this.namePattern.test(this.name)
    ) {
      this.authService.signUp(this.email, this.password, this.name);
      // this.checkSummaryAnimation();
      this.linkLogin();      
    }
  }

   // Check if passwords match
  //  passwordsMatch(): boolean {
  //   return this.password === this.confirmPassword;
  // }

  // Handle form submission
  // onSignUpClick() {
  //   if (this.signupForm.valid && this.passwordsMatch()) {
  //     this.authService.signUp(this.email, this.password, this.name);
  //   } else {
  //     console.log('Form is invalid or passwords do not match');
  //   }
  // }
}
