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

  todoList: Task[] = [];
  progressList: Task[] = [];
  feedbackList: Task[] = [];
  doneList: Task[] = [];

  unsubToDo;
  unsubInProgress;
  unsubFeedback;
  unsubDone;

  /**
   * Initializes the class by subscribing to Firestore collections.
   * Sets up real-time listeners for the "todo", "inprogress", "feedback", and "done" lists.
   */
  constructor() {
    this.unsubToDo = this.subToDoList();
    this.unsubInProgress = this.subInProgressList();
    this.unsubFeedback = this.subFeedbackList();
    this.unsubDone = this.subDoneList();
  }

  /**
   * Lifecycle hook that is called when the component is about to be destroyed.
   * It unsubscribes from all active subscriptions to prevent memory leaks.
   *
   * This method calls the following unsubscribe methods:
   * - unsubToDo(): Unsubscribes from the "ToDo" subscription.
   * - unsubInProgress(): Unsubscribes from the "InProgress" subscription.
   * - unsubFeedback(): Unsubscribes from the "Feedback" subscription.
   * - unsubDone(): Unsubscribes from the "Done" subscription.
   *
   * @returns {void}
   */
  ngOnDestroy() {
    this.unsubToDo();
    this.unsubInProgress();
    this.unsubFeedback();
    this.unsubDone();
  }

  /**
   * Subscribes to the "ToDo" list in Firestore and updates the local `todoList` array.
   * This method listens for real-time updates and processes the data accordingly.
   *
   * It fetches the "ToDo" reference from Firestore, then listens for changes.
   * Upon receiving new data, it clears the current `todoList` and populates it
   * with updated items by calling `setObj` on each document.
   *
   * @returns {Function} A function that can be used to unsubscribe from the snapshot listener.
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
   * Subscribes to the "InProgress" list in Firestore and updates the local `progressList` array.
   * This method listens for real-time updates and processes the data accordingly.
   *
   * It fetches the "InProgress" reference from Firestore, then listens for changes.
   * Upon receiving new data, it clears the current `progressList` and populates it
   * with updated items by calling `setObj` on each document.
   *
   * @returns {Function} A function that can be used to unsubscribe from the snapshot listener.
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
   * Subscribes to the "Feedback" list in Firestore and updates the local `feedbackList` array.
   * This method listens for real-time updates and processes the data accordingly.
   *
   * It fetches the "Feedback" reference from Firestore, then listens for changes.
   * Upon receiving new data, it clears the current `feedbackList` and populates it
   * with updated items by calling `setObj` on each document.
   *
   * @returns {Function} A function that can be used to unsubscribe from the snapshot listener.
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
   * Gets a reference to the "todo" collection in Firestore.
   *
   * @returns {CollectionReference} Reference to the "todo" collection.
   */
  getToDoRef() {
    return collection(this.firestore, 'todo');
  }

  /**
   * Gets a reference to the "inprogress" collection in Firestore.
   *
   * @returns {CollectionReference} Reference to the "inprogress" collection.
   */
  getInProgressRef() {
    return collection(this.firestore, 'inprogress');
  }

  /**
   * Gets a reference to the "feedback" collection in Firestore.
   *
   * @returns {CollectionReference} Reference to the "feedback" collection.
   */
  getFeedbackRef() {
    return collection(this.firestore, 'feedback');
  }

  /**
   * Gets a reference to the "done" collection in Firestore.
   *
   * @returns {CollectionReference} Reference to the "done" collection.
   */
  getDoneRef() {
    return collection(this.firestore, 'done');
  }

  /**
   * Converts Firestore document data to a Task object.
   * @param {any} obj - Firestore document data.
   * @param {string} id - Document ID.
   * @returns {Task} - Converted task object.
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
   * Adds a new task to the specified category in Firestore.
   *
   * @param {string} category - The category to which the task should be added.
   * @param {Task} task - The task object to be added.
   * @returns {Promise<void>} A promise that resolves when the task is successfully added.
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
   * Deletes a task from the specified category in Firestore.
   *
   * @param {string} category - The category from which the task should be deleted.
   * @param {string} id - The ID of the task to be deleted.
   * @returns {Promise<void>} A promise that resolves when the task is successfully deleted.
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
   * Returns a Firestore collection reference based on the given category.
   *
   * @param {string} category - The category for which to retrieve the collection reference.
   * @returns {CollectionReference} The Firestore collection reference corresponding to the category.
   * @throws {Error} Throws an error if the category is invalid.
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
   * Updates an existing contact in the "todo" collection in Firestore.
   *
   * @param {string} id - The ID of the contact to update.
   * @param {string} newTitle - The updated title of the contact.
   * @param {string} newDescription - The updated description of the contact.
   * @param {any} newAssignedTo - The updated assignee(s) of the contact.
   * @param {string} newDate - The updated due date of the contact.
   * @param {string} newPrio - The updated priority level of the contact.
   * @param {string} newCategory - The updated category of the contact.
   * @param {any} newSubtasks - The updated subtasks for the contact.
   * @returns {Promise<void>} A promise that resolves when the contact is successfully updated.
   */
  async updateContact(
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
