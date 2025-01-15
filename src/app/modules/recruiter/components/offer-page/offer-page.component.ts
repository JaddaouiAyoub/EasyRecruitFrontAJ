import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {CandidatureDTO} from "../../../../models/candidature-dto.model";
import {OffreService} from "../../../../services/offreStage/offreStage";
import {OffreStageDTO} from "../../../../models/offre-stage-dto.model";


@Component({
  selector: 'app-offer-page',
  templateUrl: './offer-page.component.html',
  styleUrls: ['./offer-page.component.css'],
})
export class OfferPageComponent implements OnInit {
  offer: OffreStageDTO | undefined;
  offerId: number | undefined;
  showCandidatures: boolean = false;  // Gérer l'affichage des candidatures
  candidatures: CandidatureDTO[] = [];  // Champ pour stocker les candidatures
  isDeleteConfirmationVisible: boolean = false;
  userId : any ;

  constructor(
    private offerService: OffreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur depuis le localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.userId = user.id;
    } else {
      console.warn('Aucun utilisateur trouvé dans localStorage.');
    }

    // Récupérer l'ID de l'offre à partir des paramètres de la route
    this.offerId = Number(this.route.snapshot.paramMap.get('id'));

    // Charger les données de l'offre
    this.getOfferDetails();
    this.getCandidatures();
  }


  // Récupérer les candidatures
  getCandidatures(): void {
    if (this.offerId) {
      this.offerService.getCandidatures(this.offerId).subscribe(
        (data) => {
          this.candidatures = data;
          console.log(this.candidatures);
          console.log(this.candidatures[0].cv);
        },
        (error)  => {
          console.error('Erreur lors de la récupération des candidatures :', error);
        }
      );
    }
  }

  getOfferDetails(): void {
    this.offerService.getOffreById(this.offerId).subscribe(
      (data) => {
        this.offer = data;
        console.log("offer" + this.offer);
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'offre :', error);
      }
    );
  }

  // Méthode pour modifier l'offre (redirige vers une page de modification)
  editOffer(): void {
    this.router.navigate(['/recruiter/offer-posting/', this.offerId]);
  }

  // Méthode pour supprimer l'offre avec confirmation
  confirmDelete(): void {
    this.isDeleteConfirmationVisible = true;
  }

  cancelDelete(): void {
    this.isDeleteConfirmationVisible = false;
  }

  deleteOffer(): void {
    if (this.offerId) {
      this.offerService.deleteOffer(this.offerId).subscribe(
        () => {
          this.router.navigate(['/recruiter/internship-offers']); // Redirige vers la liste des offres après la suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'offre :', error);
        }
      );
    }
  }

  // Méthode pour afficher ou masquer les candidatures
  toggleCandidatures(): void {
    this.showCandidatures = !this.showCandidatures;
  }

  // Méthode pour obtenir la couleur en fonction du score
  getScoreColor(score: number): string {
    if (score >= 90) {
      return 'green';
    } else if (score >= 70) {
      return 'yellow';
    } else {
      return 'red';
    }
  }

  // Méthode pour inviter à un entretien
  inviteToInterview(candidature: any): void {
    alert('Invitation envoyée à ' + candidature.candidatDTO.nom);
  }
}
