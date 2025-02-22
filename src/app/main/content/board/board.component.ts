import { Component, inject } from '@angular/core';
import { SingleTaskComponent } from './single-task/single-task.component';
import { TaskServiceService } from '../../services/task-service.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Task } from '../../../interfaces/task';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [SingleTaskComponent, CdkDropList, CdkDrag],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  taskService = inject(TaskServiceService);

  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex,
  //     );
  //   }
  // }

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
   * Logs the current state of all task lists for debugging purposes.
   */
  get() {
    console.log(this.taskService.todoList);
    console.log(this.taskService.progressList);
    console.log(this.taskService.feedbackList);
    console.log(this.taskService.doneList);
  }
}
