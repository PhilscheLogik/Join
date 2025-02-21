import { Component, inject } from '@angular/core';
import { TaskServiceService } from '../../services/task-service.service';
import { ContactsService } from '../../services/contacts.service';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  firestore: Firestore = inject(Firestore);
  taskService = inject(TaskServiceService);
  contactService = inject(ContactsService);

  toDo = [];

  test() {
    console.log(this.contactService.contactList);
  }

  prio = 'medium';

  constructor() {}

  setPriority(status: string) {
    this.prio = status;
  }

  getIndexInFullList(contact: any): number {
    return this.contactService.contactList.findIndex(
      (c) => c.email === contact.email
    );
  }


  /*new */
  newSubtask: string = '';
  subtasks: { text: string; isEditing: boolean }[] = [{ text:'Taste Esc suchen',isEditing: false }, { text:'Schuhe zubinden',isEditing: false },];
  isEditing: boolean = false;

  startEditing() {
    this.isEditing = true;
  }

  // stopEditing() {
  //   this.isEditing = false;
  // }

  cancelEditing() {
    this.isEditing = false;
    this.newSubtask = '';
  }

  addSubtask() {
    if (this.newSubtask.trim()) {
      this.subtasks.push({ text: this.newSubtask, isEditing: false });
    }
    this.cancelEditing();
  }

  deleteSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  editSubtask(index: number) {
    this.subtasks[index].isEditing = true;
  }

  saveEdit(index: number) {
    if (!this.subtasks[index].text.trim()) {
      this.subtasks[index].text = this.subtasks[index].text;
    }
    this.subtasks[index].isEditing = false;
  }
}



