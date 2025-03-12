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
  acceptedPolicy: boolean = false;

  /** Validation States */
  isNameValid: boolean = true;
  isEmailValid: boolean = true;
  isPasswordValid: boolean = true;
  isPasswordEqual: boolean = true;

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


  focusInput(inputElement: HTMLInputElement) {
    inputElement.focus();
  }
  
  /**
   * Selects an item by its index.
   * @param {number} index - The index of the item to be selected.
   * @returns {void}
   */
  selectItem(index: number) {
    this.navigationService.setSelectedItem(index);
  }

  /**
   * Sets the focused input field and updates field active states.
   * @param {string} inputName - The name of the input field being focused.
   * @returns {void}
   */
  onFocus(inputName: string) {
    this.focusedInput = inputName;
    this.nameFieldActive = inputName === 'name';
    this.passwordFieldActive = inputName === 'password';
    this.confirmPasswordFieldActive = inputName === 'confirm-password';
    this.signUpAttempted = true; // Trigger validation on focus
    this.validateField(inputName); // Validate immediately on focus
  }

  /**
   * Clears the focused input state when an input loses focus.
   * @returns {void}
   */
  onBlur() {
    this.focusedInput = '';
  }

  /**
   * Validates a specific input field in real-time.
   * @param {string} field - The name of the field to validate ('name', 'email', 'password', 'confirm-password').
   * @returns {void}
   */
  validateField(field: string): void {
    if (field === 'name') {
      this.isNameValid = this.namePattern.test(this.name);
    } else if (field === 'email') {
      this.isEmailValid = this.eMailPattern.test(this.email);
    } else if (field === 'password') {
      this.isPasswordValid = this.pwPattern.test(this.password);
    } else if (field === 'confirm-password') {
      this.isPasswordEqual = this.password === this.confirmPassword && this.pwPattern.test(this.password);
    }
  }

  /**
   * Checks if all form fields are valid and the privacy policy is accepted.
   * @returns {boolean} True if all validation conditions are met, false otherwise.
   */
  isFormValid(): boolean {
    return (
      this.namePattern.test(this.name) &&
      this.eMailPattern.test(this.email) &&
      this.pwPattern.test(this.password) &&
      this.password === this.confirmPassword &&
      this.acceptedPolicy
    );
  }

  /**
   * Handles the sign-up button click event and validates all fields.
   * @returns {void}
   */
  onSignUpClick(): void {
    this.signUpAttempted = true;
    this.validateField('name');
    this.validateField('email');
    this.validateField('password');
    this.validateField('confirm-password');

    if (this.isFormValid()) {
      this.validateInput();
      this.showSignUpSuccess = true;
      setTimeout(() => {
        this.showSignUpSuccess = false;
      }, 2000);
    }
  }

  /**
   * Toggles the visibility of the password input field.
   * @returns {void}
   */
  toggleVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.isVisibility = !this.isVisibility;
  }

  /**
   * Toggles the visibility of the confirm password input field.
   * @returns {void}
   */
  toggleConfirmVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
    this.isConfirmVisibility = !this.isConfirmVisibility;
  }

  /**
   * Redirects the user to the login page.
   * @returns {void}
   */
  linkLogin(): void {
    this.navigationService.isSignUpVisible = true;
    this.navigationService.isLoginVisible = false;
  }

  /**
   * Validates all input fields and signs up the user if valid.
   * @returns {void}
   */
  validateInput(): void {
    if (
      this.eMailPattern.test(this.email) &&
      this.pwPattern.test(this.password) &&
      this.namePattern.test(this.name) &&
      this.password === this.confirmPassword
    ) {
      this.authService.signUp(this.email, this.password, this.name);
      setTimeout(() => {
        this.linkLogin();
      }, 3000);
    }
  }

  /**
   * Updates navigation state to show the sign-up page.
   * @returns {void}
   */
  linkContent(): void {
    this.navigationService.isContentVisible = false;
    this.navigationService.isSignUpVisible = true;
  }
}
