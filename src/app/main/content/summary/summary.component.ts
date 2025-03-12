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
  hideRight = false;

  /**
   * Returns a greeting message based on the current time of day.
   *
   * - "Good Morning" for hours between 6 and 11:59.
   * - "Good day" for hours between 12 and 17:59.
   * - "Good evening" for hours between 18 and 21:59.
   * - "Welcome" for all other hours (late night/early morning).
   *
   * @returns {string} A greeting message corresponding to the current time.
   */
  getGreeting() {
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

  /**
   * Counts the total number of tasks with "Urgent" priority across different task lists
   * and finds the earliest deadline date among them.
   *
   * Task lists considered:
   * - To-do list
   * - In-progress list
   * - Feedback list
   *
   * The function updates the `dateDeadline` property with the closest upcoming deadline.
   *
   * @returns {number} The total count of urgent tasks across all lists.
   */
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
    this.dateDeadline = '3000-12-31';
    this.findNextDeadline(toDoUrgent);
    this.findNextDeadline(progressUrgent);
    this.findNextDeadline(feedbackUrgent);
    sum += toDoUrgent.length ?? 0;
    sum += progressUrgent.length ?? 0;
    sum += feedbackUrgent.length ?? 0;
    return sum;
  }

  /**
   * Finds the earliest deadline date in a given array of tasks and updates the `dateDeadline`.
   *
   * @param {any[]} array - The array of tasks to check for deadlines.
   */
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

  /**
   * Converts the current deadline string to a Date object.
   *
   * @returns {Date} The current deadline as a Date object.
   */
  getDeadlineDate() {
    return new Date(this.dateDeadline);
  }
}
