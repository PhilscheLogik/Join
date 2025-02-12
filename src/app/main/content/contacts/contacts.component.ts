import { Component } from '@angular/core';
import { Contact } from '../../../interfaces/contact';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  contactList: Contact[] = [
    {
      name: 'Anton Mayer',
      email: 'antonm@gmail.com',
      type: 'contact',
    },
    {
      name: 'Anja Schulz',
      email: 'schulz@hotmail.com',
      type: 'contact',
    },
    {
      name: 'Benedikt Ziegler',
      email: 'benedikt@gmail.com',
      type: 'contact',
    },
    {
      name: 'David Eisenberg',
      email: 'davidberg@gmail.com',
      type: 'contact',
    },
    {
      name: 'Eva Fischer',
      email: 'eva@gmail.com',
      type: 'contact',
    },
    {
      name: 'Emmanuel Mauer',
      email: 'emmanuelma@gmail.com',
      type: 'contact',
    },
  ];

  // Farben aus colors.scss
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
    return this.contactList.reduce((groupedContacts, contact) => {
      // Den ersten Buchstaben des Namens extrahieren und in Großbuchstaben umwandeln
      const firstLetter = contact.name.charAt(0).toUpperCase();

      // Prüfen, ob es bereits eine Gruppe für diesen Buchstaben gibt, falls nicht, eine neue erstellen
      if (!groupedContacts[firstLetter]) {
        groupedContacts[firstLetter] = [];
      }

      // Kontakt zur entsprechenden Gruppe hinzufügen, dabei auch firstLetter und initials speichern
      groupedContacts[firstLetter].push({
        ...contact, // Originaldaten des Kontakts übernehmen
        firstLetter: firstLetter, // Den Anfangsbuchstaben speichern
        initials: this.getInitials(contact.name), // Die Initialen berechnen und speichern
      });

      // Das akkumulierte Objekt zurückgeben
      return groupedContacts;
      /**
       * Gruppiert die Kontakte nach ihrem Anfangsbuchstaben und erweitert sie um zusätzliche Eigenschaften.
       *
       * @returns {Record<string, (Contact & { firstLetter: string; initials: string })[]>}
       *          Ein Objekt, bei dem die Schlüssel die Anfangsbuchstaben der Namen sind
       *          und die Werte Arrays von Kontakten mit den Eigenschaften `firstLetter` und `initials`.
       *
       * - `Record<string, ...>`: Erstellt ein Objekt mit `string`-Schlüsseln (Anfangsbuchstaben).
       * - `Contact & { firstLetter: string; initials: string }`: Fügt jedem Kontakt die Eigenschaften `firstLetter` und `initials` hinzu.
       * - `[]`: Jeder Schlüssel enthält eine Liste der zugehörigen Kontakte.
       * - `{}` als Initialwert: Startet mit einem leeren Objekt.
       */
    }, {} as Record<string, (Contact & { firstLetter: string; initials: string })[]>);
  }

  // Funktion, um Initialen zu extrahieren
  getInitials(name: string): string {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0).toUpperCase()}${nameParts[1]
        .charAt(0)
        .toUpperCase()}`;
    }
    return nameParts[0].charAt(0).toUpperCase();
  }
}
