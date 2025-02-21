import { Component, inject } from '@angular/core';
import { TaskServiceService } from '../../services/task-service.service';
import { ContactsService } from '../../services/contacts.service';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  firestore: Firestore = inject(Firestore);
  taskService = inject(TaskServiceService);
  contactService = inject(ContactsService);

  toDo = [];
  prio = 'medium';
  selectList = false;
  selectedContacts: Set<any> = new Set(); // Set to track selected contacts

  constructor() {}

  setPriority(status: string) {
    this.prio = status;
  }

  /**
   * Variable to select / unselect Contactlist
   */
  isSelectList() {
    this.selectList = !this.selectList;
  }

  // Toggle contact selection
  toggleContactSelection(contact: any) {
    if (this.selectedContacts.has(contact)) {
      this.selectedContacts.delete(contact); // Deselect contact
    } else {
      this.selectedContacts.add(contact); // Select contact
    }
  }

  // Check if contact is selected
  isSelected(contact: any): boolean {
    return this.selectedContacts.has(contact);
  }

  getIndexInFullList(contact: any): number {
    return this.contactService.contactList.findIndex(
      (c) => c.email === contact.email
    );
  }
}
