import { Component, OnInit } from '@angular/core';
import {RecruteurService} from "../../../../services/recruteur/recruteur.service";
import {RecruteurDTO} from "../../../../models/recruteur-dto.model";
import {OffreService} from "../../../../services/offreStage/offreStage";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: RecruteurDTO = new RecruteurDTO();
  isEditing: boolean = false;
  myOffers: any[] = [];
  showMyOffers: boolean = false;

  constructor(private recruteurService: RecruteurService, private offreService : OffreService) {}

  ngOnInit(): void {
    // Récupérer les données utilisateur depuis le local storage
    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
    }
  }

  /**
   * Activer le mode édition
   */
  onEditProfile(): void {
    this.isEditing = true;
  }

  /**
   * Sauvegarder les modifications apportées au profil
   */
  onSaveProfile(): void {
    this.isEditing = false;

    console.log('Updated userData before sending:', this.userData);


    // Appel au service pour mettre à jour les données utilisateur
    this.recruteurService.updateRecruteur(this.userData.id, this.userData).subscribe({
      next: (updatedRecruteur: RecruteurDTO) => {
        // Enregistrer les données mises à jour dans le local storage
        localStorage.setItem('user', JSON.stringify(updatedRecruteur));
        // Mettre à jour les données locales
        this.userData = updatedRecruteur;
        console.log(this.userData)
        alert('Profile updated successfully!');
      },
      error: (err: any) => {
        console.error('Failed to update recruiter profile:', err);
        alert('An error occurred while updating the profile. Please try again.');
      }
    });
  }

  /**
   * Annuler les modifications et restaurer les données originales
   */
  onCancelEdit(): void {
    this.isEditing = false;

    // Recharger les données depuis le local storage
    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
    }
  }

  onShowMyOffers(): void {
    this.offreService.getOffresByRecruteur(this.userData.id).subscribe({
      next: (offers: any[]) => {
        this.myOffers = offers;
        this.showMyOffers = true;
      },
      error: (err: any) => {
        console.error('Error loading offers:', err);
        alert('Une erreur est survenue lors du chargement des offres.');
      }
    });
  }

  onCloseOffersModal(): void {
    this.showMyOffers = false;
  }


}
