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
  firestore: Firestore = inject(Firestore);

  selectedContact: Contact | null = null;
  isSelected = false;
  isEdit = false;

  contactList: Contact[] = [];

  private overlayState = new BehaviorSubject<boolean>(false);
  overlayState$ = this.overlayState.asObservable();

  private contactCreatedSource = new BehaviorSubject<boolean>(false);
  contactCreated$ = this.contactCreatedSource.asObservable();

  openOverlay(selectedContact: Contact) {
    this.overlayState.next(true);
  }

  unsubContacts;

  constructor() {
    this.unsubContacts = this.subContactList();
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
    id: string | undefined,
    newName: string | undefined,
    newEmail: string | undefined,
    newPhone: string | undefined
  ) {
    const updateRef = doc(this.getContactRef(), id);

    if (newName && newEmail && newPhone) {
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
    let groupedContacts: { [key: string]: any[] } = {};
    
    for (let contact of this.contactList) {
      let firstLetter = contact.name.charAt(0).toUpperCase();

      if (!groupedContacts[firstLetter]) {
        groupedContacts[firstLetter] = [];
      }

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
  getInitials(name: string | undefined): string {
    if (name) {
      if (!name.trim()) return ''; 
      let nameParts = name.trim().split(/\s+/); 
      let firstInitial = nameParts[0].charAt(0).toUpperCase(); 
      let lastInitial =
        nameParts.length > 1
          ? nameParts[nameParts.length - 1].charAt(0).toUpperCase()
          : ''; 

      return firstInitial + lastInitial;
    } else {
      return '404';
    }
  }

  closeOverlay() {
    this.overlayState.next(false);
  }

  private notifyContactCreated() {
    this.contactCreatedSource.next(true);
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
