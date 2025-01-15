import { Component } from '@angular/core';

@Component({
  selector: 'app-signup-section',
  templateUrl: './signup-section.component.html',
  styleUrls: ['./signup-section.component.css']
})
export class SignupSectionComponent {
  title: string = 'Start your Career today by signing up now!';
  description: string = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';
  buttonText: string = 'Signup now!';
  registerLink: string = '/signup';
}
