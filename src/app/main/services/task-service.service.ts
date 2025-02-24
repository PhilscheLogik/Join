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

  constructor() {
    this.unsubToDo = this.subToDoList();
    this.unsubInProgress = this.subInProgressList();
    this.unsubFeedback = this.subFeedbackList();
    this.unsubDone = this.subDoneList();
  }

  /**
   * Cleans up Firestore subscriptions when the service is destroyed.
   */
  ngOnDestroy() {
    this.unsubToDo();
    this.unsubInProgress();
    this.unsubFeedback();
    this.unsubDone();
  }

  /**
   * Subscribes to Firestore "todo" tasks collection and updates `todoList`.
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
   * Subscribes to Firestore "inprogress" tasks collection and updates `progressList`.
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
   * Subscribes to Firestore "feedback" tasks collection and updates `feedbackList`.
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
   * Subscribes to Firestore "done" tasks collection and updates `doneList`.
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
   * Returns the Firestore collection reference for "todo" tasks.
   */
  getToDoRef() {
    return collection(this.firestore, 'todo');
  }

  /**
   * Returns the Firestore collection reference for "inprogress" tasks.
   */
  getInProgressRef() {
    return collection(this.firestore, 'inprogress');
  }

  /**
   * Returns the Firestore collection reference for "feedback" tasks.
   */
  getFeedbackRef() {
    return collection(this.firestore, 'feedback');
  }

  /**
   * Returns the Firestore collection reference for "done" tasks.
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
   * Adds a new task to Firestore under the specified category.
   * @param {string} category - The category to which the task belongs.
   * @param {Task} task - The task to add.
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
   * Deletes a task from Firestore under the specified category.
   * @param {string} category - The category from which to delete the task.
   * @param {string} id - The task ID.
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
   * Returns the Firestore collection reference for the given category.
   * @param {string} category - The category name.
   * @returns {CollectionReference} - Firestore collection reference.
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
   * Updates an existing task in Firestore.
   * @param {string} id - The task ID.
   * @param {string} newTitle - Updated task title.
   * @param {string} newDescription - Updated task description.
   * @param {any} newAssignedTo - Updated assignee(s).
   * @param {string} newDate - Updated due date.
   * @param {string} newPrio - Updated priority.
   * @param {string} newCategory - Updated category.
   * @param {any} newSubtasks - Updated subtasks.
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
