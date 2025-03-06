import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { ContentComponent } from './content/content.component';
import { SignupComponent } from './login/signup/signup.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [LoginComponent, ContentComponent, SignupComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
