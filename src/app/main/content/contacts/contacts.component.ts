import { Component, inject } from '@angular/core';
import { Contact } from '../../../interfaces/contact';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  contactService = inject(ContactsService);

  // contactList: Contact[]= this.contactService.contactList;

  constructor() {
    console.log(this.contactService);
    console.log(this.contactService.contactList);
    console.log(this.contactService.contactList[0]);
    console.log(this.contactList);
  }

  name = '';
  email = '';
  phone = '';

  getList(): Contact[] {
    console.log('getList: ', this.contactService.contactList);
    return this.contactService.contactList;
  }

  getList2(): any {
    console.log(this.contactService.contactList[0].name);
    return this.contactService.contactList[0].name;
  }

  contactList: Contact[] = this.getList();

  // contactList: Contact[] = [
  //   {
  //     name: 'Anton Mayer',
  //     email: 'antonm@gmail.com',
  //     type: 'contact',
  //   },
  //   {
  //     name: 'Anja Schulz',
  //     email: 'schulz@hotmail.com',
  //     type: 'contact',
  //   },
  //   {
  //     name: 'Benedikt Ziegler',
  //     email: 'benedikt@gmail.com',
  //     type: 'contact',
  //   },
  //   {
  //     name: 'David Eisenberg',
  //     email: 'davidberg@gmail.com',
  //     type: 'contact',
  //   },
  //   {
  //     name: 'Eva Fischer',
  //     email: 'eva@gmail.com',
  //     type: 'contact',
  //   },
  //   {
  //     name: 'Emmanuel Mauer',
  //     email: 'emmanuelma@gmail.com',
  //     type: 'contact',
  //   },
  // ];

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

  // Kontakte nach Anfangsbuchstaben gruppieren
  getGroupedContacts() {
    // Ein leeres Objekt für die Gruppierung erstellen
    let groupedContacts: { [key: string]: any[] } = {};

    // Durch alle Kontakte iterieren
    for (let contact of this.contactList) {
      // Den ersten Buchstaben des Namens in Großbuchstaben holen
      let firstLetter = contact.name.charAt(0).toUpperCase();

      // Falls es noch keine Gruppe für diesen Buchstaben gibt, erstelle eine
      if (!groupedContacts[firstLetter]) {
        groupedContacts[firstLetter] = [];
      }

      // Initialen berechnen
      let initials = this.getInitials(contact.name);

      // Kontakt zur Gruppe hinzufügen
      groupedContacts[firstLetter].push({
        name: contact.name,
        email: contact.email,
        type: contact.type,
        firstLetter: firstLetter, // Speichert den Anfangsbuchstaben
        initials: initials, // Speichert die Initialen
      });
    }

    return groupedContacts;
  }

  // Funktion zur Berechnung der Initialen
  getInitials(name: string): string {
    if (!name.trim()) return ''; // Falls der Name leer ist, gib einen leeren String zurück

    let nameParts = name.trim().split(/\s+/); // Trenne anhand von Leerzeichen

    let firstInitial = nameParts[0].charAt(0).toUpperCase(); // Erster Buchstabe des Vornamens
    let lastInitial =
      nameParts.length > 1
        ? nameParts[nameParts.length - 1].charAt(0).toUpperCase()
        : ''; // Erster Buchstabe des Nachnamens

    return firstInitial + lastInitial;
  }

  addContactList() {
    let newContact: Contact = {
      name: this.name,
      email: this.email,
      phone: this.phone,
    };

    this.contactService.addContact(newContact);
  }
}
