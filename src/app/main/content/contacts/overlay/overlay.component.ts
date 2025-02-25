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
  bgColor = '';
  initials = '';

  constructor(private contactsService: ContactsService) {
    this.contactsService.overlayState$.subscribe((state) => {
      // console.log('Overlay-Status geändert:', state);
      this.isOpen = state;
      if (state) {
        this.isClosing = false;
      }

      // console.log('overlay ts');
      // console.log(this.contactService.isEdit);
      // console.log(
      //   this.contactService.selectedContact?.id && this.contactService.isEdit
      // );

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

  /**
   * Submits the form for creating or updating a contact.
   *
   * @param {NgForm} form - The form containing contact data.
   * @param {'create' | 'update'} action - The action to perform.
   * @param {string} [contactId] - The ID of the contact to update (optional).
   */
  submitForm(form: NgForm, action: 'create' | 'update', contactId?: string) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    if (action === 'create') {
      this.addContactList();
    } else if (action === 'update' && contactId) {
      this.updateItem(contactId);
    }

    this.closeOverlay();
  }

  /**
   * Closes the overlay and resets form data.
   */
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

  /**
   * Adds a new contact to the contact list.
   */
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
      bgColor: this.bgColor.trim(),
      initials: this.initials.trim(),
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

  /**
   * Deletes a contact by its ID.
   *
   * @param {string | undefined} id - The ID of the contact to delete.
   */
  deleteItem(id: string | undefined) {
    if (id) {
      this.contactService.deleteContact(id);
      this.name = '';
      this.email = '';
      this.phone = '';
      this.contactService.selectedContact = null;
    }
    // console.log(this.name, this.email, this.phone)
  }

  /**
   * Updates a contact's information.
   *
   * @param {string | undefined} id - The ID of the contact to update.
   */
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
      let newBgColor =
        this.bgColor == ''
          ? this.contactService.selectedContact?.bgColor
          : this.bgColor;
      let newInitials =
        this.initials == ''
          ? this.contactService.selectedContact?.initials
          : this.initials;

      this.contactService.updateContact(id, newName, newEmail, newPhone, newBgColor, newInitials);

      if (newName && newEmail && newPhone && newBgColor && newInitials ) {
        this.contactService.selectedContact = {
          id: id,
          name: newName,
          email: newEmail,
          phone: newPhone,
          bgColor: newBgColor,
          initials: newInitials
        };
      }
    }
  }

  /**
   * Retrieves the index of a contact in the full contact list.
   *
   * @param {any} contact - The contact object to find.
   * @returns {number} The index of the contact, or 404 if not found.
   */
  getIndexInFullList(contact: any): number {
    if (contact) {
      return this.contactService.contactList.findIndex(
        (c) => c.email === contact.email
      );
    }

    return 404;
  }
}
