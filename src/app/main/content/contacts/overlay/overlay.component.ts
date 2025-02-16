import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ContactsService } from '../../../services/contacts.service';
import { Contact } from '../../../../interfaces/contact';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent {
  isOpen = false;

  constructor(private contactsService: ContactsService) {
    this.contactsService.overlayState$.subscribe((state) => {
      console.log('Overlay-Status geändert:', state);     
      this.isOpen = state;
    });
  }

  name = '';
  email = '';
  phone = '';

  contactService = inject(ContactsService);
  

  closeOverlay() {
    this.contactsService.closeOverlay();
  }

  addContactList() {
    let newContact: Contact = {
      name: this.name,
      email: this.email,
      phone: this.phone,
    };

    this.contactService.addContact(newContact);
  }
}
