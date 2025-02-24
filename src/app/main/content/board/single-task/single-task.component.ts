import { Component, inject, Input } from '@angular/core';
import { TaskServiceService } from '../../../services/task-service.service';
import { Task } from '../../../../interfaces/task';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-single-task',
  standalone: true,
  imports: [],
  templateUrl: './single-task.component.html',
  styleUrl: './single-task.component.scss',
})

export class SingleTaskComponent {
  private taskService = inject(TaskServiceService);
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  isOverlayOpen: boolean = false;

  @Input() task!: Task;

  constructor() {
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
}
// test() {
//   console.log(this.taskService.taskList);
// }
