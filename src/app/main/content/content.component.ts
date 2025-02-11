import { Component } from '@angular/core';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { SummaryComponent } from './summary/summary.component';
import { ContactsComponent } from './contacts/contacts.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    SummaryComponent,
    AddTaskComponent,
    BoardComponent,
    ContactsComponent,
    FooterComponent,
    HeaderComponent,
    ContactsComponent,
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {}
