import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { Contact } from '../../interfaces/contact';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private overlayState = new BehaviorSubject<boolean>(false);
  overlayState$ = this.overlayState.asObservable();

  private contactCreatedSource = new BehaviorSubject<boolean>(false);
  contactCreated$ = this.contactCreatedSource.asObservable();

  openOverlay(selectedContact: Contact) {
    this.overlayState.next(true);

    /*NEW for EDIT Fct*/
    this.setTest(selectedContact);
    console.info('service ts');
    console.log(this.getTest());
  }

  test: Contact = {
    name: '',
    email: '',
    phone: '',
  };

  setTest(selectedContact: Contact) {
    this.test = selectedContact;
  }

  getTest() {
    return this.test;
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
    try {
      await addDoc(this.getContactRef(), item);
      this.closeOverlay(); 
      this.notifyContactCreated();
    } catch (err) {
      console.error('Error adding contact:', err);
    }
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

  
  closeOverlay() {
    this.overlayState.next(false);
  }

  private notifyContactCreated() {
    this.contactCreatedSource.next(true);
    setTimeout(() => this.contactCreatedSource.next(false), 10000);
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
}
