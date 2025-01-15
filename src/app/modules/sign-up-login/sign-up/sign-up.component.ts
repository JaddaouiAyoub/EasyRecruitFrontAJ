import { Component } from '@angular/core';
import { RecruteurDTO } from "../../../models/recruteur-dto.model";
import { Role } from "../../../models/role.enum";
import { CandidatDTO } from "../../../models/candidat-dto.model";
import { CandidatService } from "../../../services/candidat/candidat.service";
import { RecruteurService } from "../../../services/recruteur/recruteur.service";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import {map, Observable} from "rxjs";
import {AuthService} from "../../../services/auth/auth.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  constructor(
    private candidatService: CandidatService,
    private recruteurService: RecruteurService,
    private router: Router,
    private http: HttpClient,
    private authService : AuthService
  ) {}

  errorMessage = '';
  successMessage = '';
  submitted = false;

  formData = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
    companyName: '',
    industry: '',
    linkedin: '',
    profilPic: '',  // Ajout de l'image de profil
  };

  isRecruiter = false;
  isCandidat = false;


  onRoleChange() {
    this.isRecruiter = this.formData.role === 'RECRUTEUR';
    this.isCandidat = this.formData.role === 'CANDIDAT';
  }


  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadPhoto(file).subscribe({
        next: (url: string) => {
          console.log('Uploaded Image URL:', url);
          this.formData.profilPic = url;// Assigner l'URL de l'image à formData
          console.log("profil :" + this.formData.profilPic)
        },
        error: err => console.error('Image upload failed', err)
      });
    }
  }


  uploadPhoto(photo: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', photo);
    formData.append('upload_preset', 'slnp8xy4');

    return this.http.post<any>(`https://api.cloudinary.com/v1_1/dkv5rbnf6/image/upload`, formData).pipe(
      map(response => {
        console.log('Response:', response); // Log the full response
        return response?.secure_url; // Return secure URL
      })
    );
  }


  onSubmit() {
    this.submitted = true;

    if (!this.validateForm()) {
      alert('Please fill all required fields correctly.');
      this.submitted = false;
      return;
    }

    const { email, password, role, username, firstName, lastName, phoneNumber, profilPic, companyName, linkedin } = this.formData;

    if (role === 'CANDIDAT') {
      const candidat: CandidatDTO = {
        id: null,
        email,
        password,
        role: Role.CANDIDAT,
        cvUrl: '',
        username,
        firstName,
        lastName,
        phoneNumber,
        linkedin,
        profilPic, // Envoi de l'URL de l'image

      };

      this.candidatService.createCandidat(candidat).subscribe({
        next: (response) => {
          // console.log('Candidat créé avec succès', response) ;
          alert('Your account has been created successfully. Welcome to the platform!');
          this.delayedAuthenticate(username, password); // Connexion et redirection
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.submitted = false;
        },
      });
    } else if (role === 'RECRUTEUR') {
      const recruteur: RecruteurDTO = {
        id: null,
        email,
        password,
        role: Role.RECRUTEUR,
        companyName,
        username,
        firstName,
        lastName,
        phoneNumber,
        profilPic, // Envoi de l'URL de l'image
      };

      this.recruteurService.createRecruteur(recruteur).subscribe({
        next: (response) => {
          // console.log('Recruteur créé avec succès', response);
          alert('Your account has been created successfully. Welcome to the platform!');
          this.delayedAuthenticate(username, password); // Connexion et redirection
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.submitted = false;
        },
      });
    }

    this.submitted = false;
  }


  validateForm(): boolean {
    const { firstName, lastName, username, email, phoneNumber, password, confirmPassword, role, industry } = this.formData;

    if (!firstName || !lastName || !username || !email || !phoneNumber || !password || !confirmPassword || !role || !industry) {
      return false;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return false;
    }

    if (!['CANDIDAT', 'RECRUTEUR'].includes(role)) {
      alert('Invalid role selected.');
      return false;
    }

    return true;
  }


  private authenticateAndRedirect(email: string, password: string): void {
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Connexion réussie', response);

        // Stocker les tokens dans le localStorage
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // @ts-ignore
        const role = response.user['role']; // Assurez-vous que le rôle est inclus dans l'objet utilisateur
        if (role === 'CANDIDAT') {
          console.log('Un candidat est connecté, redirection...');
          this.router.navigate(['/candidate/dashboard']);
        } else if (role === 'RECRUTEUR') {
          console.log('Un recruteur est connecté, redirection...');
          this.router.navigate(['/recruiter/dashboard']);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la connexion :', error);
        this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
      },
    });
  }

  // Ajouter une méthode qui inclut un délai avant d'appeler `authenticateAndRedirect`
  private delayedAuthenticate(email: string, password: string): void {
    const delayInMilliseconds = 1000; // Ajouter un délai d'une seconde
    setTimeout(() => {
      this.authenticateAndRedirect(email, password);
    }, delayInMilliseconds);
  }

}
