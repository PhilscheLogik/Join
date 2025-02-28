import { Component, inject } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

import { TaskServiceService } from '../../services/task-service.service';
import { Task } from '../../../interfaces/task';
import { SingleTaskComponent } from './single-task/single-task.component';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from '../add-task/add-task.component';
import { NavigationService } from '../../../shared/navi/navigation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    SingleTaskComponent,
    CdkDropList,
    CdkDrag,
    CommonModule,
    AddTaskComponent,
    FormsModule,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  /** Injected services */
  taskService = inject(TaskServiceService);
  naviService = inject(NavigationService);

  /** Local component states */
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  isOverlayOpen = false;
  isTaskOverlayOpen = false;

  /** Text according to which the lists are filtered */
  searchTerm = '';

  /** Auxiliary variable for filtering after the search button has been clicked */
  searchText = '';

  /**
   * Sets the task type in the task service.
   * @param {string} type - The type of the task.
   */
  setType(type: string) {
    this.taskService.whatIsTheType = type;
  }

  /**
   * Toggles the visibility of the task overlay.
   */
  toggleTaskOverlay() {
    this.isTaskOverlayOpen = !this.isTaskOverlayOpen;
  }

  /**
   * Opens the task overlay for a specific task.
   * @param {Task} task - The task to be displayed in the overlay.
   */
  openOverlay(task: Task) {
    this.selectedTask = task;
    this.isOverlayOpen = true;
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
    } else {
      const task: Task = event.previousContainer.data[event.previousIndex];
      const previousCategory = this.getCategoryFromContainer(
        event.previousContainer
      );
      const newCategory = this.getCategoryFromContainer(event.container);

      console.info('----- selected Task Board TS -------');
      console.log(task);
      console.log('Wo soll es hin: ', newCategory);

      await this.taskService.addTask(newCategory, task);

      if (task.id) {
        console.log('Woher kam es: ', previousCategory);
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
   * Logs the current state of all task lists for debugging purposes.
   */
  logTaskLists() {
    console.log('Todo:', this.taskService.todoList);
    console.log('In Progress:', this.taskService.progressList);
    console.log('Feedback:', this.taskService.feedbackList);
    console.log('Done:', this.taskService.doneList);
  }

  filterList(list: Task[]) {
    if (this.searchTerm.trim() == '') {
      return list;
    } else {
      return list.filter(
        (task) =>
          task.title.includes(this.searchTerm) ||
          task.description?.includes(this.searchTerm)
      );
    }
  }

  startSearch() {
    this.searchTerm = this.searchText;
  }
}

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
