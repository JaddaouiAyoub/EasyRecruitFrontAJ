import { Component, OnInit } from '@angular/core';
import { CandidatService } from '../../../../services/candidat/candidat.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AuthService} from "../../../../services/auth/auth.service";
import {CandidatureService} from "../../../../services/candidature/candidature.service";
import {CandidatureDTO} from "../../../../models/candidature-dto.model";
import {OffreStageDTO} from "../../../../models/offre-stage-dto.model";
import {OffreService} from "../../../../services/offreStage/offreStage";

@Component({
  selector: 'app-application-tracking',
  templateUrl: './application-tracking.component.html',
  styleUrls: ['./application-tracking.component.css'],
})
export class ApplicationTrackingComponent implements OnInit {
  candidatures: CandidatureDTO[] = [];
  isLoading: boolean = false;
  candidatId: number = 0;
  private userData: any;
  constructor(private candidatureService: CandidatureService,private offreService:OffreService, private snackBar: MatSnackBar ,private authService: AuthService ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
      this.candidatId=this.userData.id;
    }
    this.loadCandidatures();
  }
  // loadCandidatures(): void {
  //   this.isLoading = true;
  //   setTimeout(() => {
  //     this.candidatures = [
  //       {
  //         id: 1,
  //         offreTitre: 'Stage PFE Rémunéré pour Développeur Typescript React',
  //         company: 'MyResa',
  //         location: 'Casablanca',
  //         offreId: 101,
  //       },
  //       {
  //         id: 2,
  //         offreTitre: 'Offre de Stage en Développement Web',
  //         company: 'Hello World',
  //         location: 'Marrakech',
  //         offreId: 102,
  //       },
  //     ];
  //     this.isLoading = false;
  //   }, 1000); // Simulates loading delay
  // }


  // Charger les candidatures de l'utilisateur connecté
  loadCandidatures(): void {
    this.isLoading = true;
    this.candidatureService.getCandidaturesByCandidat(this.candidatId).subscribe({
      next: (candidatures: CandidatureDTO[]) => {
        this.candidatures = candidatures;
        this.fillOffreDetails();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des candidatures :', err);
        this.snackBar.open('Erreur lors du chargement des candidatures.', 'Fermer', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }


  // Voir les détails de l'offre associée
  viewOfferDetails(offreId: number | undefined): void {
    console.log(`Voir les détails de l'offre ID: ${offreId}`);
    // Ajouter une logique pour rediriger ou afficher des détails
  }

  // Voir les retours du recruteur
  viewFeedback(candidatureId: number): void {
    console.log(`Voir les retours pour la candidature ID: ${candidatureId}`);
    // Ajouter une logique pour afficher les retours
  }

  // Remplir les détails des offres
  fillOffreDetails(): void {
    this.candidatures.forEach((candidature) => {
      if (candidature.offreId) {
        this.offreService.getOffreById(candidature.offreId).subscribe({
          next: (offre: OffreStageDTO) => {
            candidature.offreStageDTO = offre;
          },
          error: (err) => {
            console.error(`Erreur lors du chargement de l'offre (ID: ${candidature.offreId}) :`, err);
          },
        });
      }
    });
  }

}
