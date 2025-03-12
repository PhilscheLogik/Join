import {
  Component,
  EventEmitter,
  inject,
  Output,
  HostListener,
} from '@angular/core';
import { TaskServiceService } from '../../services/task-service.service';
import { ContactsService } from '../../services/contacts.service';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../interfaces/task';
import { NavigationService } from '../../../shared/navi/navigation.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  // Dependency Injection
  firestore: Firestore = inject(Firestore);
  taskService = inject(TaskServiceService);
  contactService = inject(ContactsService);
  naviService = inject(NavigationService);

  // Task Properties
  toDo = [];
  prio = 'Medium';
  selectedCategory = '';
  newDate = '';
  inputTitle = '';
  inputDescription = '';
  showSuccessMessage = false;

  // Contact Selection
  selectList = false;
  selectedContacts: any[] = [];

  // Subtask Management
  newSubtask: string = '';
  subtasks: { text: string; isEditing: boolean; IsCompleted?: boolean }[] = [];
  isEditing: boolean = false;
  openCategory = false;

  // Error Handling
  errors: { title: boolean; date: boolean; category: boolean } = {
    title: false,
    date: false,
    category: false,
  };

  // Miscellaneous
  box: any;

  /**
   * Listens for click events outside the select container and hides the select list if clicked outside.
   *
   * @param {Event} event - The click event that is triggered when the user clicks anywhere on the document.
   * @returns {void}
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (this.selectList && !targetElement.closest('.select-container')) {
      this.selectList = false;
    }
  }

  /**
   * Constructor to initialize the component with task details when in edit mode.
   * It checks if edit mode is activated, then populates the input fields with the task data.
   *
   * @returns {void}
   */
  constructor() {
    if (this.taskService.isEditModeActivated) {
      this.inputTitle = String(this.taskService.selectedTask?.title);
      this.inputDescription = String(
        this.taskService.selectedTask?.description
      );
      this.prio = String(this.taskService.selectedTask?.prio);
      this.newDate = String(this.taskService.selectedTask?.date);
      this.subtasks = this.convertSubtasks(
        this.taskService.selectedTask?.subtasks
      );
      // this.selectedContacts = this.taskService.selectedTask?.assignedTo ?? [];
      this.selectedContacts = this.mapAssignedToContacts(
        this.taskService.selectedTask?.assignedTo
      );
    }
  }

  /**
   * Converts subtasks from the database format to the internal format used by the component.
   *
   * @param {Array<{ text: string; IsCompleted: boolean }>} [subtasksFromDb] - The subtasks from the database.
   * @returns {Array<{ text: string; isEditing: boolean }>} - The formatted subtasks with 'isEditing' set to false.
   */
  convertSubtasks(
    subtasksFromDb?: { text: string; IsCompleted: boolean }[]
  ): { text: string; isEditing: boolean }[] {
    if (!subtasksFromDb) return [];

    return subtasksFromDb.map((subtask) => ({
      text: subtask.text,
      isEditing: false,
      IsCompleted: subtask.IsCompleted,
    }));
  }

  /**
   * Maps the assigned contact IDs to the corresponding contact details from the contact list.
   *
   * @param {string[] | undefined} assignedToIds - The array of contact IDs that are assigned to the task.
   * @returns {any[]} - An array of contacts that match the assigned contact IDs from the contact list.
   */
  mapAssignedToContacts(assignedToIds: string[] | undefined): any[] {
    if (!assignedToIds || !this.contactService.contactList) {
      return [];
    }
    const selectedContacts = this.contactService.contactList.filter(
      (contact) => contact.id && assignedToIds.includes(contact.id)
    );

    return selectedContacts;
  }

  /**
   * Gets the current date in the format YYYY-MM-DD.
   * @returns {string} The formatted current date as a string.
   */
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Checks if the selected date is in the past.
   * @returns {boolean} True if the selected date is in the past, otherwise false.
   */
  isPastDate(): boolean {
    const selectedDate = new Date(this.newDate);
    const currentDate = new Date();
    // Set time of both dates to ensure we compare only the dates
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
      category: !this.selectedCategory.trim(),
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
    if (category == this.selectedCategory) {
      this.errors.category = true;
      return (this.selectedCategory = '');
    } else {
      this.errors.category = false;
      return (this.selectedCategory = category);
    }
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
   * Handles the Enter key press event when editing a subtask.
   * If a subtask is being edited and is not empty, it is added to the list.
   */
  handleEnter(): void {
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
      myArray.push({
        text: this.subtasks[i].text,
        IsCompleted: this.subtasks[i].IsCompleted ?? false,
      });
    }
    return myArray;
  }

  /**
   * Submits the form to create a new task after performing validation checks.
   *
   * This function validates the date, ensures that all required fields are filled, and checks
   * if the priority and category are valid. If all validations pass, it creates the task and
   * adds it using the task service. After submission, the form is cleared.
   *
   * @returns {void} - This function doesn't return any value.
   */
  submitAddForm() {
    this.validateForm();

    // Validate the date and fields
    if (!this.isValidDate(this.newDate)) {
      // console.log('The selected date cannot be in the past');
      return;
    }

    if (!this.areRequiredFieldsFilled()) {
      // console.log('You cannot even fill in all the required fields?!?');
      return;
    }

    // Create and add the task if all validations passed
    const newTask = this.createTask();
    if (newTask) {
      this.taskService.addTask(this.taskService.whatIsTheType, newTask);
      this.showTaskToast();
    }
    this.clearForm();
  }

  /**
   * Validates if the provided date is not in the past.
   *
   * @param {string} date - The date to be validated.
   * @returns {boolean} - Returns true if the date is today or in the future, false if it's in the past.
   */
  isValidDate(date: string): boolean {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    return selectedDate >= currentDate;
  }

  /**
   * Checks if all required fields are filled and valid.
   *
   * This function ensures that the title, date, category, priority, and category are properly set
   * and that the priority and category values are valid.
   *
   * @returns {string | boolean} - Returns true if all required fields are filled and valid, false if any field is invalid.
   */
  areRequiredFieldsFilled(): string | boolean {
    return (
      this.inputTitle &&
      this.newDate &&
      this.selectedCategory &&
      this.isValidPriority() &&
      this.isValidCategory()
    );
  }

  /**
   * Validates if the provided priority is one of the allowed values.
   *
   * This function checks if the current priority value is one of the valid options: 'Urgent', 'Medium', or 'Low'.
   * It ensures that the priority is one of the predefined acceptable values before performing further operations.
   *
   * @returns {boolean} - Returns true if the priority is valid (either 'Urgent', 'Medium', or 'Low'), false otherwise.
   */
  isValidPriority(): boolean {
    return ['Urgent', 'Medium', 'Low'].includes(
      this.prio as 'Urgent' | 'Medium' | 'Low'
    );
  }

  /**
   * Validates if the provided priority is one of the allowed values.
   *
   * The allowed priorities are 'Urgent', 'Medium', and 'Low'. This function checks
   * if the current priority value matches one of these valid options.
   *
   * @returns {boolean} - Returns true if the priority is valid (either 'Urgent', 'Medium', or 'Low'), false otherwise.
   */
  isValidCategory(): boolean {
    return ['User Story', 'Technical Task'].includes(
      this.selectedCategory as 'User Story' | 'Technical Task'
    );
  }

  /**
   * Creates a new task object if the priority and category are valid.
   *
   * This function constructs a task object using the current input values for title, description,
   * assigned user, date, priority, category, and subtasks, but only if the priority and category
   * are valid. If the validation fails, it returns null.
   *
   * @returns {Task | null} - Returns a new task object if valid, or null if the priority or category is invalid.
   */
  createTask(): Task | null {
    if (this.isValidPriority() && this.isValidCategory()) {
      return {
        title: this.inputTitle,
        description: this.inputDescription,
        assignedTo: this.getId(),
        date: this.newDate,
        prio: this.prio as 'Urgent' | 'Medium' | 'Low',
        category: this.selectedCategory as 'User Story' | 'Technical Task',
        subtasks: this.getText(),
      };
    }
    return null;
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

  /**
   * Submits the updated task form after performing validation checks.
   *
   * This function validates the date, checks if the title and date are provided, validates
   * the priority, ensures a task ID is selected, and then updates the task in the task service.
   */
  submitUpdateForm() {
    this.validateForm();
    this.selectedCategory = this.taskService.selectedTaskCategory;

    // Validate the date and fields
    if (!this.isValidDate(this.newDate)) {
      // console.log('The selected date cannot be in the past');
      return;
    }

    if (!this.areRequiredFieldsFilled()) {
      // console.log('You cannot even fill in all the required fields?!?');
      return;
    }

    // Check priority and task ID before updating
    if (this.isValidPriority() && this.taskService.selectedTaskId !== '') {
      this.updateTask();
      this.showTaskToast();
    }

    this.clearForm();
    this.taskService.isEditModeActivated = false;
  }

  /**
   * Updates the task in the task service.
   */
  updateTask() {
    this.taskService.updateTask(
      this.taskService.selectedTaskId,
      this.inputTitle,
      this.inputDescription,
      this.getId(),
      this.newDate,
      this.prio,
      this.selectedCategory,
      this.getText(),
      this.taskService.whatIsTheType
    );
  }

  /**
   * Displays a task success message (toast) for a short duration.
   *
   * When called, it sets `showSuccessMessage` to `true`, making the toast visible.
   * After 2 seconds, it automatically hides the toast by setting `showSuccessMessage` to `false`.
   */
  showTaskToast() {
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.naviService.setSelectedItem(2);
    }, 2000);
  }
}
