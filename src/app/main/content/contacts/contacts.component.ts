import { Component } from '@angular/core';
import { Contact } from '../../../interfaces/contact';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  contactList: Contact[] = [
    {
      name: 'Anton Mayer',
      email: 'antonm@gmail.com',
      type: 'contact',
    },
    {
      name: 'Anja Schulz',
      email: 'schulz@hotmail.com',
      type: 'contact',
    },
    {
      name: 'Benedikt Ziegler',
      email: 'benedikt@gmail.com',
      type: 'contact',
    },
    {
      name: 'David Eisenberg',
      email: 'davidberg@gmail.com',
      type: 'contact',
    },
    {
      name: 'Eva Fischer',
      email: 'eva@gmail.com',
      type: 'contact',
    },
    {
      name: 'Emmanuel Mauer',
      email: 'emmanuelma@gmail.com',
      type: 'contact',
    },
  ];
}
