import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { TaskServiceService } from '../../services/task-service.service';
import { Task } from '../../../interfaces/task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  firestore: Firestore = inject(Firestore);
  taskService = inject(TaskServiceService);

  searchTerm = 'Test';

  get() {
    console.info('-------------- alle Listen ---------------');
    console.log(this.taskService.todoList);
    console.log(this.taskService.progressList);
    console.log(this.taskService.feedbackList);
    console.log(this.taskService.doneList);
  }

  get2() {
    console.info(' ---------------------- gefilterte Listen ---------------------- ');

    console.log(' ---------------------- To do ---------------------- ');
    for(let task of this.filterList(this.taskService.todoList) ) {
      console.log(task?.id, '|', task.title, '|', task.description );
    }
    
    console.log('--------------------- progess ----------------------');
    for(let task of this.filterList(this.taskService.progressList)) {
      console.log(task?.id, '|', task.title, '|', task.description );
    }
    console.log('--------------------- feedback ----------------------');
    for(let task of this.filterList(this.taskService.feedbackList) ) {
      console.log(task?.id, '|', task.title, '|', task.description );
    }

    console.log('--------------------- done ----------------------');
    for(let task of this.filterList(this.taskService.doneList) ) {
      console.log(task?.id, '|', task.title, '|', task.description );
    }    
  }

  filterList(list: Task[]) {
    if (this.searchTerm.trim() == "") {      
      return list;
    } else {
      return list.filter(
        (task) =>
          task.title.includes(this.searchTerm) ||
          task.description?.includes(this.searchTerm)
      );
    }
  }
}
