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

  /**
   * Checks if a contact is present in the list of selected contacts.
   *
   * @param {Object} contact - The contact to check.
   * @param {string} contact.email - The email address of the contact to be checked.
   *
   * @returns {boolean} - Returns `true` if the contact is found in the selected contacts list, otherwise `false`.
   */
  isSelected(contact: any): boolean {
    return this.selectedContacts.some(
      (selectedContact) => selectedContact.email === contact.email
    );
  }

  /**
   * Toggles the selection status of a contact. If the contact is already selected, it will be removed from the selected contacts list.
   * If the contact is not selected, it will be added to the list of selected contacts.
   *
   * @param {Object} contact - The contact whose selection status is to be toggled.
   * @param {string} contact.email - The email address of the contact to toggle.
   *
   * @returns {void} - This method does not return a value.
   */
  toggleContactSelection(contact: any) {
    if (this.isSelected(contact)) {
      this.selectedContacts = this.selectedContacts.filter(
        (selectedContact) => selectedContact.email !== contact.email
      );
    } else {
      this.selectedContacts.push(contact);
    }
  }

  /**
   * Toggles the state of the `selectList` variable. If it is currently `true`, it will be set to `false`, and vice versa.
   *
   * @returns {void} - This method does not return a value.
   */
  isSelectList() {
    this.selectList = !this.selectList;
  }

  /**
   * Finds the index of a contact in the full contact list based on the contact's email.
   *
   * @param {Object} contact - The contact whose index is to be found.
   * @param {string} contact.email - The email address of the contact to search for.
   *
   * @returns {number} - Returns the index of the contact in the contact list, or `-1` if the contact is not found.
   */
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
