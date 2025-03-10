import { Component ,inject } from '@angular/core';
import { NavigationService } from '../../../shared/navi/navigation.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  navigationService = inject(NavigationService);
  authService = inject(AuthService)

  isSignUpActive = false; // activate if all required inputs are filled properly


  passwordVisible: boolean = false;
  passwordFieldActive: boolean = false;
  isVisibility: boolean = true;
  email: string = '';
  password: string = '';
  isEmailValid: boolean = true;
  isPasswordValid: boolean = true;
  isPasswordEqual: string = '';

  focusedInput: string = '';
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
    this.passwordFieldActive = !this.passwordFieldActive;
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
    this.isEmailValid = !!this.email;
    this.isPasswordValid = !!this.password;
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
}
