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
  constructor(private contactsService: ContactsService) {}

  openOverlay() {
    console.log('openOverlay() aufgerufen');
    this.contactsService.openOverlay();
  }

  contactService = inject(ContactsService);

  name = '';
  email = '';
  phone = '';

  selectedContact: Contact | null = null;
  selectedContactInitials: string | null = null;
  isContactSelected: boolean = false;

  // Funktion zum Setzen des ausgewählten Kontakts
  selectContact(contact: Contact) {
    this.selectedContact = contact;
    this.selectedContactInitials = this.contactService.getInitials(
      contact.name
    );
    this.isContactSelected = true;
  }

  getList() {
    return this.selectedContact?.id;
  }

  //Farben aus colors.scss
  colors = [
    '#FF7A00', // Sunset Orange
    '#930FFF', // Electric Purple
    '#6E52FF', // Lavender Blue
    '#FC71FF', // Fuchsia Pink
    '#FFBB2B', // Golden Yellow
    '#1FD7C1', // Mint Green
    '#0038FF', // Deep Blue
    '#FF4646', // Light Red
    '#00BEE8', // Aqua Blue
    '#FF5EB3', // Soft Pink
    '#FF745E', // Peach
    '#FFA35E', // Warm Yellow
    '#FFC701', // Bright Yellow
    '#C3FF2B', // Light Green
    '#FFE62B', // Bright Yellow 2
  ];

  // Funktion, um die richtige Farbe basierend auf dem Index zuzuweisen
  getBadgeColor(index: number): string {
    return this.colors[index % this.colors.length];
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

  // // Kontakte nach Anfangsbuchstaben gruppieren
  // getGroupedContacts() {
  //   // Ein leeres Objekt für die Gruppierung erstellen
  //   let groupedContacts: { [key: string]: any[] } = {};

  //   // Durch alle Kontakte iterieren
  //   for (let contact of this.contactService.contactList) {
  //     // Den ersten Buchstaben des Namens in Großbuchstaben holen
  //     let firstLetter = contact.name.charAt(0).toUpperCase();

  //     // Falls es noch keine Gruppe für diesen Buchstaben gibt, erstelle eine
  //     if (!groupedContacts[firstLetter]) {
  //       groupedContacts[firstLetter] = [];
  //     }

  //     // Initialen holen
  //     let initials = this.getInitials(contact.name);

  //     // Kontakt zur Gruppe hinzufügen
  //     groupedContacts[firstLetter].push({
  //       id: contact.id,
  //       name: contact.name,
  //       email: contact.email,
  //       phone: contact.phone,
  //       type: contact.type,
  //       firstLetter: firstLetter,
  //       initials: initials,
  //     });
  //   }

  //   return groupedContacts;
  // }

  // // Funktion zur Berechnung der Initialen
  // getInitials(name: string): string {
  //   if (!name.trim()) return ''; // Falls der Name leer ist, gib einen leeren String zurück

  //   let nameParts = name.trim().split(/\s+/); // Trenne anhand von Leerzeichen

  //   let firstInitial = nameParts[0].charAt(0).toUpperCase(); // Erster Buchstabe des Vornamens
  //   let lastInitial =
  //     nameParts.length > 1
  //       ? nameParts[nameParts.length - 1].charAt(0).toUpperCase()
  //       : ''; // Erster Buchstabe des Nachnamens

  //   return firstInitial + lastInitial;
  // }

  // addContactList() {
  //   let newContact: Contact = {
  //     name: this.name,
  //     email: this.email,
  //     phone: this.phone,
  //   };

  //   this.contactService.addContact(newContact);
  // }

  deleteContact() {
    if (this.selectedContact && this.selectedContact.id) {
      this.contactService
        .deleteContact(this.selectedContact.id)
        .then(() => {
          // Optional: Leere den ausgewählten Kontakt nach der Löschung
          this.selectedContact = null;
          this.isContactSelected = false;
        })
        .catch((err) => {
          console.error('Fehler beim Löschen des Kontakts:', err);
        });
    }
  }

  updateContact() {
    if (this.selectedContact && this.selectedContact.id) {
      console.log(        
        this.name,
        this.email,
        this.phone
      );
      this.contactService
        .updateContact(this.selectedContact.id,this.name, this.email, this.phone)
        .then(() => {
          // Optional: Leere den ausgewählten Kontakt nach der Löschung
          this.selectedContact = null;
          this.isContactSelected = false;
        })
        .catch((err) => {
          console.error('Fehler beim Löschen des Kontakts:', err);
        });
    }
  }
}
