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

  selectItem(index: number) {
    this.navigationService.setSelectedItem(index);
  }
}
