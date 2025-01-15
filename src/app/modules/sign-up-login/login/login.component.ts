import {Component} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../../services/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent {
  email = ''; // Modèle pour l'email
  password = ''; // Modèle pour le mot de passe
  errorMessage = ''; // Message d'erreur en cas de problème
  isLoading = false; // Indicateur pour l'état de chargement

  isPopupVisible: boolean = true;

  closePopup(): void {
    this.isPopupVisible = false;
  }

  constructor(private authService: AuthService, private router: Router) {}
  isSignupVisible: boolean = false; // Par défaut, affiche le formulaire de connexion
  toggleSignup(): void {
    this.isSignupVisible = !this.isSignupVisible;
  }


  login(): void {
    // Vérifier si les champs sont remplis
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Appel au service Auth pour le login
    this.authService.login(this.email, this.password).subscribe({
       next: (response) => {
         console.log(response);
         // Stocker les tokens dans le localStorage
         localStorage.setItem('access_token', response.access_token);
         localStorage.setItem('refresh_token', response.refresh_token);
         localStorage.setItem('user', JSON.stringify(response.user)); // Convertir l'objet en JSON


         // @ts-ignore
         const role = response.user['role']; // Assurez-vous que le rôle est inclus dans l'objet utilisateur
         if (role === 'CANDIDAT') {
           console.log('un candidat est connecté et sera rediriger ')
           this.router.navigate(['/candidate/dashboard']);
         } else if (role === 'RECRUTEUR') {
           console.log('un recruteur est connecté et sera rediriger ')
            this.router.navigate(['/recruiter/dashboard']);
         }
       },
       error: (error) => {
         // Gérer les erreurs (par exemple, mauvais identifiants)
         this.errorMessage = 'Incorrect username or password.';
         this.isLoading = false;
         console.error('Erreur lors de la connexion :', error);
       },
       complete: () => {
         this.isLoading = false;
       },
     });
   }
  }

