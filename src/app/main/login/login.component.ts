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
  navigationService = inject(NavigationService);
  authService = inject(AuthService);
  isPageLoaded: boolean = false;
  isLogoShifted: boolean = false;

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

  ngOnInit() {
  
    setTimeout(() => {
      this.isPageLoaded = true;
    }, 200);

    setTimeout(() => {
      this.isLogoShifted = true;
    }, 600);
  }
}
