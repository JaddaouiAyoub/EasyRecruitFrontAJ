import { Component, OnInit } from '@angular/core';
import { CandidatService } from '../../../../services/candidat/candidat.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../../services/auth/auth.service';
import {CandidatureService} from "../../../../services/candidature/candidature.service";
import {CandidatureEntretienDTO} from "../../../../models/candidature-entretien-dto";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  stats = { totalOffres: 0, totalCandidatures: 0, totalReponses: 0 };
  recentActivities: { message: string; link?: string }[] = [];
  notifications: { message: string; link?: string }[] = [];
  videoSimulations: { id: number; title: string; status?: string }[] = [];
  isLoading = false;
  isError = false;
  candidatId = 1;
  protected candidatures!: CandidatureEntretienDTO[];

  constructor(
    private router: Router,
    private candidatureService : CandidatureService,
      private candidatService: CandidatService,
      private snackBar: MatSnackBar,
      private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();

    this.candidatureService.getCandidaturesWithInterviews(this.candidatId).subscribe({
      next: (data) => {
        this.candidatures = data;
        console.log('Candidatures reçues:', this.candidatures);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des candidatures:', err);
      }
    });
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Uncomment this section for dynamic data
    /*
    forkJoin({
      offres: this.candidatService.getAllOffres(),
      candidatures: this.candidatService.getCandidaturesByCandidat(this.candidatId),
    }).subscribe({
      next: (data) => {
        this.stats.totalOffres = data.offres?.length || 0;
        this.stats.totalCandidatures = data.candidatures?.length || 0;
        this.stats.totalReponses = data.candidatures
          ? data.candidatures.filter((c) => c.scoreFinal !== null).length
          : 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données:', err);
        this.isError = true;
        this.snackBar.open(
          'Erreur lors du chargement des données.',
          'Fermer',
          { duration: 3000 }
        );
        this.isLoading = false;
      },
    });
    */

    // Static data for testing
    setTimeout(() => {
      this.stats = {
        totalOffres: 12,
        totalCandidatures: 8,
        totalReponses: 4,
      };

      this.recentActivities = [
        { message: 'Vous avez consulté une offre : Développeur Full-Stack', link: '/job-listings/1' },
        { message: 'Nouvelle candidature envoyée pour le poste : Designer UX', link: '/tracking/2' },
      ];

      this.notifications = [
        { message: 'Votre candidature pour Développeur Frontend a été acceptée', link: '/tracking/3' },
        { message: 'Nouvelle offre disponible : Ingénieur DevOps', link: '/job-listings/4' },
      ];

      this.videoSimulations = [
        { id: 1, title: 'Simulation : Entretien Junior', status: 'completed' },
        { id: 2, title: 'Simulation : Entretien Manager' },
      ];

      this.isLoading = false;
    }, 1000); // Simulate API response delay
  }

  startSimulation(candidatureId: number , offreId: number) {
    console.log(`Starting simulation with ID: ${candidatureId}`);
    this.router.navigate(['/candidate/readyForInterview'], {
      queryParams: { candidatureId: candidatureId, offreId: offreId },
    });
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  reviewSimulation(id: number) {
    console.log(`Reviewing simulation with ID: ${id}`);
  }

}
