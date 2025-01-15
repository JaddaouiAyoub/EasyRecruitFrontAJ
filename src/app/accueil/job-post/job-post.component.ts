import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import {OffreStageDTO} from "../../models/offre-stage-dto.model";
import {OffreService} from "../../services/offreStage/offreStage";

@Component({
  selector: 'app-job-post',
  templateUrl: './job-post.component.html',
  styleUrls: ['./job-post.component.css'],
})
export class JobPostComponent implements OnInit {
  jobs: OffreStageDTO[] = []; // Liste des offres d'emploi
  currentPage: number = 0; // Page actuelle
  totalPages: number = 0; // Nombre total de pages
  isLoading: boolean = false;

  constructor(private offreService: OffreService) {}

  ngOnInit(): void {
    this.loadOffers(this.currentPage, 5); // Charger la première page avec une taille de 5
  }

  // Charger les offres en fonction de la page
  loadOffers(page: number, size: number): void {
    this.isLoading = true;
    this.offreService.getPaginatedOffres(page, size).subscribe({
      next: (response) => {
        this.jobs = response.content;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des offres :', err);
        this.isLoading = false;
      },
    });
  }

  // Changer la page
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadOffers(this.currentPage, 5);
    }
  }
}
