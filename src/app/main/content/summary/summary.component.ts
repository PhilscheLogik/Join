import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { TaskServiceService } from '../../services/task-service.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  firestore: Firestore = inject(Firestore);
  taskService = inject(TaskServiceService);

  get() {
    console.log(this.taskService.todoList);
    console.log(this.taskService.progressList);
    console.log(this.taskService.feedbackList);
    console.log(this.taskService.doneList);
  }

  get2() {
    
    console.log(this.taskService.todoList);
    console.log(this.taskService.progressList);
    console.log(this.taskService.feedbackList);
    console.log(this.taskService.doneList);
  }
}
