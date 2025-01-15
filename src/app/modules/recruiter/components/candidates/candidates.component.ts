import { Component, OnInit } from '@angular/core';
import { CandidatureDTO } from "../../../../models/candidature-dto.model";
import { CandidatureService } from "../../../../services/candidature/candidature.service";
import { CandidatService } from "../../../../services/candidat/candidat.service";
import { CandidatDTO } from "../../../../models/candidat-dto.model";
import { OffreService } from "../../../../services/offreStage/offreStage";
import { OffreStageDTO } from "../../../../models/offre-stage-dto.model";
import {EmailDTO} from "../../../../models/email-dto.model";
import {EmailService} from "../../../../services/email/email.service";
import {RecruteurDTO} from "../../../../models/recruteur-dto.model";
import {DomSanitizer, SafeResourceUrl, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css'],
})
export class CandidatesComponent implements OnInit {
  candidatures: CandidatureDTO[] = [];
  filteredCandidatures: CandidatureDTO[] = [];
  offres: { [key: number]: OffreStageDTO } = {};
  selectedCandidature: CandidatureDTO | null = null;
  selectedOffer: string = '';
  userData: RecruteurDTO = new RecruteurDTO();
  etat = "NON_TRAITE" ;
  showIframe: boolean = false;
  pdfUrl: SafeResourceUrl | null = null;

  constructor(
    private candidatureService: CandidatureService,
    private candidatService: CandidatService,
    private offreService: OffreService,
    private emailService: EmailService,
    private sanitizer: DomSanitizer

  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
    }
    this.loadCandidatures();
  }

  // Filtre par offre
  filterByOffer(): void {
    if (this.selectedOffer) {
      this.filteredCandidatures = this.candidatures.filter(candidature =>
        candidature.offreStageDTO?.id === parseInt(this.selectedOffer, 10)
      );
    } else {
      this.filteredCandidatures = [...this.candidatures];
    }
  }

  // Récupération des candidatures
  loadCandidatures(): void {
    this.candidatureService.getCandidaturesByRecruteur(this.userData.id).subscribe({
      next: (data: CandidatureDTO[]) => {
        this.candidatures = data.map(candidature => ({
          ...candidature,
          showDetails: false, // Gestion des détails
        })).sort((a, b) => (b.scoreInitial || 0) - (a.scoreInitial || 0)); // Tri décroissant par scoreInitial

        this.filteredCandidatures = [...this.candidatures]; // Mise à jour des candidatures filtrées
        this.loadAllCandidats();
        this.loadAllOffres();
      },
      error: err => console.error('Erreur lors du chargement des candidatures:', err),
    });
  }

  // Récupération de tous les candidats associés
  loadAllCandidats(): void {
    const candidatIds = [...new Set(this.candidatures.map(c => c.candidatId))];
    candidatIds.forEach(id => {
      if (id) this.loadCandidat(id);
    });
  }

  // Récupération d'un candidat spécifique
  loadCandidat(candidatId: number): void {
    this.candidatService.getCandidatById(candidatId).subscribe({
      next: (data: CandidatDTO) => {
        const candidature = this.candidatures.find(c => c.candidatId === candidatId);
        if (candidature) candidature.candidatDTO = data;
      },
      error: err => console.error(`Erreur lors du chargement du candidat (ID: ${candidatId}):`, err),
    });
  }

  // Récupération de toutes les offres
  loadAllOffres(): void {
    this.offreService.getOffresByRecruteur(this.userData.id).subscribe({
      next: (data: OffreStageDTO[]) => {
        data.forEach(offre => {
          this.offres[offre.id!] = offre;
        });
        this.candidatures.forEach(candidature => {
          if (candidature.offreId) candidature.offreStageDTO = this.offres[candidature.offreId];
        });
      },
      error: err => console.error('Erreur lors du chargement des offres:', err),
    });
  }



  // Invitation d'un candidat
  inviteCandidat(candidature: CandidatureDTO): void {
    // Vérifiez si les informations nécessaires sont présentes
    if (!candidature.candidatDTO || !candidature.candidatDTO.email) {
      alert('L\'email du candidat est manquant.');
      return;
    }

    // Créez le contenu de l'email
    const emailDTO: EmailDTO = {
      to: candidature.candidatDTO.email,
      subject: 'EasyRecruit : Online Interview Invitation',
      variables: {
        candidateName : candidature.candidatDTO.lastName + " " + candidature.candidatDTO.firstName ,
        companyName : candidature.offreStageDTO?.recruteurDTO.companyName,
        offreName: candidature.offreStageDTO?.titre,
        interviewLink : `http://localhost:4200/candidate/readyForInterview?candidatureId=${candidature.candidatureId}&offreId=${candidature.offreStageDTO?.id}`
      }
    };
  // console.log("candidature hhhhhhhhhhh", candidature);
    // Envoyer l'email via le service
    this.emailService.sendEmail(emailDTO).subscribe({
      next: (response) => {
        alert(` Link Invitation Sent! ${candidature.candidatDTO?.firstName} ${candidature.candidatDTO?.lastName}.`);
        this.loadCandidatures();
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        alert('Une erreur est survenue lors de l\'envoi de l\'invitation. Veuillez réessayer.');
      }
    });
  }

  rejectCandidat(candidature: CandidatureDTO): void {
    this.candidatureService.deleteCandidature(candidature.candidatureId).subscribe({
      next: () => {
        this.candidatures = this.candidatures.filter(c => c.candidatureId !== candidature.candidatureId);
        alert(`Candidat ${candidature.candidatDTO?.firstName} ${candidature.candidatDTO?.lastName} rejeté avec succès.`);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la candidature :', err);
        alert('Une erreur est survenue lors de la suppression de la candidature.');
      }
    });
  }

  confirmRejectCandidat(candidature: CandidatureDTO): void {
    const confirmation = confirm(
      `Êtes-vous sûr de vouloir rejeter le candidat ${candidature.candidatDTO?.firstName} ${candidature.candidatDTO?.lastName} ?`
    );

    if (confirmation) {
      this.rejectCandidat(candidature);
    }
  }
  // Gestion de l'affichage des détails
  toggleDetails(candidature: CandidatureDTO): void {
    this.selectedCandidature = this.selectedCandidature === candidature ? null : candidature;
  }

  closeDetails(): void {
    this.selectedCandidature = null;
  }

  showReport(rapportUrl: string): void {
    if (!rapportUrl) {
      console.error('L\'URL du CV est vide ou invalide.');
      return;
    }
    // Vérifiez que l'URL est valide
    try {
      new URL(rapportUrl); // Lance une erreur si l'URL est invalide
      console.log('CV URL:', rapportUrl);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rapportUrl);
      this.showIframe = true;
    } catch (error) {
      console.error('L\'URL fournie est invalide:', error);
      alert('Le lien vers le fichier PDF semble invalide.');
    }
  }

  hideReport(): void {
    this.showIframe = false;
    this.pdfUrl = null;
  }

}
