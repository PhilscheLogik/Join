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

  constructor(private contactsService: ContactsService) {}

  contactService = inject(ContactsService);

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

  openOverlayEditContactMobile(action: string) {
    if (action === 'edit' && this.contactService.selectedContact) {
      this.isOverlayVisible = true;
    }
  }

  closeOverlayOnClick(event: any) {
    if (event.target.classList.contains('overlay')) {
      this.closeOverlay();
    }
  }

  closeOverlay() {
    this.isOverlayVisible = false;
  }

  openOverlay(text: string) {
    /*NEW for EDIT Fct*/
    let dummy = {
      name: '',
      email: '',
      phone: '',
    };

    if (this.contactService.selectedContact && text == 'edit') {
      dummy = this.contactService.selectedContact;
      this.contactService.isEdit = true;
    } else {
      this.contactService.isEdit = false;
    }

    this.contactsService.openOverlay(dummy);
  }

  // Funktion zum Setzen des ausgewählten Kontakts
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

  mobileDisplay() {
    this.isShown = !this.isShown;
  }

  getList() {
    return this.contactService.selectedContact?.id;
  }

  /**
   * Findet den Index eines Kontakts in der vollständigen Kontaktliste.
   *
   * Diese Methode wird verwendet, um die Position eines Kontakts in der gesamten `contactService.contactList` zu bestimmen. Dies ist nötig, da die
   * Farbzuweisung für das `profile_badge` anhand der Reihenfolge in der vollständigen Liste erfolgt, während die Anzeige der Initialen aus der gruppierten
   * Liste (`group.value`) kommt.
   *
   * @param contact - Das Kontakt-Objekt, dessen Index in der Hauptliste gesucht wird.
   * @returns Der Index des Kontakts in `contactService.contactList` oder `-1`, falls nicht gefunden.
   */
  getIndexInFullList(contact: any): number {
    return this.contactService.contactList.findIndex(
      (c) => c.email === contact.email
    );
  }

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
          console.error('Fehler beim Löschen des Kontakts:', err);
        });
    }
  }

  updateContact() {
    if (
      this.contactService.selectedContact &&
      this.contactService.selectedContact.id
    ) {
      console.log('contact update');
      console.log(this.name, this.email, this.phone);
      this.contactService
        .updateContact(
          this.contactService.selectedContact.id,
          this.name,
          this.email,
          this.phone
        )
        .then(() => {
          this.contactService.selectedContact = null;
          this.isContactSelected = false;
        })
        .catch((err) => {
          console.error('Fehler beim updaten des Kontakts:', err);
        });
    }
  }
}
