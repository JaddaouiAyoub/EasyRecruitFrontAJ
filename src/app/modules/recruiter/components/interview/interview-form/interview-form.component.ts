import { Component, OnInit } from '@angular/core';
import { OffreStageDTO } from "../../../../../models/offre-stage-dto.model";
import { OffreService } from "../../../../../services/offreStage/offreStage";
import { InterviewService } from "../../../../../services/recruiter/InterviewService";
import { MatSnackBar } from "@angular/material/snack-bar";
import {RecruteurDTO} from "../../../../../models/recruteur-dto.model";

@Component({
  selector: 'app-interview-form',
  templateUrl: './interview-form.component.html',
  styleUrls: ['./interview-form.component.css']
})
export class InterviewFormComponent implements OnInit {
  questions: string[] = [];
  numQuestions: number = 3;
  entretienLink: string = '';
  offres: OffreStageDTO[] = [];
  selectedOffer: OffreStageDTO | null = null;
  isPopupVisible: boolean = false; // Nouvelle variable pour gérer la popup
  toast: { type: string, message: string } | null = null;
  userData: RecruteurDTO = new RecruteurDTO();

  constructor(
    private offreService: OffreService,
    private interviewService: InterviewService,
    private snackBar: MatSnackBar // Service pour afficher les toasts
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
    }
    this.loadOffres();
    this.initializeQuestions();
  }

  // Charger les offres disponibles
  loadOffres(): void {
    this.offreService.getOffresByRecruteur(this.userData.id).subscribe({
      next: (data) => {
        this.offres = data;
        console.log('Offres récupérées:', data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des offres:', err);
        this.showToast('Erreur lors de la récupération des offres.', 'error');
      }
    });
  }

  // Initialiser les questions
  initializeQuestions(): void {
    this.questions = Array.from({ length: this.numQuestions }, () => '');
  }

  // Mettre à jour le nombre de questions
  updateQuestions(): void {
    const currentLength = this.questions.length;

    if (this.numQuestions > currentLength) {
      for (let i = currentLength; i < this.numQuestions; i++) {
        this.questions.push('');
      }
    } else if (this.numQuestions < currentLength) {
      this.questions.splice(this.numQuestions);
    }
  }

  // Sélectionner une offre
  selectOffer(offre: OffreStageDTO): void {
    this.selectedOffer = offre;
    this.isPopupVisible = true; // Affiche la popup
    console.log('Offre sélectionnée:', offre);
    this.showToast(`Offre sélectionnée: ${offre.titre}`, 'info');
  }

  // Générer un entretien
  generateEntretienLink(): void {
    if (!this.selectedOffer) {
      this.closePopup();
      this.showToast('Veuillez sélectionner une offre avant de générer un entretien.', 'error');
      return;
    }

    console.log(this.questions);

    this.interviewService.createEntretien(this.selectedOffer.id, this.questions).subscribe({
      next: () => {
        this.showToast('Les questions d\'entretien ont été enregistrées avec succès!', 'success');
        this.closePopup(); // Ferme la popup après succès
      },
      error: (error) => {
        this.closePopup();
        this.showToast('Erreur : Cette offre a déjà été traitée, un entretien a déjà été créé.', 'error');
        console.error(error);
      }
    });
  }

  // Fermer le popup
  closePopup(): void {
    this.isPopupVisible = false; // Masque la popup
    this.selectedOffer = null;
  }

  // Afficher un Toast avec MatSnackBar
  showToast(message: string, type: string): void {
    let snackBarClass = '';

    // Choisir une classe en fonction du type de message
    if (type === 'success') {
      snackBarClass = 'success-snackbar';
    } else if (type === 'error') {
      snackBarClass = 'error-snackbar';
    } else if (type === 'info') {
      snackBarClass = 'info-snackbar';
    }

    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: [snackBarClass],
    });
  }

  // Track by index for performance
  trackByIndex(index: number): number {
    return index;
  }
}
