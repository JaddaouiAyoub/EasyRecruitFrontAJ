import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {InterviewService} from "../../../services/interview/interview.service";

@Component({
  selector: 'app-ready-for-interview',
  templateUrl: './ready-for-interview.component.html',
  styleUrls: ['./ready-for-interview.component.css']
})
export class ReadyForInterviewComponent implements OnInit {
  candidatureId!: number;
  isAuthorized: boolean | null = null;
  offreId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private interviewService: InterviewService
  ) {}

  ngOnInit(): void {
    // Extraire candidatureId de l'URL
    this.route.queryParams.subscribe(params => {
      this.candidatureId = +params['candidatureId']; // Conversion en number
      this.offreId = +params['offreId'];
      console.log('Candidature ID:', this.candidatureId);
      console.log('Offre ID:', this.offreId);
      this.checkAuthorization();
    });
  }

  checkAuthorization(): void {
    if (!this.candidatureId) {
      this.isAuthorized = false;
      return;
    }

    this.interviewService.checkAuthorization(this.candidatureId).subscribe({
      next: (authorized) => {
        this.isAuthorized = authorized;
      },
      error: (err) => {
        console.error('Erreur lors de la vérification:', err);
        this.isAuthorized = false;
      }
    });
  }
  startVideoSimulation(): void {
    console.log('/candidate/video-simulation?candidatureId=' + this.candidatureId + '&offreId=' + this.offreId);
    // Redirection vers le composant de simulation vidéo
    this.router.navigate(['/candidate/video-simulation'], {
      queryParams: { candidatureId: this.candidatureId, offreId: this.offreId },
    });  }
}
