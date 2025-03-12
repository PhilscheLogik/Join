import { Component, inject } from '@angular/core';
import { Contact } from '../../../interfaces/contact';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../services/contacts.service';
import { OverlayComponent } from './overlay/overlay.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [FormsModule, CommonModule, OverlayComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  /** UI State */
  isOverlayVisible: boolean = false;
  showSuccessMessage: boolean = false;
  isContactSelected: boolean = false;
  showContactContent: boolean = false;
  isShown: boolean = false;

  /** Selected Contact Data */
  selectedContactInitials: string | null = null;
  initials: string = '';
  bgColor: string = '';

  /** User Input */
  name: string = '';
  email: string = '';
  phone: string = '';

  /** Injected Services */
  contactService = inject(ContactsService);

  constructor(private contactsService: ContactsService) {}

  /**
   * Initializes the component and subscribes to the contact creation notification.
   *
   * This lifecycle hook subscribes to the `contactCreated$` observable from the `contactsService`
   * to listen for updates on whether a contact has been created. When a contact is created,
   * it shows a success message for 2 seconds before hiding it again.
   *
   * @returns {void} This function does not return any value.
   */
  ngOnInit() {
    this.contactsService.contactCreated$.subscribe((status) => {
      this.showSuccessMessage = status;
      if (status) {
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 2000);
      }
    });
  }

  /**
   * Opens the overlay for editing a contact on mobile devices.
   *
   * This function checks if the provided action is 'edit' and if a contact is selected.
   * If both conditions are met, it sets the `isOverlayVisible` flag to `true`, making the overlay visible.
   *
   * @param {string} action - The action to perform, which should be 'edit' to trigger the overlay display.
   * @returns {void} This function does not return any value.
   */
  openOverlayEditContactMobile(action: string) {
    if (action === 'edit' && this.contactService.selectedContact) {
      this.isOverlayVisible = true;
    }
  }

  /**
   * Closes the overlay when a click is detected outside of the content area.
   *
   * This function listens for a click event and checks if the target of the click has the class `overlay`.
   * If the click is on the overlay itself (i.e., outside the content area), it triggers the `closeOverlay` method
   * to close the overlay.
   *
   * @param {any} event - The click event object that triggered the function.
   * @returns {void} This function does not return any value.
   */
  closeOverlayOnClick(event: any) {
    if (event.target.classList.contains('overlay')) {
      this.closeOverlay();
    }
  }

  /**
   * Closes the overlay.
   *
   * This function sets the `isOverlayVisible` flag to `false`, hiding the overlay from the view.
   *
   * @returns {void} This function does not return any value.
   */
  closeOverlay() {
    this.isOverlayVisible = false;
  }

  /**
   * Opens the overlay with contact information for either editing or creating a new contact.
   *
   * This function checks if a contact is selected and whether the action is 'edit'. If both conditions are true,
   * it uses the selected contact's data and sets the `isEdit` flag to `true`. Otherwise, it prepares an empty contact
   * object for creating a new contact and sets the `isEdit` flag to `false`. Then, it calls the `openOverlay` method
   * from the `contactsService` to display the overlay with the relevant contact data.
   *
   * @param {string} text - The action to perform, either 'edit' or any other string for creating a new contact.
   * @returns {void} This function does not return any value.
   */
  openOverlay(text: string) {
    let dummy = { name: '', email: '', phone: '', bgColor: '', initials: '' };

    if (this.contactService.selectedContact && text == 'edit') {
      dummy = this.contactService.selectedContact;
      this.contactService.isEdit = true;
    } else {
      this.contactService.isEdit = false;
    }

    this.contactsService.openOverlay(dummy);
  }

  /**
   * Selects or deselects a contact and updates the view accordingly.
   *
   * This function checks if the provided contact is already selected. If the contact is selected, it deselects it by
   * setting various flags and properties to their default values. If the contact is not selected, it selects the contact,
   * updates the relevant flags and properties, and calculates the contact's initials.
   *
   * @param {Contact} contact - The contact to be selected or deselected.
   * @returns {void} This function does not return any value.
   */
  selectContact(contact: Contact) {
    if (
      this.contactService.selectedContact &&
      this.contactService.selectedContact.id === contact.id
    ) {
      this.contactService.selectedContact = null;
      this.selectedContactInitials = null;
      this.isContactSelected = false;
      this.showContactContent = false;
      this.contactService.isSelected = false;
    } else {
      this.contactService.selectedContact = contact;
      this.selectedContactInitials = this.contactService.getInitials(
        contact.name
      );
      this.isContactSelected = true;
      this.showContactContent = true;
      this.contactService.isSelected = true;
    }
  }

  /**
   * Toggles the display state for mobile view.
   *
   * This function toggles the value of the `isShown` flag, which controls whether the mobile display is shown or hidden.
   * If the display is currently shown, it will be hidden, and vice versa.
   *
   * @returns {void} This function does not return any value.
   */
  mobileDisplay() {
    this.isShown = !this.isShown;
  }

  /**
   * Retrieves the ID of the currently selected contact.
   *
   * This function returns the `id` of the contact that is currently selected. If no contact is selected, it returns `undefined`.
   *
   * @returns {string | undefined} The ID of the selected contact, or `undefined` if no contact is selected.
   */
  getList() {
    return this.contactService.selectedContact?.id;
  }

  /**
   * Finds the index of a contact in the full contact list based on the email.
   *
   * This function searches for the provided contact in the `contactList` by comparing the email of each contact.
   * It returns the index of the first match found, or `-1` if the contact is not found in the list.
   *
   * @param {any} contact - The contact whose index is to be found in the contact list.
   * @returns {number} The index of the contact in the `contactList`, or `-1` if the contact is not found.
   */
  getIndexInFullList(contact: any): number {
    return this.contactService.contactList.findIndex(
      (c) => c.email === contact.email
    );
  }

  /**
   * Deletes the currently selected contact.
   *
   * This function checks if a contact is selected. If a contact is selected, it calls the `deleteContact` method from
   * the `contactService` to delete the contact using its ID. After a successful deletion, it resets the selected contact,
   * hides the contact overlay, and updates the selection state. If an error occurs during the deletion, it logs the error.
   *
   * @returns {void} This function does not return any value.
   */
  deleteContact() {
    if (
      this.contactService.selectedContact &&
      this.contactService.selectedContact.id
    ) {
      this.contactService
        .deleteContact(this.contactService.selectedContact.id)
        .then(() => {
          this.contactService.selectedContact = null;
          this.isContactSelected = false;
          this.closeOverlay();
        })
        .catch((err) => {
          console.error('Error deleting contact:', err);
        });
    }
  }

  /**
   * Updates the currently selected contact with new information.
   *
   * This function checks if a contact is selected. If a contact is selected, it calls the `updateContact` method
   * from the `contactService` to update the contact's details, including name, email, phone, background color, and initials.
   * After a successful update, it resets the selected contact and updates the selection state. If an error occurs during
   * the update, it logs the error.
   *
   * @returns {void} This function does not return any value.
   */
  updateContact() {
    if (
      this.contactService.selectedContact &&
      this.contactService.selectedContact.id
    ) {
      console.log('Updating contact');
      console.log(this.name, this.email, this.phone);
      this.contactService
        .updateContact(
          this.contactService.selectedContact.id,
          this.name,
          this.email,
          this.phone,
          this.bgColor,
          this.initials
        )
        .then(() => {
          this.contactService.selectedContact = null;
          this.isContactSelected = false;
        })
        .catch((err) => {
          console.error('Error updating contact:', err);
        });
    }
  }
}
