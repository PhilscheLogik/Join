import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactsService } from '../../../services/contacts.service';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss'
})
export class OverlayComponent {

  isOpen = false;

  constructor(private contactsService: ContactsService) {
    this.contactsService.overlayState$.subscribe(state => {
      console.log('Overlay-Status geändert:', state);
      this.isOpen = state;
    });
  }

  closeOverlay() {
    this.contactsService.closeOverlay();
  }
}
