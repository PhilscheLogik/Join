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
    this.overlayState$.subscribe(state => console.log('Overlay State:', state));
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

    async updateContact(id: string, newName: string, newEmail : string, newPhone : string) {
    const updateRef = doc(this.getContactRef(),id);

    if(newName != '' && newEmail != '' && newPhone != ''){
    await updateDoc(updateRef, {
      'name': newName,
      'email' : newEmail,
      'phone' : newPhone
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
}
