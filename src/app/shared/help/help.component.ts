import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../navi/navigation.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss',
})
export class HelpComponent {
  navigationService = inject(NavigationService);

  /**
   * Sets the selected menu item in the NavigationService.
   * @param {number} index - The index of the menu item to be selected.
   */
  selectItem(index: number): void {
    this.navigationService.setSelectedItem(index);
  }
}
