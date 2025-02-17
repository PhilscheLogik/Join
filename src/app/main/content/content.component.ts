import { Component, inject } from '@angular/core';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { SummaryComponent } from './summary/summary.component';
import { ContactsComponent } from './contacts/contacts.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../shared/navi/navigation.service';
import { PolicyComponent } from '../../shared/policy/policy.component';
import { ImprintComponent } from '../../shared/imprint/imprint.component';
import { HelpComponent } from '../../shared/help/help.component';

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
    CommonModule,
    PolicyComponent,
    ImprintComponent,
    HelpComponent
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {
  navigationService = inject(NavigationService);

  selectItem(index: number) {
    this.navigationService.setSelectedItem(index);
  }
}
