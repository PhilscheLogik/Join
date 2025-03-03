import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

import { TaskServiceService } from '../../../services/task-service.service';
import { ContactsService } from '../../../services/contacts.service';
import { Task } from '../../../../interfaces/task';
import { AddTaskComponent } from '../../add-task/add-task.component';

@Component({
  selector: 'app-single-task',
  standalone: true,
  imports: [CommonModule, AddTaskComponent],
  templateUrl: './single-task.component.html',
  styleUrl: './single-task.component.scss',
})
export class SingleTaskComponent {


  @Input() task!: Task;

  tasks: Task[] = [];
  selectedTask: Task | null = null;
  isOverlayOpen = false;
  isClosing = false;
  selectedContacts: any[] = [];

  constructor(
    public taskService: TaskServiceService,
    public contactService: ContactsService
  ) {
    this.tasks = this.taskService.todoList;
  }


  // ### EDIT
  editTaskActivated(task: Task | null) {
    this.taskService.isEditModeActivated = true;
    if(task && task.id){
      this.taskService.selectedTaskId = task.id;
      this.taskService.selectedTaskCategory = task?.category;
    }
    console.log(task);    
  }

  /**
   * Opens the overlay for a specific task.
   * @param {Task} task - The task to be displayed in the overlay.
   */
  openOverlay(task: Task) {
    this.selectedTask = task;
    this.isOverlayOpen = true;
    this.isClosing = false;
  }

  /**
   * Closes the overlay with a short animation.
   */
  closeOverlay() {
    this.isClosing = true;

    // ### EDIT
    this.taskService.isEditModeActivated = false
    setTimeout(() => {
      this.isOverlayOpen = false;
      this.isClosing = false;
    }, 300);
  }

  /**
   * Deletes a task if it has a valid ID.
   * @param {Task | null} task - The task to be deleted, or null if no task is provided.
   */
  deleteTask(task: Task | null) {
    if (task?.id) {
      this.taskService.deleteTask(this.taskService.whatIsTheType, task.id);
    }
  }

  // Aktualisiere die lokalen Arrays
  // transferArrayItem(
  //   event.previousContainer.data,
  //   event.container.data,
  //   event.previousIndex,
  //   event.currentIndex
  // );

  // console.log(
  //   event.previousContainer.data,
  //   event.container.data,
  //   event.previousIndex,
  //   event.currentIndex,
  // );

  /**
   * Handles the drag-and-drop functionality for tasks.
   * Moves items within the same list or transfers them between different lists.
   *
   * @param {CdkDragDrop<Task[]>} event - The drag-and-drop event containing task data.
   */
  async drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task: Task = event.previousContainer.data[event.previousIndex];
      const previousCategory = this.getCategoryFromContainer(
        event.previousContainer
      );
      const newCategory = this.getCategoryFromContainer(event.container);

      await this.taskService.addTask(newCategory, task);

      if (task.id) {
        await this.taskService.deleteTask(previousCategory, task.id);
      }
    }
  }

  /**
   * Determines the category of a task based on the provided drop list container.
   *
   * @param {CdkDropList} container - The drag-and-drop container.
   * @returns {string} - The category of the task.
   */
  getCategoryFromContainer(container: CdkDropList): string {
    if (container.data === this.taskService.todoList) return 'todo';
    if (container.data === this.taskService.progressList) return 'inprogress';
    if (container.data === this.taskService.feedbackList) return 'feedback';
    if (container.data === this.taskService.doneList) return 'done';
    return '';
  }

  /**
 * getSubtaskLength()
 * 
 * This method safely returns the length of the `subtasks` array associated with the current `task`.
 * It checks whether `task.subtasks` is an actual array using `Array.isArray()`. If it is, it returns 
 * the length of the `subtasks` array. If `task.subtasks` is not an array (or is `null`/`undefined`), 
 * it returns `0` to avoid any errors.
 * 
 * This is useful to safely handle cases where `subtasks` may be `null`, `undefined`, or not an array, 
 * ensuring that the code works as expected without throwing errors.
 * 
 * @returns {number} - The number of subtasks. Returns `0` if `task.subtasks` is not a valid array.
 */
  getSubtaskLength(): number {
    return Array.isArray(this.task.subtasks) ? this.task.subtasks.length : 0;
  }

  /**
   * Toggles the completion status of a subtask.
   * @param {any} subtask - The subtask to toggle.
   */
  toggleSubtaskCompleted(subtask: any) {
    subtask.IsCompleted = !subtask.IsCompleted;
  }

  /**
   * Calculates the completion percentage of subtasks for the current task.
   * Returns 0 if there are no subtasks or if the subtasks array is undefined.
   *
   * @returns {number} The percentage of completed subtasks (0 to 100).
   */
  getSubtasksProgress(): number {
    const subtasks = this.task.subtasks;
    if (!subtasks || !Array.isArray(subtasks) || subtasks.length === 0) {
      return 0;
    }
    const completedCount = subtasks.filter(
      (subtask) => subtask && subtask.IsCompleted === true
    ).length;
    return (completedCount / subtasks.length) * 100;
  }

  /**
   * Counts the number of completed subtasks for the current task.
   * Returns 0 if there are no subtasks or if the subtasks array is undefined.
   *
   * @returns {number} The number of subtasks marked as completed.
   */
  getCompletedSubtasksCount(): number {
    if (!this.task.subtasks || this.task.subtasks.length === 0) {
      return 0;
    }
    
    return this.task.subtasks.filter((subtask) => subtask.IsCompleted === true)
      .length;
  }


  /**
   * Retrieves the first three assigned contacts for a given task.
   * Ensures that only a maximum of three participants are shown.
   *
   * @param {any} task - The task object containing the assigned participants.
   * @returns {any[]} An array containing up to the first three assigned contacts.
   */
  getVisibleContacts(task: any): any[] {
    return task.assignedTo.slice(0, 3);
  }

  /**
   * Calculates the number of hidden assigned contacts that exceed the visible limit.
   * If more than three participants are assigned, it returns the count of hidden participants.
   *
   * @param {any} task - The task object containing the assigned participants.
   * @returns {number} The number of hidden assigned participants (if more than three exist).
   */
  getHiddenCount(task: any): number {
    return task.assignedTo.length > 3 ? task.assignedTo.length - 3 : 0;
  }

  /**
   * Finds the index of a contact in the full contact list based on the contact's email.
   *
   * @param {Object} contact - The contact whose index is to be found.
   * @param {string} contact.email - The email address of the contact to search for.
   * @returns {number} - Returns the index of the contact in the contact list, or `-1` if the contact is not found.
   */
  getIndexInFullList(contact: any): number {
    return this.contactService.contactList.findIndex(
      (c) => c.email === contact.email
    );
  }

  /**
   * Debugging function that logs task information to the console.
   * @param {Task | null} arg0 - The task to be logged, or null if no task is provided.
   */
  getTest(arg0: Task | null) {
    console.log(arg0);
    console.log('--------------');
    console.log(this.taskService.whatIsTheType);
  }
}