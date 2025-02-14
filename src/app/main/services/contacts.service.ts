import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  updateDoc
} from '@angular/fire/firestore';
import { Contact } from '../../interfaces/contact';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private overlayState = new BehaviorSubject<boolean>(false);
  overlayState$ = this.overlayState.asObservable();

  openOverlay() {
    this.overlayState.next(true);
  }

  closeOverlay() {
    this.overlayState.next(false);
  }

  contactList: Contact[] = [];

  unsubContacts;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubContacts = this.subContactList();
    this.overlayState$.subscribe((state) =>
      console.log('Overlay State:', state)
    );
  }

  ngOnDestroy() {
    this.unsubContacts();
  }

  subContactList() {
    return onSnapshot(this.getContactRef(), (contact) => {
      this.contactList = [];

      contact.forEach((e) => {
        this.contactList.push(this.setContactObj(e.data(), e.id));
      });
    });
  }

  async addContact(item: Contact) {
    await addDoc(this.getContactRef(), item).catch((err) => {
      console.error(err);
    });
  }

  async deleteContact(id: string) {
    if (id) {
      await deleteDoc(doc(this.getContactRef(), id));
    }
  }

  async updateContact(
    id: string,
    newName: string,
    newEmail: string,
    newPhone: string
  ) {
    const updateRef = doc(this.getContactRef(), id);

    if (newName != '' && newEmail != '' && newPhone != '') {
      await updateDoc(updateRef, {
        name: newName,
        email: newEmail,
        phone: newPhone,
      });
    }
  }

  getContactRef() {
    return collection(this.firestore, 'contacts');
  }

  setContactObj(obj: any, id: string): Contact {
    return {
      id: id || '',
      type: obj.type || '',
      name: obj.name || '',
      email: obj.email || '',
      phone: obj.phone || '',
    };
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

      // Initialen holen
      let initials = this.getInitials(contact.name);

      // Kontakt zur Gruppe hinzufügen
      groupedContacts[firstLetter].push({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        type: contact.type,
        firstLetter: firstLetter,
        initials: initials,
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
}
