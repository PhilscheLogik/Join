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

      // Füge die Aufgabe zur neuen Kategorie in der Datenbank hinzu
      await this.taskService.addTask(newCategory, task);

      // Entferne die Aufgabe aus der vorherigen Kategorie in der Datenbank
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

  getCategoryFromContainer(container: CdkDropList): string {
    if (container.data === this.taskService.todoList) return 'todo';
    if (container.data === this.taskService.progressList) return 'inprogress';
    if (container.data === this.taskService.feedbackList) return 'feedback';
    if (container.data === this.taskService.doneList) return 'done';
    return '';
  }

  get() {
    console.log(this.taskService.todoList);
    console.log(this.taskService.progressList);
    console.log(this.taskService.feedbackList);
    console.log(this.taskService.doneList);
  }
}
