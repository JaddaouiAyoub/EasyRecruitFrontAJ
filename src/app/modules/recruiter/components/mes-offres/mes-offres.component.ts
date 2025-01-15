import { Component } from '@angular/core';
import { OffreStageDTO } from "../../../../models/offre-stage-dto.model";
import { CandidatureDTO } from "../../../../models/candidature-dto.model";
import { OffreService } from "../../../../services/offreStage/offreStage";
import { CandidatService } from "../../../../services/candidat/candidat.service";
import { CandidatDTO } from "../../../../models/candidat-dto.model";
import {RecruteurDTO} from "../../../../models/recruteur-dto.model"; // Import du service candidat

@Component({
  selector: 'app-mes-offres',
  templateUrl: './mes-offres.component.html',
  styleUrls: ['./mes-offres.component.css']
})
export class MesOffresComponent {
  offres: OffreStageDTO[] = [];
  candidatures: CandidatureDTO[] = []; // Stocke les candidatures pour une offre
  selectedOffer: OffreStageDTO | null = null;
  offerId: number | undefined = 0;
  userData: RecruteurDTO = new RecruteurDTO();
  candidat: CandidatDTO | null = null; // Stocke les candidats récupérés pour chaque candidature

  constructor(
    private offreService: OffreService,
    private candidatService: CandidatService // Injection du service candidat
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
    }
    this.loadOffres(this.userData.id);
  }

  // Récupère les offres du recruteur
  loadOffres(id: number | null): void {
    this.offreService.getOffresByRecruteur(id).subscribe({
      next: (data) => {
        this.offres = data;
        console.log('Offres récupérées:', data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des offres:', err);
      }
    });
  }

  // Récupère un candidat par ID
  loadCandidat(candidatId: number): void {
    this.candidatService.getCandidatById(candidatId).subscribe({
      next: (data) => {
        // Trouver la candidature correspondante et assigner le candidat récupéré
        let candidature = this.candidatures.find(c => c.candidatId === candidatId);
        if (candidature) {
          candidature.candidatDTO = data; // Mettre à jour le candidatDTO de la candidature

        }
        console.log('Candidat récupéré:', data);
      },
      error: (err) => {
        console.error(`Erreur lors de la récupération du candidat (ID: ${candidatId}):`, err);
      }
    });
  }

  // Récupère les candidatures pour l'offre sélectionnée
  getCandidatures(): void {
    if (this.offerId) {
      this.offreService.getCandidatures(this.offerId).subscribe({
        next: (data) => {
          this.candidatures = data;
          console.log('Candidatures récupérées:', this.candidatures);

          // Pour chaque candidature, récupérer le candidat associé
          this.candidatures.forEach(candidature => {
            if (candidature.candidatId) {
              this.loadCandidat(candidature.candidatId); // Récupérer le candidat associé
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des candidatures :', err);
        }
      });
    }
  }

  // Gère le clic sur une offre
  onOfferClick(offre: OffreStageDTO): void {
    this.selectedOffer = offre;
    this.offerId = offre.id;
    this.getCandidatures(); // Charger les candidatures pour cette offre
  }
// Ajout de la méthode closePopup()
  closePopup(): void {
    this.selectedOffer = null;
    this.candidatures = [];
  }



}
