import { Component, inject } from '@angular/core';
import { SingleTaskComponent } from './single-task/single-task.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [SingleTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  

}
