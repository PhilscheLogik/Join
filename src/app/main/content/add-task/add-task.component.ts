import { Component, EventEmitter, inject, Output } from '@angular/core';
import { TaskServiceService } from '../../services/task-service.service';
import { ContactsService } from '../../services/contacts.service';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../interfaces/task';

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
  prio = 'Medium';
  selectList = false;
  selectedContacts: any[] = [];
  selectedCategory = '';
  newDate = '';
  inputTitle = '';
  inputDescription = '';

  /*Subtask content*/
  newSubtask: string = '';
  subtasks: { text: string; isEditing: boolean }[] = [];
  isEditing: boolean = false;
  openCategory = false;

  // Errorstatus
  errors: { title: boolean; date: boolean } = {
    title: false,
    date: false,
  };

  constructor() {}

  updateForm() {
     console.log('Edit Mode aktiviert')
    }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isPastDate(): boolean {
    const selectedDate = new Date(this.newDate);
    const currentDate = new Date();
    // Set time of both dates to ensure we compare the dates only
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    return selectedDate < currentDate;
  }

  /**
   * Checks if the specified field is invalid based on the error state.
   *
   * This method evaluates the error status for a given field (title, date, etc.)
   * and returns `true` if the field has an associated error (i.e., is invalid),
   * or `false` if it is valid.
   *
   * @param {string} field - The name of the field to check for errors (e.g., 'title', 'date').
   * @returns {boolean} Returns `true` if the field is invalid (error exists), `false` if valid.
   */
  isFieldInvalid(field: string): boolean {
    if (field === 'title') {
      return this.errors.title;
    }
    if (field === 'date') {
      return this.errors.date;
    }
    return false;
  }

  /**
   * Clears the error state for the specified field.
   *
   * This method sets the error status of a given field (e.g., 'title', 'date') to `false`,
   * effectively marking the field as no longer having an error.
   * This can be used to reset or clear validation errors for a specific field.
   *
   * @param {string} field - The name of the field to clear the error for (e.g., 'title', 'date').
   * @returns {void} This method does not return anything.
   */
  clearError(field: string) {
    if (field === 'title') {
      this.errors.title = false;
    }
    if (field === 'date') {
      this.errors.date = false;
    }
  }

  /**
   * Validates the form by checking required fields for errors.
   *
   * This method checks whether the `inputTitle` and `newDate` fields are non-empty
   * by trimming any whitespace. It sets the `errors` object properties (`title` and `date`)
   * to `true` if the respective fields are empty (invalid), and `false` if they are valid.
   * The error states can be used to display validation messages to the user.
   *
   * @returns {void} This method does not return any value but updates the `errors` object.
   */
  validateForm() {
    this.errors = {
      title: !this.inputTitle.trim(),
      date: !this.newDate.trim(),
    };
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

  handleEnter() {
    if (this.isEditing && this.newSubtask.trim() !== '') {
      this.addSubtask();
    }
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

  /**
   * Retrieves the IDs of all selected contacts.
   *
   * This method iterates through the `selectedContacts` array and extracts the `id` property from each contact,
   * returning a new array containing these IDs.
   *
   * @returns {Array<string>} An array of contact IDs.
   */
  getId() {
    let myArray = [];
    for (let i = 0; i < this.selectedContacts.length; i++) {
      myArray.push(this.selectedContacts[i].id);
    }
    return myArray;
  }

  /**
   * Retrieves the text of all subtasks with a default completion status of false.
   *
   * This method iterates through the `subtasks` array and extracts the `text` property from each subtask,
   * returning a new array of objects where each object contains the `text` of the subtask and
   * sets the `IsCompleted` property to `false`.
   *
   * @returns {Array<Object>} An array of objects, each containing:
   *   - {string} text: The text of the subtask.
   *   - {boolean} IsCompleted: A default value of `false`, indicating the subtask is not completed.
   */
  getText() {
    let myArray = [];
    for (let i = 0; i < this.subtasks.length; i++) {
      myArray.push({ text: this.subtasks[i].text, IsCompleted: false });
    }
    return myArray;
  }

  /**
   * Submits the form data to create a new task after validation.
   *
   * This method first validates the form by checking if required fields (`inputTitle`, `newDate`, and `selectedCategory`)
   * are filled in and if the priority and category are valid. If the validation passes, it creates a new task object
   * with the form data (including `title`, `description`, `assignedTo`, `date`, `prio`, `category`, and `subtasks`)
   * and passes it to the `taskService.addTask` method for further processing. If the required fields are not filled,
   * an error message is logged to the console.
   * After submitting the form, it clears all form data by calling the `clearForm` method.
   *
   * @returns {void} This method does not return any value but triggers the task creation process and clears the form.
   */
  submitForm() {
    this.validateForm();
    let newTask: Task;

    // Validate if the selected date is in the past
    const selectedDate = new Date(this.newDate);
    const currentDate = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (selectedDate < currentDate) {
      console.log('The selected date cannot be in the past');
      return;
    }

    if (this.inputTitle && this.newDate && this.selectedCategory) {
      if (
        this.prio == 'Urgent' ||
        this.prio == 'Medium' ||
        this.prio == 'Low'
      ) {
        if (
          this.selectedCategory == 'User Story' ||
          this.selectedCategory == 'Technical Task'
        ) {
          newTask = {
            title: this.inputTitle,
            description: this.inputDescription,
            assignedTo: this.getId(),
            date: this.newDate,
            prio: this.prio,
            category: this.selectedCategory,
            subtasks: this.getText(),
          };

          this.taskService.addTask(this.taskService.whatIsTheType, newTask);
        }
      }
    } else {
      console.log('Du kannst nicht mal alle Pflichtfelder ausfüllen?!?');
    }

    this.clearForm();
  }

  /**
   * Clears the form data by resetting all input fields and selected values to their default states.
   *
   * This method resets the following properties to their initial values:
   * - `inputTitle`: Resets to an empty string.
   * - `inputDescription`: Resets to an empty string.
   * - `newDate`: Resets to an empty string.
   * - `prio`: Resets to the default value 'Medium'.
   * - `selectedCategory`: Resets to an empty string.
   * - `selectedContacts`: Clears the selected contacts array.
   * - `subtasks`: Clears the subtasks array.
   *
   * This is typically used when clearing a form after submitting or when resetting the form to its initial state.
   *
   * @returns {void} This method does not return any value.
   */
  clearForm() {
    this.inputTitle = '';
    this.inputDescription = '';
    this.newDate = '';
    this.prio = 'Medium'; // Set default priority
    this.selectedCategory = '';
    this.selectedContacts = [];
    this.subtasks = [];
  }
}
