import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { OffreStageDTO } from '../../../../models/offre-stage-dto.model';
import { OffreService } from '../../../../services/offreStage/offreStage';
import { MatDialog } from "@angular/material/dialog";
import { ApplicationFormComponent } from "../application-form/application-form.component";

@Component({
  selector: 'app-job-listings',
  templateUrl: './job-listings.component.html',
  styleUrls: ['./job-listings.component.css'],
})
export class JobListingsComponent implements OnInit {
  jobs: OffreStageDTO[] = [];
  filteredJobs: OffreStageDTO[] = [];
  jobTypes: string[] = ['Full Time', 'Part Time', 'Freelance', 'Internship', 'Temporary'];
  categories: string[] = ['IT', 'Marketing', 'Finance', 'Education'];
  locationFilter: string = '';
  selectedTypes: string[] = [];
  selectedCategory: string = '';
  keywords: string = '';
  isLoading: boolean = false;
  isError: boolean = false;

  // Pagination
  currentPage: number = 0;
  totalPages: number = 1;
  jobsPerPage: number = 10;

  constructor(
    private snackBar: MatSnackBar,
    private offreService: OffreService,
    private dialog: MatDialog,
      private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadFiltersFromUrl();  // Charger les filtres à partir de l'URL
    this.loadPaginatedJobs();   // Charger les offres avec les filtres
  }

  loadFiltersFromUrl(): void {
    this.route.queryParams.subscribe(params => {
      // Récupérer les paramètres d'URL
      this.locationFilter = params['location'] || '';
      this.selectedCategory = params['domaine'] || '';
      this.keywords = params['keywords'] || '';
    });
  }

  loadPaginatedJobs(page: number = this.currentPage, size: number = this.jobsPerPage): void {
    this.isLoading = true;
    this.offreService.getPaginatedOffres(page, size).subscribe({
      next: (data: { content: OffreStageDTO[]; totalPages: number; totalElements: number }) => {
        this.jobs = data.content;

        // Appliquer les filtres
        this.filteredJobs = this.jobs.filter((job) => {
          const matchesLocation = !this.locationFilter ||
            job.location?.toLowerCase().includes(this.locationFilter.toLowerCase());

          const matchesCategory = !this.selectedCategory ||
            job.domaine?.toUpperCase() === this.selectedCategory.toUpperCase();

          const matchesKeywords = !this.keywords ||
            job.titre?.toLowerCase().includes(this.keywords.toLowerCase());

          return matchesLocation && matchesCategory && matchesKeywords;
        });
        this.jobs=this.filteredJobs
        console.log(this.filteredJobs)

        this.totalPages = data.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        this.isError = true;
        this.snackBar.open('Failed to load jobs.', 'Close', { duration: 3000 });
        this.isLoading = false;
      },
    });
  }

  applyClientSideFilters(): void {
    this.filteredJobs = this.jobs.filter((job) => {
      const matchesLocation = !this.locationFilter ||
        job.location?.toLowerCase().includes(this.locationFilter.toLowerCase());

      const matchesCategory = !this.selectedCategory ||
        job.domaine?.toUpperCase() === this.selectedCategory.toUpperCase();

      const matchesKeywords = !this.keywords ||
        job.titre?.toLowerCase().includes(this.keywords.toLowerCase());

      return matchesLocation && matchesCategory && matchesKeywords;
    });
  }

  toggleType(type: string): void {
    if (this.selectedTypes.includes(type)) {
      this.selectedTypes = this.selectedTypes.filter((t) => t !== type);
    } else {
      this.selectedTypes.push(type);
    }
    this.applyClientSideFilters();
  }

  trackById(index: number, item: OffreStageDTO): number {
    return item.id!;
  }

  changePage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.loadPaginatedJobs(this.currentPage, this.jobsPerPage);
  }

  openApplicationForm(offreId: number | undefined) {
    const dialogRef = this.dialog.open(ApplicationFormComponent, {
      width: '600px',
      data: { offreId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialogue fermé avec le résultat :', result);
    });
  }
}
