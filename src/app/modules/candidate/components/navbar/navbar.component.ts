import { Component } from '@angular/core';
import {CandidatService} from "../../../../services/candidat/candidat.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  public connected: boolean = false;
  public userString: string | null;
  constructor(private authService:AuthService , private router: Router) {
    this.userString = localStorage.getItem('user');
    if (this.userString) {
      this.connected = true;
    }
  }
  logout() {
    console.log('appell a la fonction logout()')
    this.authService.logout();
  }
  showLoginPopup: boolean = false;

  openLoginPopup(): void {
    this.showLoginPopup = true;
  }

  closeLoginPopup(): void {
    this.showLoginPopup = false;
  }

  login() {
    this.openLoginPopup(); // Redirigez vers la page de connexion
  }
}
