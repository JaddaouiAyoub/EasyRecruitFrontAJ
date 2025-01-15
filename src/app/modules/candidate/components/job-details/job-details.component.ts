import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CandidatService} from "../../../../services/candidat/candidat.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OffreStageDTO} from "../../../../models/offre-stage-dto.model";
import {OffreService} from "../../../../services/offreStage/offreStage";
import {MatDialog} from "@angular/material/dialog";
import {ApplicationFormComponent} from "../application-form/application-form.component";
// import { ActivatedRoute } from '@angular/router';
// import { CandidatService } from '../../../../services/candidat/candidat.service';
// import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css'],
})
export class JobDetailsComponent implements OnInit {
  job: OffreStageDTO = new OffreStageDTO();
  relatedJobs: OffreStageDTO[] |  undefined;
  isLoading: boolean = false;
  isError: boolean = false;
  jobId: number = 0;
  constructor(
      private route: ActivatedRoute,
      private candidatService: CandidatService,
      private snackBar: MatSnackBar,
      private offreStageService: OffreService,
      private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.jobId = +this.route.snapshot.paramMap.get('id')!;
    console.log('Job ID:', this.jobId);
    this.loadJobDetails();

    // Static data for testing
    //this.loadStaticData();
  }

  // // Static data for testing
  // loadStaticData(): void {
  //   this.job = {
  //     id: 1,
  //     title: 'Frontend Developer',
  //     company: 'Tech Solutions',
  //     logo: 'assets/images/company1.png',
  //     location: 'San Francisco, CA',
  //     type: 'Full Time',
  //     description: 'We are looking for a talented Frontend Developer to join our team.',
  //     requirements: [
  //       'Proficiency in HTML, CSS, and JavaScript.',
  //       'Experience with Angular or React.',
  //       'Strong problem-solving skills.',
  //     ],
  //     offers: [
  //       'Competitive salary.',
  //       'Health insurance.',
  //       'Flexible working hours.',
  //     ],
  //     category: 'IT',
  //     datePosted: '2025-01-01',
  //     salary: '$80,000 - $100,000',
  //   };
  //
  //   this.relatedJobs = [
  //     {
  //       id: 2,
  //       title: 'Backend Developer',
  //       type: 'Full Time',
  //       salary: '$85,000 - $105,000',
  //     },
  //     {
  //       id: 3,
  //       title: 'UI/UX Designer',
  //       type: 'Part Time',
  //       salary: '$50,000 - $70,000',
  //     },
  //     {
  //       id: 4,
  //       title: 'Data Analyst',
  //       type: 'Freelance',
  //       salary: '$60,000 - $90,000',
  //     },
  //   ];
  //
  //   this.isLoading = false;
  // }

  // Dynamic data fetching logic
  loadJobDetails(): void {
    this.isLoading = true;

    this.candidatService.getOfferById(this.jobId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.job = data;
        this.isLoading = false;
        if (this.job.domaine) {
          this.loadRelatedJobs(this.job.domaine);
        }
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des détails de l\'offre :', err);
        this.isError = true;
        this.snackBar.open('Erreur lors du chargement de l\'offre.', 'Fermer', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  loadRelatedJobs(category: string): void {

    this.offreStageService.getRelatedOffers(this.job.titre, this.job.domaine, this.job.location , this.jobId).subscribe({
      next: (data) => {

        this.relatedJobs = data;
        console.log('Related offers:', data);
      },
      error: (err) => {
        console.error('Error loading related offers:', err);
      },
    });
    // this.candidatService.getRelatedJobs(category).subscribe({
    //   next: (data: any[]) => {
    //     this.relatedJobs = data;
    //   },
    //   error: (err: any) => {
    //     console.error('Erreur lors du chargement des offres liées :', err);
    //   },
    // });

  }

  applyForJob(): void {
    console.log(`Candidature pour le job ID ${this.jobId}`);
    // Logique pour postuler au job (service ou redirection)
  }

  openApplicationForm(offreId: number) {
    const dialogRef = this.dialog.open(ApplicationFormComponent, {
      width: '600px',
      data: { offreId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialogue fermé avec le résultat :', result);
    });
  }
}
