import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { TaskServiceService } from '../../services/task-service.service';
import { NavigationService } from '../../../shared/navi/navigation.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  firestore: Firestore = inject(Firestore);
  taskService = inject(TaskServiceService);
  navigationService = inject(NavigationService);
  authService = inject(AuthService);

  dateDeadline = '2100-12-31';

  getGreeting(username = '') {
    const now = new Date();
    const hour = now.getHours();
    let greeting = '';

    if (hour >= 6 && hour < 12) {
      greeting = 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
      greeting = 'Good day';
    } else if (hour >= 18 && hour < 22) {
      greeting = 'Good evening';
    } else {
      greeting = 'Welcome';
    }
    return greeting;
  }

  countUrgentTasks(): number {
    let sum = 0;
    let toDoUrgent = this.taskService.todoList?.filter(
      (item) => item.prio === 'Urgent'
    );
    let progressUrgent = this.taskService.progressList?.filter(
      (item) => item.prio === 'Urgent'
    );
    let feedbackUrgent = this.taskService.feedbackList?.filter(
      (item) => item.prio === 'Urgent'
    );

    this.dateDeadline = '2100-12-31';
    this.findNextDeadline(toDoUrgent);
    this.findNextDeadline(progressUrgent);
    this.findNextDeadline(feedbackUrgent);

    sum += toDoUrgent.length ?? 0;
    sum += progressUrgent.length ?? 0;
    sum += feedbackUrgent.length ?? 0;
    return sum;
  }

  findNextDeadline(array: any) {
    if (!array || array.length === 0) {
      return;
    }

    array.forEach((item: { date: string }) => {
      if (this.getDeadlineDate() > new Date(item.date)) {
        this.dateDeadline = String(item.date);
      }
    });
  }

  getDeadlineDate() {
    return new Date(this.dateDeadline);
  }
}
