import { Component, inject } from '@angular/core';
import { TaskServiceService } from '../../services/task-service.service';
import { ContactsService } from '../../services/contacts.service';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  selectedContacts: any[] = []; // Array für ausgewählte Kontakte

  constructor() {}

  setPriority(status: string) {
    this.prio = status;
  }

  // Überprüft, ob der Kontakt ausgewählt ist
  isSelected(contact: any): boolean {
    return this.selectedContacts.some(
      (selectedContact) => selectedContact.email === contact.email
    );
  }

  // Toggle für den Kontakt - füge hinzu oder entferne aus der Liste der ausgewählten Kontakte
  toggleContactSelection(contact: any) {
    if (this.isSelected(contact)) {
      // Entferne den Kontakt aus der Liste der ausgewählten Kontakte
      this.selectedContacts = this.selectedContacts.filter(
        (selectedContact) => selectedContact.email !== contact.email
      );
    } else {
      // Füge den Kontakt zur Liste der ausgewählten Kontakte hinzu
      this.selectedContacts.push(contact);
    }
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

  /*Subtask content*/
  newSubtask: string = '';
  subtasks: { text: string; isEditing: boolean }[] = [
    { text: 'Taste Esc suchen', isEditing: false },
    { text: 'Schuhe zubinden', isEditing: false },
  ];
  isEditing: boolean = false;

  startEditing() {
    this.isEditing = true;
  }

  // stopEditing() {
  //   this.isEditing = false;
  // }

  cancelEditing() {
    this.isEditing = false;
    this.newSubtask = '';
  }

  addSubtask() {
    if (this.newSubtask.trim()) {
      this.subtasks.push({ text: this.newSubtask, isEditing: false });
    }
    this.cancelEditing();
  }

  deleteSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  editSubtask(index: number) {
    this.subtasks[index].isEditing = true;
  }

  saveEdit(index: number) {
    if (!this.subtasks[index].text.trim()) {
      this.subtasks[index].text = this.subtasks[index].text;
    }
    this.subtasks[index].isEditing = false;
  }
}
