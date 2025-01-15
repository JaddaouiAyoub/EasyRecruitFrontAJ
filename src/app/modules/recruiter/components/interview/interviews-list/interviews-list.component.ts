import { Component, OnInit } from '@angular/core';
import { CandidatureDTO } from "../../../../../models/candidature-dto.model";
import { CandidatureService } from "../../../../../services/candidature/candidature.service";
import { CandidatService } from "../../../../../services/candidat/candidat.service";
import { CandidatDTO } from "../../../../../models/candidat-dto.model";
import { OffreService } from "../../../../../services/offreStage/offreStage";
import { OffreStageDTO } from "../../../../../models/offre-stage-dto.model";
import {EmailDTO} from "../../../../../models/email-dto.model";
import {EmailService} from "../../../../../services/email/email.service";
import {RecruteurDTO} from "../../../../../models/recruteur-dto.model";
import {DomSanitizer, SafeResourceUrl, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-interviews-list',
  templateUrl: './interviews-list.component.html',
  styleUrls: ['./interviews-list.component.css'],
})
export class InterviewsListComponent implements OnInit {
  candidatures: CandidatureDTO[] = [];
  filteredCandidatures: CandidatureDTO[] = [];
  offres: { [key: number]: OffreStageDTO } = {};
  selectedCandidature: CandidatureDTO | null = null;
  selectedOffer: string = '';
  userData: RecruteurDTO = new RecruteurDTO();
  etat = "PASSE_ENTRETIEN" ;
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
  showReport(rapportUrl: string): void {
    // Sanitize URL directly in the component
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rapportUrl) as string;
    this.showIframe = true;
  }
  hideReport(): void {
    this.showIframe = false;
    this.pdfUrl = null;
  }

  // Filtre par offre
  filterByetat(): void {
    const etatsVoulus = ["INVITE_ENTRETIEN", "PASSE_ENTRETIEN"]; // Liste des états à filtrer
    this.filteredCandidatures = this.candidatures.filter(candidature =>
      etatsVoulus.includes(candidature.etat) // Vérifie si l'état de la candidature est dans la liste
    );
    console.log("Candidatures filtrées :", this.filteredCandidatures);
  }

// Récupération des candidatures avec filtre appliqué
  loadCandidatures(): void {
    this.candidatureService.getCandidaturesByRecruteur(this.userData.id).subscribe({
      next: (data: CandidatureDTO[]) => {
        console.log(data)
        this.candidatures = data.map(candidature => ({
          ...candidature,
          showDetails: false, // Gestion des détails
        }));
        this.loadAllCandidats();
        this.loadAllOffres();
        this.filterByetat(); // Filtrer après le chargement des candidatures
      },
      error: err => console.error('Erreur lors du chargement des candidatures:', err),
    });
  }


  filterByOffer(): void {
    if (this.selectedOffer) {
      this.filteredCandidatures = this.candidatures.filter(candidature =>
        candidature.offreStageDTO?.id === parseInt(this.selectedOffer, 10)
      );
    } else {
      this.filteredCandidatures = [...this.candidatures];
    }
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
      subject: 'EasyRecruit : Congratulations',
      variables: {
        candidateName : candidature.candidatDTO.lastName + " " + candidature.candidatDTO.firstName ,
        companyName : candidature.offreStageDTO?.recruteurDTO.companyName,
        offreName: candidature.offreStageDTO?.titre,
        interviewLink : `http://localhost:4200/candidate/readyForInterview?candidatureId=${candidature.candidatureId}`
      }
    };
    console.log(candidature)
    // Envoyer l'email via le service
    this.emailService.sendEmail(emailDTO).subscribe({
      next: (response) => {
        alert(`Invitation envoyée à ${candidature.candidatDTO?.firstName} ${candidature.candidatDTO?.lastName}.`);
        this.loadCandidatures();
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        alert('Une erreur est survenue lors de l\'envoi de l\'invitation. Veuillez réessayer.');
      }
    });
  }

  // Rejet d'un candidat
  rejectCandidat(candidature: CandidatureDTO): void {
    alert(`Candidat ${candidature.candidatDTO?.firstName} ${candidature.candidatDTO?.lastName} rejeté.`);
  }

  // Gestion de l'affichage des détails
  toggleDetails(candidature: CandidatureDTO): void {
    this.selectedCandidature = this.selectedCandidature === candidature ? null : candidature;
  }

  closeDetails(): void {
    this.selectedCandidature = null;
  }

}
