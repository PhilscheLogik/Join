import { Component, inject } from '@angular/core';
import { TaskServiceService } from '../../../services/task-service.service';

@Component({
  selector: 'app-single-task',
  standalone: true,
  imports: [],
  templateUrl: './single-task.component.html',
  styleUrl: './single-task.component.scss'
})
export class SingleTaskComponent {
  taskService = inject(TaskServiceService);
  
    // test() {
    //   console.log(this.taskService.taskList);
    // }

}
