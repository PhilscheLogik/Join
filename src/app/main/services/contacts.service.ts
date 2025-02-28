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
import { BehaviorSubject, concat } from 'rxjs';

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
   * Updates the contact information in the database.
   *
   * This function updates the contact details for the specified contact ID. It checks if all the new
   * information (name, email, phone, background color, and initials) are provided. If so, it performs
   * the update operation in the database.
   *
   * @async
   * @param {string | undefined} id - The unique identifier of the contact to be updated.
   * @param {string | undefined} newName - The new name of the contact.
   * @param {string | undefined} newEmail - The new email of the contact.
   * @param {string | undefined} newPhone - The new phone number of the contact.
   * @param {string | undefined} newBgColor - The new background color for the contact.
   * @param {string | undefined} newInitials - The new initials of the contact.
   *
   * @returns {Promise<void>} A promise that resolves when the contact information is updated.
   */
  async updateContact(
    id: string | undefined,
    newName: string | undefined,
    newEmail: string | undefined,
    newPhone: string | undefined,
    newBgColor: string | undefined,
    newInitials: string | undefined
  ) {
    const updateRef = doc(this.getContactRef(), id);
    console.info(newName, newEmail, newPhone, newBgColor, newInitials);

    if (newName && newEmail && newPhone && newBgColor && newInitials) {
      await updateDoc(updateRef, {
        name: newName,
        email: newEmail,
        phone: newPhone,
        bgColor: newBgColor,
        initials: newInitials,
      });
    }
  }

  /**
   * Updates the background color and initials of a contact in the database.
   *
   * This function updates the background color and initials of the specified contact based on their ID.
   * It checks if both the new background color and initials are provided before performing the update operation.
   *
   * @async
   * @param {string | undefined} id - The unique identifier of the contact to be updated.
   * @param {string} newBgColor - The new background color for the contact.
   * @param {string} newInitials - The new initials of the contact.
   *
   * @returns {Promise<void>} A promise that resolves when the contact's background color and initials are updated.
   */
  async updateContactColorInitials(
    id: string | undefined,
    newBgColor: string,
    newInitials: string
  ) {
    const updateRef = doc(this.getContactRef(), id);

    if (newBgColor && newInitials) {
      await updateDoc(updateRef, {
        bgColor: newBgColor,
        initials: newInitials,
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
   * Creates a Contact object from the provided data.
   *
   * This function constructs a Contact object based on the given data (obj) and contact ID (id).
   * It ensures that each property in the resulting object has a fallback value (empty string) in case
   * the corresponding data is not provided.
   *
   * @param {any} obj - The object containing the contact information to be used for creating the Contact.
   * @param {string} id - The unique identifier for the contact.
   *
   * @returns {Contact} A Contact object with the specified data and ID.
   */
  setContactObj(obj: any, id: string): Contact {
    return {
      id: id || '',
      type: obj.type || '',
      name: obj.name || '',
      email: obj.email || '',
      phone: obj.phone || '',
      bgColor: obj.bgColor || '',
      initials: obj.initials || '',
    };
  }

  /**
   * Groups contacts by the first letter of their name.
   *
   * This function iterates through the contact list and groups the contacts based on the first letter of their name.
   * It then creates a new object where each key is a letter, and the value is an array of contacts whose names start with that letter.
   * The resulting grouped contacts include additional contact details such as initials and background color.
   *
   * @returns {Object} An object where each key is a letter (A-Z) and the value is an array of contact objects grouped by the first letter of their name.
   */
  getGroupedContacts() {
    let groupedContacts: { [key: string]: any[] } = {};

    for (let [index, contact] of this.contactList.entries()) {
      let firstLetter = contact.name.charAt(0).toUpperCase();

      if (!groupedContacts[firstLetter]) {
        groupedContacts[firstLetter] = [];
      }

      let initials = this.getInitials(contact.name);

      // Push contakt to group
      groupedContacts[firstLetter].push({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        type: contact.type,
        firstLetter: firstLetter,
        initials: initials,
        bgColor: contact.bgColor,
      });
    }

    return groupedContacts;
  }

  /**
   * Generates the initials from a given name.
   *
   * This function takes a name as input and returns the initials derived from the first and last parts of the name.
   * If the name consists of multiple parts, the function will take the first letter of the first and last name parts.
   * If the name is empty or invalid, it returns a fallback value ('404').
   *
   * @param {string | undefined} name - The name from which initials are to be generated.
   * @returns {string} The initials formed from the first letter of the first and last name parts, or '404' if the name is empty or invalid.
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

  /**
   * Notifies that a new contact has been created.
   *
   * This function triggers a notification that a new contact has been created by emitting a `true` value
   * through the `contactCreatedSource` observable.
   *
   * @private
   * @returns {void} This function does not return any value.
   */
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
