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
  isOverlayVisible: boolean = false;
  showSuccessMessage: boolean = false;
  selectedContactInitials: string | null = null;
  isContactSelected: boolean = false;
  showContactContent: boolean = false;
  isShown = false;
  name = '';
  email = '';
  phone = '';
  bgColor = '';
  initials = '';

  constructor(private contactsService: ContactsService) {}

  contactService = inject(ContactsService);

  /**
   * Initializes component and subscribes to contact creation events.
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
   * Opens the overlay for editing a contact in mobile view.
   *
   * @param {string} action - The action to perform ('edit' to edit an existing contact).
   */
  openOverlayEditContactMobile(action: string) {
    if (action === 'edit' && this.contactService.selectedContact) {
      this.isOverlayVisible = true;
    }
  }

  /**
   * Closes the overlay when clicking outside of it.
   *
   * @param {Event} event - The click event.
   */
  closeOverlayOnClick(event: any) {
    if (event.target.classList.contains('overlay')) {
      this.closeOverlay();
    }
  }

  closeOverlay() {
    this.isOverlayVisible = false;
  }

  /**
   * Opens the overlay and preloads contact data if editing.
   *
   * @param {string} text - The action type ('edit' to load existing data).
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
   * Selects or deselects a contact.
   *
   * @param {Contact} contact - The contact to select.
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
   * Toggles mobile display state.
   */
  mobileDisplay() {
    this.isShown = !this.isShown;
  }

  /**
   * Retrieves the ID of the selected contact.
   *
   * @returns {string | undefined} The contact ID if available.
   */
  getList() {
    return this.contactService.selectedContact?.id;
  }

  /**
   * Finds the index of a contact in the full contact list.
   *
   * @param {any} contact - The contact to search for.
   * @returns {number} The index of the contact in the list.
   */
  getIndexInFullList(contact: any): number {
    return this.contactService.contactList.findIndex(
      (c) => c.email === contact.email
    );
  }

  /**
   * Deletes the selected contact from the database.
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
   * Updates the selected contact's information.
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
