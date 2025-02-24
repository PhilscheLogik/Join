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

  /**
   * Opens the overlay by setting the overlay state to true.
   *
   * @param {Contact} selectedContact - The contact object that was selected to potentially display in the overlay.
   */
  openOverlay(selectedContact: Contact) {
    this.overlayState.next(true);
  }

  unsubContacts;

  constructor() {
    this.unsubContacts = this.subContactList();
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * It unsubscribes from any active subscriptions to prevent memory leaks.
   */
  ngOnDestroy() {
    this.unsubContacts();
  }

  /**
   * Subscribes to a contact list and listens for real-time updates.
   * When the data changes, it updates the local contact list by fetching
   * and mapping the new contact data.
   *
   * @returns {function} - A function to unsubscribe from the contact list updates.
   */
  subContactList() {
    return onSnapshot(this.getContactRef(), (contact) => {
      this.contactList = [];

      contact.forEach((e) => {
        this.contactList.push(this.setContactObj(e.data(), e.id));
      });
    });
  }

  /**
   * Asynchronously adds a new contact to the contact list.
   * After successfully adding the contact, it closes the overlay and sends a notification.
   *
   * @param {Contact} item - The contact object to be added.
   * @throws {Error} - Logs any error that occurs during the add operation.
   */
  async addContact(item: Contact) {
    try {
      await addDoc(this.getContactRef(), item);
      this.closeOverlay();
      this.notifyContactCreated();
    } catch (err) {
      console.error('Error adding contact:', err);
    }
  }

  /**
   * Asynchronously deletes a contact from the contact list based on the provided ID.
   *
   * @param {string} id - The ID of the contact to be deleted.
   * @throws {Error} - If the deletion fails, it will throw an error.
   */
  async deleteContact(id: string) {
    if (id) {
      await deleteDoc(doc(this.getContactRef(), id));
    }
  }

  /**
   * Asynchronously updates a contact's information in the contact list.
   * The contact is identified by the provided ID, and its details are updated with the new values.
   *
   * @param {string | undefined} id - The ID of the contact to be updated.
   * @param {string | undefined} newName - The new name to set for the contact.
   * @param {string | undefined} newEmail - The new email to set for the contact.
   * @param {string | undefined} newPhone - The new phone number to set for the contact.
   * @throws {Error} - If the update fails, an error will be thrown.
   */
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

  /**
   * Returns a reference to the 'contacts' collection in Firestore.
   *
   * @returns {CollectionReference} - The Firestore collection reference for 'contacts'.
   */
  getContactRef() {
    return collection(this.firestore, 'contacts');
  }

  /**
   * Converts a raw object into a structured Contact object.
   * The function maps the given properties from the raw object and assigns default values if they are missing.
   *
   * @param {any} obj - The raw object containing contact data.
   * @param {string} id - The ID to assign to the contact.
   * @returns {Contact} - The structured Contact object.
   */
  setContactObj(obj: any, id: string): Contact {
    return {
      id: id || '',
      type: obj.type || '',
      name: obj.name || '',
      email: obj.email || '',
      phone: obj.phone || '',
    };
  }

  /**
   * Groups the contacts by the first letter of their name and organizes them into categories.
   * Each group contains an array of contacts with additional details like initials.
   *
   * @returns {Object} - An object where keys are the first letters of contact names,
   *                     and values are arrays of grouped contact objects.
   */
  getGroupedContacts() {
    let groupedContacts: { [key: string]: any[] } = {};

    for (let contact of this.contactList) {
      let firstLetter = contact.name.charAt(0).toUpperCase();

      if (!groupedContacts[firstLetter]) {
        groupedContacts[firstLetter] = [];
      }

      let initials = this.getInitials(contact.name);

      // Push contakt to groupe
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

  /**
   * Extracts the initials from a given name. It returns the first letter of the first name
   * and the first letter of the last name (if available). If the name is invalid or empty,
   * it returns '404'.
   *
   * @param {string | undefined} name - The name from which to extract initials.
   * @returns {string} - The initials formed from the first and last name, or '404' if the name is invalid or empty.
   */
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

  /**
   * Closes the overlay by updating the overlay state to false.
   */
  closeOverlay() {
    this.overlayState.next(false);
  }

  private notifyContactCreated() {
    this.contactCreatedSource.next(true);
  }

  //colors from colors.scss
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

  /**
   * Returns a badge color based on the provided index. The color is selected
   * from a predefined list and is determined by the index modulo the length of the color array.
   *
   * @param {number} index - The index used to determine the badge color.
   * @returns {string} - The color corresponding to the given index.
   */
  getBadgeColor(index: number): string {
    return this.colors[index % this.colors.length];
  }
}
