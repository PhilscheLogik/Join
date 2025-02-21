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
  selectedContact = false; //: any = null; // Diese Variable speichert den ausgewählten Kontakt

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

  getIndexInFullList(contact: any): number {
    return this.contactService.contactList.findIndex(
      (c) => c.email === contact.email
    );
  }
}
