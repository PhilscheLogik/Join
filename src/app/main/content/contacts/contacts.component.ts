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

  // Schließt das Overlay, wenn der Hintergrund angeklickt wird
  closeOverlayOnClick(event: any) {
    if (event.target.classList.contains('overlay')) {
      this.closeOverlay();
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
      // Wenn der gleiche Kontakt erneut angeklickt wird, setzte den ausgewählten Kontakt auf null
      this.selectedContact = null;
      this.selectedContactInitials = null;
      this.isContactSelected = false;
      // Verstecke die "contact_content" div, wenn kein Kontakt ausgewählt ist
      this.showContactContent = false;
    } else {
      this.selectedContact = contact;
      this.selectedContactInitials = this.contactService.getInitials(
        contact.name
      );
      this.isContactSelected = true;
      // Zeige die "contact_content" div an
      this.showContactContent = true;
    }
  }

  mobileDisplay() {
    this.isShown = !this.isShown;
  }

  getList() {
    return this.selectedContact?.id;
  }

  // //Farben aus colors.scss
  // colors = [
  //   '#FF7A00', // Sunset Orange
  //   '#930FFF', // Electric Purple
  //   '#6E52FF', // Lavender Blue
  //   '#FC71FF', // Fuchsia Pink
  //   '#FFBB2B', // Golden Yellow
  //   '#1FD7C1', // Mint Green
  //   '#0038FF', // Deep Blue
  //   '#FF4646', // Light Red
  //   '#00BEE8', // Aqua Blue
  //   '#FF5EB3', // Soft Pink
  //   '#FF745E', // Peach
  //   '#FFA35E', // Warm Yellow
  //   '#FFC701', // Bright Yellow
  //   '#C3FF2B', // Light Green
  //   '#FFE62B', // Bright Yellow 2
  // ];

  // // Funktion, um die richtige Farbe basierend auf dem Index zuzuweisen
  // getBadgeColor(index: number): string {
  //   return this.colors[index % this.colors.length];
  // }

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
          // Optional: Leere den ausgewählten Kontakt nach der Löschung
          this.selectedContact = null;
          this.isContactSelected = false;
          this.closeOverlay(); // Schließt das Overlay nach dem Löschen
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
