import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationService } from '../navi/navigation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  navigationService = inject(NavigationService);  

  selectItem(index: number) {
    this.navigationService.setSelectedItem(index);
  }

}
