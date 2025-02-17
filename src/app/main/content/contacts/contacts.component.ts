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

  constructor(private contactsService: ContactsService) {}

  ngOnInit() {
    this.contactsService.contactCreated$.subscribe((status) => {
      this.showSuccessMessage = status;
    });
  }

  openOverlayEditContactMobile(action: string) {
    // Logik, um das Overlay zu öffnen
    if (action === 'edit' && this.selectedContact) {
      this.isOverlayVisible = true;
    }
  }

  closeOverlay() {
    // Schließe das Overlay
    this.isOverlayVisible = false;
  }

  editContact() {
    if (this.selectedContact) {
      // Logik für das Bearbeiten des Kontakts (öffne Bearbeitungsformular oder führe eine andere Aktion aus)
      console.log('Edit contact', this.selectedContact);
      this.closeOverlay(); // Schließt das Overlay nach dem Bearbeiten
    }
  }

  openOverlay(text: string) {
    // console.log('openOverlay() aufgerufen');

    /*NEW for EDIT Fct*/
    let dummy = {
      name: '',
      email: '',
      phone: '',
    };

    if (this.selectedContact && text == 'edit') {
      dummy = this.selectedContact;
    }

    console.log('-------------------------------------');
    console.info('contact ts');
    console.log(dummy);

    this.contactsService.openOverlay(dummy);
  }

  contactService = inject(ContactsService);

  name = '';
  email = '';
  phone = '';
  isShown = false;

  selectedContact: Contact | null = null;
  selectedContactInitials: string | null = null;
  isContactSelected: boolean = false;
  showContactContent: boolean = false;

  // Funktion zum Setzen des ausgewählten Kontakts
  selectContact(contact: Contact) {
    if (this.selectedContact && this.selectedContact.id === contact.id) {
      this.selectedContact = null;
      this.selectedContactInitials = null;
      this.isContactSelected = false;
      this.showContactContent = false;
    } else {
      this.selectedContact = contact;
      this.selectedContactInitials = this.contactService.getInitials(
        contact.name
      );
      this.isContactSelected = true;
      this.showContactContent = true;
    }
  }

  mobileDisplay() {
    this.isShown = !this.isShown;
  }

  getList() {
    return this.selectedContact?.id;
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
    if (this.selectedContact && this.selectedContact.id) {
      this.contactService
        .deleteContact(this.selectedContact.id)
        .then(() => {
          this.selectedContact = null;
          this.isContactSelected = false;
          this.closeOverlay(); 
        })
        .catch((err) => {
          console.error('Fehler beim Löschen des Kontakts:', err);
        });
    }
  }

  updateContact() {
    if (this.selectedContact && this.selectedContact.id) {
      console.log(this.name, this.email, this.phone);
      this.contactService
        .updateContact(
          this.selectedContact.id,
          this.name,
          this.email,
          this.phone
        )
        .then(() => {
          // Optional: Leere den ausgewählten Kontakt nach der Löschung
          this.selectedContact = null;
          this.isContactSelected = false;
        })
        .catch((err) => {
          console.error('Fehler beim updaten des Kontakts:', err);
        });
    }
  }
}
