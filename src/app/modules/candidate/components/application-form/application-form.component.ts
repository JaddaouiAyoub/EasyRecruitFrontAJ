import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CandidatService } from '../../../../services/candidat/candidat.service';
import {forkJoin, Observable, of, tap} from 'rxjs';
import {CloudinaryService} from "../../../../services/cloudinary/cloudinary.service";
import {CandidatureService} from "../../../../services/candidature/candidature.service";
import {CandidatureDTOApply, EtatCandidature} from "../../../../models/apply-candidature-dto";
import {OffreService} from "../../../../services/offreStage/offreStage";
import {OffreStageDTO} from "../../../../models/offre-stage-dto.model";
import {ScoreCvService} from "../../../../services/score_cv/score-cv.service";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css'],
})
export class ApplicationFormComponent implements OnInit {
  job: OffreStageDTO = new OffreStageDTO();
  formData = {
    fullName: '',
    email: '',
  };
  candidatId : number | undefined
  cvUrl: string | null = null; // URL du CV existant (préremplie)
  files: { lettreMotivation: File | null; cv: File | null } = {
    lettreMotivation: null,
    cv: null,
  };

  fileErrors: { lettreMotivation: string | null; cv: string | null } = {
    lettreMotivation: null,
    cv: null,
  };

  submissionMessage: string | null = null;
  isUploading: boolean = false;

  constructor(
    private candidatService: CandidatService,
    private cloudinaryService: CloudinaryService, // Inject du service Cloudinary
    private candidatureService: CandidatureService,
    private snackBar: MatSnackBar,
    private scoreCVService: ScoreCvService,
    private offreStageService: OffreService,
    public dialogRef: MatDialogRef<ApplicationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { offreId: number }
  ) {}

  ngOnInit(): void {
    this.prepopulateForm();
    this.loadJobDetails();
  }

  prepopulateForm(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.candidatId =user.id;
      this.formData.fullName = `${user.firstName} ${user.lastName}`;
      this.formData.email = user.email;
      this.cvUrl = user.cvUrl || null;
    }
    else{
      alert("you must be logged in to apply to an offer");
      // this.snackBar.open('Vous devez vous connecter pour postuler à une offre', 'Fermer', { duration: 3000 });
      this.dialogRef.close();
    }
  }

  onFileSelect(event: Event, fileType: 'lettreMotivation' | 'cv'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!allowedTypes.includes(file.type)) {
        this.fileErrors[fileType] = `Type de fichier invalide. Accepté : ${allowedTypes.join(', ')}`;
        this.files[fileType] = null;
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.fileErrors[fileType] = 'La taille du fichier doit être inférieure à 2 Mo.';
        this.files[fileType] = null;
        return;
      }

      this.fileErrors[fileType] = null;
      this.files[fileType] = file;

      if (fileType === 'cv') {
        this.cvUrl = null;
      }
    }
  }

  submitApplication(): void {
    this.isUploading = true;

    // Tableau des uploads à effectuer (s'il y a des fichiers)
    const uploads: Observable<string | null>[] = [];

    // Ajouter l'upload de la lettre de motivation si elle est présente
    if (this.files.lettreMotivation) {
      uploads.push(this.cloudinaryService.uploadFile(this.files.lettreMotivation));
    } else {
      uploads.push(of(null)); // Retourner un Observable qui émet null si la lettre de motivation est absente
    }

    // Ajouter l'upload du CV si il est présent, sinon utiliser l'URL existante
    if (this.files.cv) {
      uploads.push(this.cloudinaryService.uploadFile(this.files.cv));
    } else {
      uploads.push(of(this.cvUrl)); // Utiliser l'URL du CV existant
    }

    // Attendre que tous les uploads soient terminés
    forkJoin(uploads).subscribe({
      next: ([lettreMotivationUrl, cvUrl]) => {
        const candidature: CandidatureDTOApply = {
          candidatId: this.candidatId,
          offreId: this.data.offreId,
          lettreMotivation: lettreMotivationUrl,
          cv: cvUrl,
          scoreInitial: 0,
          scoreFinal: 0,
          date: new Date(),
          etat: EtatCandidature.NON_TRAITE,
        };

        // Vérifier si un CV est présent pour le scoring
        if (this.files.cv) {
          this.scoreCVService.calculateCVScore(this.files.cv, this.job.keywords).pipe(
            // Une fois le score récupéré, l'ajouter à la candidature
            tap((scoreData: any) => {
              console.log('CV score:', scoreData);
              candidature.scoreInitial = scoreData.final_score;
              console.log('candidature to send to the backend :', candidature);
            }),
            // Passer à la soumission de la candidature
            switchMap(() => this.candidatureService.postuler(this.data.offreId, candidature))
          ).subscribe({
            next: () => {
              this.snackBar.open('Candidature envoyée avec succès!', 'Fermer', {duration: 3000});
              this.submissionMessage = 'Votre candidature a été soumise avec succès.';
              this.isUploading = false;
              this.dialogRef.close('success');
            },
            error: (err) => {
              console.error(err);
              if (err.status === 400) {
                this.snackBar.open('Vous avez déjà postulé à cet emploi.', 'Fermer', {duration: 3000});
              } else {
                this.snackBar.open('Erreur lors de la soumission de la candidature. Veuillez réessayer.', 'Fermer', {duration: 3000});
              }
              this.isUploading = false;
            },
          });
        }else {
          // Si aucun CV n'est présent, soumettre directement la candidature
          this.candidatureService.postuler(this.data.offreId, candidature).subscribe({
            next: () => {
              this.snackBar.open('Candidature envoyée avec succès!', 'Fermer', {duration: 3000});
              this.submissionMessage = 'Votre candidature a été soumise avec succès.';
              this.isUploading = false;
              this.dialogRef.close('success');
            },
            error: (err) => {
              console.error(err);
              if (err.status === 400) {
                this.snackBar.open('Vous avez déjà postulé à cet emploi.', 'Fermer', {duration: 3000});
              } else {
                this.snackBar.open('Erreur lors de la soumission de la candidature. Veuillez réessayer.', 'Fermer', {duration: 3000});
              }
              this.isUploading = false;
            },
          });
        }
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement des fichiers:', error);
        this.snackBar.open('Échec du téléchargement des fichiers.', 'Fermer', {duration: 3000});
        this.isUploading = false;
      },
    });
  }
    closeDialog(): void {
    this.dialogRef.close();
  }

  loadJobDetails(): void {

    this.candidatService.getOfferById(this.data.offreId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.job = data;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des détails de l\'offre :', err);
        this.snackBar.open('Erreur lors du chargement de l\'offre.', 'Fermer', {
          duration: 3000,
        });
      },
    });
  }
}
