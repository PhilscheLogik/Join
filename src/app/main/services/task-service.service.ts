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
import { Task } from '../../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskServiceService {
  firestore: Firestore = inject(Firestore);

  whatIsTheType = 'feedback';

  todoList: Task[] = [];
  progressList: Task[] = [];
  feedbackList: Task[] = [];
  doneList: Task[] = [];
  showCloseButton: boolean = false; // New variable to control button visibility

  unsubToDo;
  unsubInProgress;
  unsubFeedback;
  unsubDone;

  /**
   * Initializes the component and subscribes to real-time updates for multiple collections.
   *
   * This constructor sets up real-time listeners for the 'todo', 'inprogress', 'feedback', and 'done' collections in Firestore.
   * It stores the unsubscribe functions for each collection, which can be used later to stop receiving updates.
   *
   * @returns {void} This method does not return anything.
   */
  constructor() {
    this.unsubToDo = this.subToDoList();
    this.unsubInProgress = this.subInProgressList();
    this.unsubFeedback = this.subFeedbackList();
    this.unsubDone = this.subDoneList();
  }

  toggleCloseButton() {
    this.showCloseButton = !this.showCloseButton;
  }

  /**
   * Cleanup logic for component destruction.
   *
   * This method is called when the component is destroyed. It unsubscribes from all real-time listeners (i.e.,
   * 'todo', 'inprogress', 'feedback', and 'done' collections) to prevent memory leaks and stop receiving further updates.
   *
   * @returns {void} This method does not return anything.
   */
  ngOnDestroy() {
    this.unsubToDo();
    this.unsubInProgress();
    this.unsubFeedback();
    this.unsubDone();
  }

  /**
   * Subscribes to real-time updates for the 'todo' collection in Firestore.
   *
   * This function sets up a real-time listener using Firestore's `onSnapshot` method to subscribe to changes in the 'todo'
   * collection. Whenever there is a change, it updates the `todoList` with the latest data from the collection. Each document
   * in the 'todo' collection is processed and transformed using the `setObj` method before being added to the list.
   *
   * @returns {function} A function to unsubscribe from the real-time updates when called.
   */
  subToDoList() {
    return onSnapshot(this.getToDoRef(), (todo) => {
      this.todoList = [];
      todo.forEach((e) => {
        this.todoList.push(this.setObj(e.data(), e.id));
      });
    });
  }

  /**
   * Subscribes to real-time updates for the 'inprogress' collection in Firestore.
   *
   * This function sets up a real-time listener using Firestore's `onSnapshot` method to subscribe to changes in the 'inprogress'
   * collection. Whenever there is a change, it updates the `progressList` with the latest data from the collection. Each document
   * in the 'inprogress' collection is processed and transformed using the `setObj` method before being added to the list.
   *
   * @returns {function} A function to unsubscribe from the real-time updates when called.
   */
  subInProgressList() {
    return onSnapshot(this.getInProgressRef(), (progress) => {
      this.progressList = [];
      progress.forEach((e) => {
        this.progressList.push(this.setObj(e.data(), e.id));
      });
    });
  }

  /**
   * Subscribes to real-time updates for the 'feedback' collection in Firestore.
   *
   * This function sets up a real-time listener using Firestore's `onSnapshot` method to subscribe to changes in the 'feedback'
   * collection. Whenever there is a change, it updates the `feedbackList` with the latest data from the collection. Each feedback
   * document is processed and transformed using the `setObj` method before being added to the list.
   *
   * @returns {function} A function to unsubscribe from the real-time updates when called.
   */
  subFeedbackList() {
    return onSnapshot(this.getFeedbackRef(), (feedback) => {
      this.feedbackList = [];
      feedback.forEach((e) => {
        this.feedbackList.push(this.setObj(e.data(), e.id));
      });
    });
  }

  /**
   * Subscribes to changes in the "done" collection and updates the doneList accordingly.
   * Uses Firestore's `onSnapshot` to listen for real-time updates.
   *
   * @returns {Function} Unsubscribe function to stop listening for updates.
   */
  subDoneList() {
    return onSnapshot(this.getDoneRef(), (done) => {
      this.doneList = [];
      done.forEach((e) => {
        this.doneList.push(this.setObj(e.data(), e.id));
      });
    });
  }

  /**
   * Retrieves the reference to the 'todo' collection in Firestore.
   *
   * This function returns a reference to the 'todo' collection in Firestore, where tasks or items that are yet to be
   * completed are stored.
   *
   * @returns {FirebaseFirestore.CollectionReference} The reference to the 'todo' collection in Firestore.
   */
  getToDoRef() {
    return collection(this.firestore, 'todo');
  }

  /**
   * Retrieves the reference to the 'inprogress' collection in Firestore.
   *
   * This function returns a reference to the 'inprogress' collection in Firestore, where tasks or items that are currently
   * in progress are stored.
   *
   * @returns {FirebaseFirestore.CollectionReference} The reference to the 'inprogress' collection in Firestore.
   */
  getInProgressRef() {
    return collection(this.firestore, 'inprogress');
  }

  /**
   * Retrieves the reference to the 'feedback' collection in Firestore.
   *
   * This function returns a reference to the 'feedback' collection in Firestore, where feedback-related data is stored.
   *
   * @returns {FirebaseFirestore.CollectionReference} The reference to the 'feedback' collection in Firestore.
   */
  getFeedbackRef() {
    return collection(this.firestore, 'feedback');
  }

  /**
   * Retrieves the reference to the 'done' collection in Firestore.
   *
   * This function returns a reference to the 'done' collection in Firestore, where completed tasks or items are stored.
   *
   * @returns {FirebaseFirestore.CollectionReference} The reference to the 'done' collection in Firestore.
   */
  getDoneRef() {
    return collection(this.firestore, 'done');
  }

  /**
   * Creates a Task object with the given data and ID.
   *
   * This function constructs and returns a Task object using the provided data and task ID. If any optional fields
   * are missing or undefined, default values (such as empty strings) are assigned. The Task object contains properties
   * such as title, description, assigned person, due date, priority, category, and subtasks.
   *
   * @param {any} obj - The object containing the task details, such as title, description, assigned person, etc.
   * @param {string} id - The unique identifier for the task.
   * @returns {Task} The constructed Task object with the provided details and ID.
   */
  setObj(obj: any, id: string): Task {
    return {
      id: id || '',
      title: obj.title,
      description: obj.description || '',
      assignedTo: obj.assignedTo || '',
      date: obj.date,
      prio: obj.prio,
      category: obj.category,
      subtasks: obj.subtasks || '',
    };
  }

  /**
   * Adds a new task to a specified category.
   *
   * This asynchronous function adds a new task to the specified category by calling the `addDoc` function with the
   * appropriate category reference and task data. If an error occurs during the addition process, it logs the error.
   *
   * @async
   * @param {string} category - The category where the task should be added.
   * @param {Task} task - The task object containing the details to be added.
   * @returns {Promise<void>} A promise that resolves when the task is successfully added to the specified category.
   * @throws {Error} If an error occurs during the addition process, it is caught and logged to the console.
   */
  async addTask(category: string, task: Task) {
    const ref = this.getCategoryRef(category);
    try {
      await addDoc(ref, task);
    } catch (err) {
      console.error('Error adding task:', err);
    }
  }

  /**
   * Deletes a task from a specified category by its ID.
   *
   * This asynchronous function deletes a task from the given category. It first retrieves the appropriate category
   * reference and then attempts to delete the task using its ID. If an error occurs during the deletion, it logs the error.
   *
   * @async
   * @param {string} category - The category from which the task should be deleted.
   * @param {string} id - The unique identifier of the task to be deleted.
   * @returns {Promise<void>} A promise that resolves when the task is successfully deleted.
   * @throws {Error} If an error occurs during the deletion process, it is caught and logged to the console.
   */
  async deleteTask(category: string, id: string) {
    if (id) {
      const ref = this.getCategoryRef(category);
      try {
        await deleteDoc(doc(ref, id));
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  }

  /**
   * Retrieves the reference for a specific category.
   *
   * This function returns the appropriate reference based on the provided category. It supports categories like
   * 'todo', 'inprogress', 'feedback', and 'done'. If an invalid category is provided, it throws an error.
   *
   * @param {string} category - The category for which the reference is to be retrieved.
   * @returns {FirebaseFirestore.DocumentReference} The reference for the specified category.
   * @throws {Error} If the provided category is invalid, an error is thrown.
   */
  getCategoryRef(category: string) {
    switch (category) {
      case 'todo':
        return this.getToDoRef();
      case 'inprogress':
        return this.getInProgressRef();
      case 'feedback':
        return this.getFeedbackRef();
      case 'done':
        return this.getDoneRef();
      default:
        throw new Error('Invalid category');
    }
  }

  /**
   * Updates a to-do item with new details.
   *
   * This asynchronous function updates the details of a to-do item identified by its `id`. It updates the to-do's
   * title, description, assigned person, due date, priority, category, and subtasks in the database.
   * The function only proceeds with the update if a valid `id` is provided.
   *
   * @async
   * @param {string} id - The unique identifier of the to-do item to be updated.
   * @param {string} newTitle - The new title for the to-do item.
   * @param {string} newDescription - The new description of the to-do item.
   * @param {any} newAssignedTo - The new person to whom the to-do item is assigned.
   * @param {string} newDate - The new due date for the to-do item.
   * @param {string} newPrio - The new priority level for the to-do item.
   * @param {string} newCategory - The new category for the to-do item.
   * @param {any} newSubtasks - The new subtasks associated with the to-do item.
   * @returns {Promise<void>} A promise that resolves when the to-do item is updated in the database.
   */
  async updateTask(
    id: string,
    newTitle: string,
    newDescription: string,
    newAssignedTo: any,
    newDate: string,
    newPrio: string,
    newCategory: string,
    newSubtasks: any
  ) {
    const updateRef = doc(this.getToDoRef(), id);
    if (id) {
      await updateDoc(updateRef, {
        title: newTitle,
        description: newDescription,
        assignedTo: newAssignedTo,
        date: newDate,
        prio: newPrio,
        category: newCategory,
        subtasks: newSubtasks,
      });
    }
  }
}
