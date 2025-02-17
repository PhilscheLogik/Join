import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { ContactsService } from '../../../services/contacts.service';
import { Contact } from '../../../../interfaces/contact';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent {
  @ViewChild('contactForm') contactForm!: NgForm;

  isOpen = false;
  isClosing = false;

  name = '';
  email = '';
  phone = '';

  contactService = inject(ContactsService);

  constructor(private contactsService: ContactsService) {
    this.contactsService.overlayState$.subscribe((state) => {
      // console.log('Overlay-Status geändert:', state);
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

    if (this.contactForm) {
      this.contactForm.resetForm();
    }

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

    if (this.contactForm) {
      this.contactForm.resetForm();
    }
    
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

   
    let newName = this.name == '' ? this.contactService.test.name : this.name;
    let newEmail = this.email == '' ? this.contactService.test.email : this.email;
    let newPhone = this.phone == '' ? this.contactService.test.phone : this.phone;



    this.contactService.updateContact(id, newName, newEmail, newPhone );
    // console.log(id, this.name, this.email, this.phone);
    // console.log(
    //   this.contactService.test.id,
    //   this.contactService.test.name,
    //   this.contactService.test.email,
    //   this.contactService.test.phone
    // );
    // console.log(
    //   this.contactService.test.id,
    //   newName,
    //   newEmail,
    //   newPhone
    // );

  }


  getIndexInFullList(contact: any): number {
    return this.contactService.contactList.findIndex(
      (c) => c.email === contact.email
    );
  }
}
