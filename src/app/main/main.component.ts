import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { ContentComponent } from './content/content.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [LoginComponent, ContentComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
