import { Component, inject } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { ContentComponent } from './content/content.component';
import { SignupComponent } from './login/signup/signup.component';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../shared/navi/navigation.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [LoginComponent, ContentComponent, SignupComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  navigationService = inject(NavigationService);
}
