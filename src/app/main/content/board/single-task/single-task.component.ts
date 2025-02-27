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

@Component({
  selector: 'app-single-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-task.component.html',
  styleUrl: './single-task.component.scss',
})
export class SingleTaskComponent {
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  isOverlayOpen = false;
  selectedContacts: any[] = [];

  @Input() task!: Task;

  constructor(
    private taskService: TaskServiceService,
    public contactService: ContactsService
  ) {
    this.tasks = this.taskService.todoList;
  }

  openOverlay(task: Task) {
    this.selectedTask = task;
    this.isOverlayOpen = true;
  }

  closeOverlay() {
    this.isOverlayOpen = false;
  }

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
      // console.log(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task: Task = event.previousContainer.data[event.previousIndex];
      const previousCategory = this.getCategoryFromContainer(
        event.previousContainer
      );
      const newCategory = this.getCategoryFromContainer(event.container);

      console.info('----- selected Task Board TS -------');
      console.log(task);
      console.log('Wo soll es hin: ', newCategory);

      /**
       * Adds the task to the new category in the database.
       * This ensures that the task is properly stored under its new status.
       *
       * @param {string} newCategory - The category to which the task is being moved.
       * @param {Task} task - The task being updated.
       */
      await this.taskService.addTask(newCategory, task);

      /**
       * Removes the task from its previous category in the database.
       * This prevents duplicate tasks from appearing across different categories.
       *
       * @param {string} previousCategory - The category from which the task is being removed.
       * @param {string} task.id - The unique identifier of the task.
       */
      if (task.id) {
        console.log('Woher kam es: ', previousCategory);
        await this.taskService.deleteTask(previousCategory, task.id);
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
  
  toggleSubtaskCompleted(subtask: any) {
    subtask.IsCompleted = !subtask.IsCompleted;
    // this.taskService.updateTask(this.selectedTask.id, this.selectedTask);
  }

  /**
 * Calculates the completion percentage of subtasks for the current task.
 * Returns 0 if there are no subtasks or if the subtasks array is undefined.
 *
 * @returns {number} The percentage of completed subtasks (0 to 100).
 */
  getSubtasksProgress(): number {
    const subtasks = this.task.subtasks;
    // Check if subtasks is undefined, not an array, or empty
    if (!subtasks || !Array.isArray(subtasks) || subtasks.length === 0) {
      return 0;
    }
    // Now safe to use filter since we confirmed it's an array
    const completedCount = subtasks.filter(subtask => subtask && subtask.IsCompleted === true).length;
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
  return this.task.subtasks.filter(subtask => subtask.IsCompleted === true).length;
}

}



// test() {
//   console.log(this.taskService.taskList);
// }

// getSub(sub: any) {
//   console.log("Ergebnis: ", sub);
// }
