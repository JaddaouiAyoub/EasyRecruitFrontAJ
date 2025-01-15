import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {OffreService} from "../../../../services/offreStage/offreStage";
import {OffreStageDTO} from "../../../../models/offre-stage-dto.model";
import {RecruteurDTO} from "../../../../models/recruteur-dto.model";


@Component({
  selector: 'app-job-posting',
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.css']
})
export class JobPostingComponent implements OnInit {

  // @ts-ignore
  offre: OffreStageDTO = {
    id: 0,
    titre: '',
    location: '',
    salaire: '',
    description: '',
    domaine: '',
    recruteurDTO: new RecruteurDTO (),
    photo: '',
    keywords: '' // Initialisation de la liste des mots-clés
  };
  selectedPhoto: File | null = null;
  offerId: number | undefined;
  showSuccessModal: boolean = false;
  successMessage: string = '';

  constructor(private offreService: OffreService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.offerId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.offerId) {
      this.getOfferDetails();
    }
    const storedRecruteur = localStorage.getItem('user');

    if (storedRecruteur) {
      try {
        const recruteur = JSON.parse(storedRecruteur);
        // Copier les données dans recruteurDTO
        this.offre.recruteurDTO = Object.assign(new RecruteurDTO(), recruteur);
      } catch (error) {
        console.error('Erreur lors de la récupération du recruteur:', error);
      }
    }

  }

  getOfferDetails(): void {
    this.offreService.getOffreById(this.offerId).subscribe(
      data => {
        this.offre = data;
      },
      error => {
        console.error('Erreur lors de la récupération de l\'offre :', error);
      }
    );
  }

  submitOffer(): void {
    if (this.offerId) {
      this.offreService.updateOffre(this.offerId, this.offre, this.selectedPhoto).subscribe(
        response => {
          this.showSuccessMessage('L\'offre a été mise à jour avec succès!');
        },
        error => {
          console.error('Error updating offer:', error);
          alert('Error updating the offer. Please try again.');
        }
      );
    } else {
      this.offreService.postOffre(this.offre, this.selectedPhoto).subscribe(
        response => {
          this.showSuccessMessage('L\'offre a été créée avec succès!');
        },
        error => {
          console.error('Error creating offer:', error);
          alert('Error creating the offer. Please try again.');
        }
      );
    }
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccessModal = true;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  goToOffersPage(): void {
    this.router.navigate(['/recruiter/mes-offres']);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPhoto = input.files[0];
    }
  }
}
