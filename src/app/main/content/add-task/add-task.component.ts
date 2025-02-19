import { Component, inject } from '@angular/core';
import { TaskServiceService } from '../../services/task-service.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  taskService = inject(TaskServiceService);

  test() {
    console.log(this.taskService.taskList);
  }

  prio = 'medium';

  constructor() {}

  setPriority(status: string) {
    this.prio = status;
  }
}
