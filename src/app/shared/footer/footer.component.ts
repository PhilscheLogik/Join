import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationService } from '../navi/navigation.service';
import { AuthService } from '../../main/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  navigationService = inject(NavigationService);
  authService = inject(AuthService);

  selectItem(index: number) {
    this.navigationService.setSelectedItem(index);
  }
}
