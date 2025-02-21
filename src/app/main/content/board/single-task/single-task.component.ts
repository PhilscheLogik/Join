import { Component, inject } from '@angular/core';
import { TaskServiceService } from '../../../services/task-service.service';
import { Task } from '../../../../interfaces/task';

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
}
// test() {
//   console.log(this.taskService.taskList);
// }
