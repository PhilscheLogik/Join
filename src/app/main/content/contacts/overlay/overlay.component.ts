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
  isClosing = false;

  name = '';
  email = '';
  phone = '';

  contactService = inject(ContactsService);

  constructor(private contactsService: ContactsService) {
    this.contactsService.overlayState$.subscribe((state) => {
      console.log('Overlay-Status geändert:', state);
      this.isOpen = state;
      if (state) {
        this.isClosing = false;
      }
    });
  }

  closeOverlay() {
    this.isClosing = true;

    setTimeout(() => {
      this.isOpen = false;
      this.isClosing = false;
      this.contactsService.closeOverlay();
    }, 500);

    this.name = '';
    this.email = '';
    this.phone = '';
  }

  addContactList() {
    if (!this.name || !this.email || !this.phone) {
      console.warn('Alle Felder müssen ausgefüllt sein!');
      return;
    }

    let newContact: Contact = {
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
    };

    this.contactService.addContact(newContact);

    this.name = '';
    this.email = '';
    this.phone = '';
  }

  deleteItem(id: string) {
    this.contactService.deleteContact(id);
    this.name = '';
    this.email = '';
    this.phone = '';
  }


  updateItem(id: string) {
    this.contactService.updateContact(id, this.name, this.email, this.phone );
    this.name = '';
    this.email = '';
    this.phone = '';
  }
}
