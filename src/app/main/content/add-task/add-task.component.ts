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
  selectedContacts: any[] = [];
  selectedCategory = '';
  newDate = '';
  inputTitle = '';
  inputDescription = '';

  /*Subtask content*/
  newSubtask: string = '';
  subtasks: { text: string; isEditing: boolean }[] = [
    { text: 'Taste Esc suchen', isEditing: false },
    { text: 'Schuhe zubinden', isEditing: false },
  ];
  isEditing: boolean = false;

  openCategory = false;

  constructor() {}

  /**
   * Checks if the given category is the currently selected category.
   *
   * This method compares the provided category with the `selectedCategory` property. If they match, it returns `true`;
   * otherwise, it returns `false`.
   *
   * @param {string} category - The category to check against the currently selected category.
   * @returns {boolean} Returns `true` if the provided category matches the selected category, otherwise `false`.
   */
  isSelectedCategory(category: string) {
    return category == this.selectedCategory ? true : false;
  }

  /**
   * Toggles the selected category between the provided category and an empty string.
   *
   * This method checks if the provided category is already the selected category. If it is, the `selectedCategory` is
   * reset to an empty string, effectively deselecting it. If the provided category is not the selected one, it updates
   * `selectedCategory` to the new category.
   *
   * @param {string} category - The category to toggle as the selected category.
   * @returns {void} This method does not return anything.
   */
  toggleCategory(category: string) {
    category == this.selectedCategory
      ? (this.selectedCategory = '')
      : (this.selectedCategory = category);
  }

  /**
   * Sets the priority status.
   *
   * This method updates the `prio` property with the provided priority status.
   *
   * @param {string} status - The priority status to set (e.g., 'high', 'medium', 'low').
   * @returns {void} This method does not return anything.
   */
  clickCategory() {
    this.openCategory = !this.openCategory;
  }

  /**
   * Updates the priority status.
   *
   * This method sets the `prio` property to the given status, which represents the priority level.
   * It can be used to assign a new priority to a task or item.
   *
   * @param {string} status - The priority status to set (e.g., 'high', 'medium', 'low').
   * @returns {void} This method does not return anything.
   */
  setPriority(status: string) {
    this.prio = status;
  }

  /**
   * Checks if a contact is selected.
   *
   * This method checks if the provided contact exists in the list of selected contacts
   * by comparing the email of the provided contact with the emails of the selected contacts.
   *
   * @param {any} contact - The contact to check if it's selected.
   * @returns {boolean} Returns `true` if the provided contact is found in the selected contacts list,
   *                    otherwise returns `false`.
   */
  isSelected(contact: any): boolean {
    return this.selectedContacts.some(
      (selectedContact) => selectedContact.email === contact.email
    );
  }

  /**
   * Toggles the selection of a contact.
   *
   * This method checks if the provided contact is currently selected. If the contact is selected,
   * it removes the contact from the `selectedContacts` array. If the contact is not selected,
   * it adds the contact to the `selectedContacts` array.
   *
   * @param {any} contact - The contact to toggle selection for.
   * @returns {void} This method does not return anything.
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
   * Toggles the selection state of the list.
   *
   * This method flips the value of the `selectList` property between `true` and `false`, effectively toggling
   * whether the list is in a selected state or not.
   *
   * @returns {void} This method does not return anything.
   */
  isSelectList() {
    this.selectList = !this.selectList;
  }

  /**
   * Finds the index of a contact in the full contact list based on the email.
   *
   * This method searches the `contactList` for a contact with the same email as the provided contact
   * and returns the index of the contact in the list. If the contact is not found, it returns -1.
   *
   * @param {any} contact - The contact to search for in the full contact list.
   * @returns {number} The index of the contact in the `contactList`, or -1 if the contact is not found.
   */
  getIndexInFullList(contact: any): number {
    return this.contactService.contactList.findIndex(
      (c) => c.email === contact.email
    );
  }

  /**
   * Starts the editing process.
   *
   * This method sets the `isEditing` property to `true`, indicating that the user is currently editing.
   * It can be used to enable editing features in the user interface.
   *
   * @returns {void} This method does not return anything.
   */
  startEditing() {
    this.isEditing = true;
  }

  /**
   * Cancels the editing process.
   *
   * This method sets the `isEditing` property to `false`, indicating that the user has canceled
   * the editing process. It also clears the `newSubtask` property, resetting any changes made during editing.
   *
   * @returns {void} This method does not return anything.
   */
  cancelEditing() {
    this.isEditing = false;
    this.newSubtask = '';
  }

  /**
   * Adds a new subtask to the list of subtasks.
   *
   * This method checks if the `newSubtask` is not empty or just whitespace. If valid, it adds the
   * new subtask (with `text` and `isEditing` properties) to the `subtasks` array. After adding the
   * subtask, it cancels the editing process by calling the `cancelEditing` method.
   *
   * @returns {void} This method does not return anything.
   */
  addSubtask() {
    if (this.newSubtask.trim()) {
      this.subtasks.push({ text: this.newSubtask, isEditing: false });
    }
    this.cancelEditing();
  }

  /**
   * Deletes a subtask from the list of subtasks.
   *
   * This method removes the subtask at the specified `index` from the `subtasks` array using the `splice` method.
   *
   * @param {number} index - The index of the subtask to be deleted from the `subtasks` array.
   * @returns {void} This method does not return anything.
   */
  deleteSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  /**
   * Initiates editing for a specific subtask.
   *
   * This method sets the `isEditing` property of the subtask at the specified `index` to `true`,
   * indicating that the subtask is now in an editable state.
   *
   * @param {number} index - The index of the subtask to be edited in the `subtasks` array.
   * @returns {void} This method does not return anything.
   */
  editSubtask(index: number) {
    this.subtasks[index].isEditing = true;
  }

  /**
   * Saves the changes made to a subtask and ends the editing process.
   *
   * This method checks if the `text` of the subtask at the specified `index` is not empty or just whitespace.
   * If the text is valid, it saves the updated text. Then, it sets the `isEditing` property of the subtask
   * to `false`, indicating the editing process has ended.
   *
   * @param {number} index - The index of the subtask to save changes for in the `subtasks` array.
   * @returns {void} This method does not return anything.
   */
  saveEdit(index: number) {
    if (!this.subtasks[index].text.trim()) {
      this.subtasks[index].text = this.subtasks[index].text;
    }
    this.subtasks[index].isEditing = false;
  }

  submitForm() {
    console.log('------------------');
    console.info('Title');
    console.log(this.inputTitle);

    console.info('Description');
    console.log(this.inputDescription);

    console.info('conctacts');
    console.log();

    console.info('Date');
    console.log(this.newDate);

    console.info('Prio');
    console.log(this.prio);

    console.info('Category');
    console.log(this.selectedCategory);

    console.info('Subtasks');
    console.log(this.subtasks);
    console.log('------------------');
  }
}
