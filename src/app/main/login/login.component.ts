import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // isDialogOpen: boolean = false;

  // openDialog(): void {
  //   this.isDialogOpen = true;
  // }

  // closeDialog(): void {
  //   this.isDialogOpen = false;
  // }
}
