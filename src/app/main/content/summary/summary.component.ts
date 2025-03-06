import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { TaskServiceService } from '../../services/task-service.service';
import { Task } from '../../../interfaces/task';

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
}
