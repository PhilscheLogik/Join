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
  isValidName = false;
  isValidEmail = false;
  isValidPhone = false;

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

      console.log('overlay ts');
      console.log(this.contactService.isEdit);
      console.log(
        this.contactService.selectedContact?.id && this.contactService.isEdit
      );
      if (
        this.contactService.selectedContact?.id &&
        this.contactService.isEdit
      ) {
        this.name = this.contactService.selectedContact.name;
        this.email = this.contactService.selectedContact.email;
        this.phone = this.contactService.selectedContact.phone;
      } else {
        this.name = '';
        this.email = '';
        this.phone = '';

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

  // closeOverlayEdit() {
  //   this.isClosing = true;

  //   setTimeout(() => {
  //     this.isOpen = false;
  //     this.isClosing = false;
  //     this.contactsService.closeOverlay();
  //   }, 500);
  // }

  addContactList() {
    if (!this.name) {
      this.isValidName = true;
      return;
    }
    if (!this.email) {
      this.isValidEmail = true;
      return;
    }
    if (!this.phone) {
      this.isValidPhone = true;
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
    this.isValidName = false;
    this.isValidEmail = false;
    this.isValidPhone = false;
  }

  deleteItem(id: string | undefined) {
    if (id) {
      this.contactService.deleteContact(id);
      this.name = '';
      this.email = '';
      this.phone = '';
      this.contactService.selectedContact = null;
          
    }
    console.log(this.name, this.email, this.phone)


  }

  updateItem(id: string | undefined) {
    if (id) {
      let newName =
        this.name == '' ? this.contactService.selectedContact?.name : this.name;
      let newEmail =
        this.email == ''
          ? this.contactService.selectedContact?.email
          : this.email;
      let newPhone =
        this.phone == ''
          ? this.contactService.selectedContact?.phone
          : this.phone;

      this.contactService.updateContact(id, newName, newEmail, newPhone);

      if (newName && newEmail && newPhone) {
        this.contactService.selectedContact = {
          id: id,
          name: newName,
          email: newEmail,
          phone: newPhone,
        };
        console.log(id, newName, newEmail, newPhone);
      }

      // console.log(id, this.name, this.email, this.phone);
      // console.log(
      //   this.contactService.test.id,
      //   this.contactService.test.name,
      //   this.contactService.test.email,
      //   this.contactService.test.phone
      // );

      console.log(id, newName, newEmail, newPhone);
    }
  }

  getIndexInFullList(contact: any): number {
    return this.contactService.contactList.findIndex(
      (c) => c.email === contact.email
    );
  }
}
