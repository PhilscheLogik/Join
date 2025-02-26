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

  /**
   * Initializes the component and subscribes to the overlay state from the `ContactsService`.
   *
   * This constructor subscribes to the `overlayState$` observable from the `ContactsService` to manage the state of the overlay.
   * When the overlay state changes, it updates the `isOpen` and `isClosing` flags accordingly. If the overlay is open and a
   * contact is selected for editing, it populates the form fields (name, email, and phone) with the selected contact's data.
   * If no contact is selected or the form is not in edit mode, it resets the fields to empty values.
   *
   * @param {ContactsService} contactsService - The service responsible for managing contacts and overlay state.
   * @returns {void} This constructor does not return anything.
   */
  constructor(private contactsService: ContactsService) {
    this.contactsService.overlayState$.subscribe((state) => {
      this.isOpen = state;
      if (state) {
        this.isClosing = false;
      }

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
   * Submits the form for either creating or updating a contact.
   *
   * This method validates the form. If the form is invalid, it marks all fields as touched and stops further execution.
   * If the action is 'create', it calls the `addContactList` method to add a new contact. If the action is 'update' and
   * a valid `contactId` is provided, it calls the `updateItem` method to update the contact with the given ID.
   * After the action is completed, it closes the overlay.
   *
   * @param {NgForm} form - The form to be submitted.
   * @param {'create' | 'update'} action - The action to be performed ('create' or 'update').
   * @param {string} [contactId] - The ID of the contact to be updated. This is required if the action is 'update'.
   * @returns {void} This method does not return anything.
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
   * Closes the overlay and resets the form fields.
   *
   * This method initiates the process of closing the overlay by setting the `isClosing` flag to `true`. It waits for 500 milliseconds
   * before setting the `isOpen` flag to `false`, resetting the `isClosing` flag, and notifying the contact service to close the overlay.
   * If the contact form is available, it is reset to clear any entered data. Additionally, the `name`, `email`, and `phone` fields
   * are cleared to their default empty values.
   *
   * @returns {void} This method does not return anything.
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
   * Adds a new contact to the contact list after validating the input fields.
   *
   * This method checks if the required fields (name, email, and phone) are provided. If any of them are missing, it sets the
   * respective validation flag (`isValidName`, `isValidEmail`, or `isValidPhone`) to `true` and returns early. If all fields
   * are provided, it generates a background color and initials for the new contact, creates a new contact object, and adds it
   * to the contact list using the `addContact` method of the contact service. Afterward, it resets the form and clears the input fields.
   *
   * @returns {void} This method does not return anything.
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

    this.bgColor = this.contactService.getBadgeColor(
      Math.floor(Math.random() * 15)
    );

    this.initials = this.contactService.getInitials(this.name);

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
   * Deletes a contact based on the provided ID.
   *
   * This method deletes the contact with the given ID using the `deleteContact` method from the contact service. After the
   * contact is deleted, it resets the name, email, and phone properties to empty strings and clears the selected contact
   * by setting it to `null`.
   *
   * @param {string | undefined} id - The ID of the contact to be deleted. If the ID is not provided, no deletion occurs.
   * @returns {void} This method does not return anything.
   */
  deleteItem(id: string | undefined) {
    if (id) {
      this.contactService.deleteContact(id);
      this.name = '';
      this.email = '';
      this.phone = '';
      this.contactService.selectedContact = null;
    }
  }

  /**
   * Updates a contact's details based on the provided ID.
   *
   * This method checks if an ID is provided and updates the contact's details (name, email, phone, background color, and initials)
   * using either the provided values or the existing ones from the selected contact. If any of the provided details are empty,
   * it falls back to the selected contact's existing data. After updating, it also updates the selected contact's information.
   *
   * @param {string | undefined} id - The ID of the contact to be updated. If the ID is not provided, no update occurs.
   * @returns {void} This method does not return anything.
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
      let newInitials = this.contactService.getInitials(newName);

      this.contactService.updateContact(
        id,
        newName,
        newEmail,
        newPhone,
        newBgColor,
        newInitials
      );

      if (newName && newEmail && newPhone && newBgColor && newInitials) {
        this.contactService.selectedContact = {
          id: id,
          name: newName,
          email: newEmail,
          phone: newPhone,
          bgColor: newBgColor,
          initials: newInitials,
        };
      }
    }
  }

  /**
   * Finds the index of a contact in the full contact list by its email.
   *
   * This method searches for the given contact in the full contact list using the contact's email to find the corresponding
   * index. If the contact is found, it returns the index; otherwise, it returns 404 to indicate that the contact is not found.
   *
   * @param {any} contact - The contact object to be searched in the list.
   * @returns {number} The index of the contact in the full contact list, or 404 if the contact is not found.
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
