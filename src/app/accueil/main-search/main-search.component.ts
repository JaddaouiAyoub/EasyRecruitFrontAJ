import { Component, OnInit } from '@angular/core';
import { OffreStageDTO } from '../../models/offre-stage-dto.model';
import { OffreService } from '../../services/offreStage/offreStage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-search',
  templateUrl: './main-search.component.html',
  styleUrls: ['./main-search.component.css'],
})
export class MainSearchComponent implements OnInit {
  offres: OffreStageDTO[] = []; // Toutes les offres récupérées
  filteredOffres: OffreStageDTO[] = []; // Offres filtrées en fonction des critères
  keywords: string = ''; // Mot-clé pour la recherche
  domain: string = ''; // Domaine sélectionné
  location: string = ''; // Lieu sélectionné
  locations: string[] = []; // Liste des lieux disponibles
  domains: string[] = [
    'INFORMATIQUE',
    'MARKETING',
    'FINANCE',
    'RESSOURCES_HUMAINES',
    'COMMUNICATION',
    'INGENIERIE',
    'DESIGN',
    'VENTE',
    'LOGISTIQUE',
  ]; // Liste des domaines disponibles

  constructor(private offreService: OffreService, private router: Router) {}

  ngOnInit(): void {
    this.loadOffres();
    this.loadLocations();
  }

  // Charger les offres de stage
  private loadOffres(): void {
    this.offreService.getAllOffres().subscribe({
      next: (offres) => {
        this.offres = offres;
        this.filteredOffres = offres; // Initialisation des offres filtrées
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des offres :', error);
      },
    });
  }

  // Charger les lieux disponibles
  private loadLocations(): void {
    this.offreService.getLocations().subscribe({
      next: (locations) => {
        this.locations = locations;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des lieux :', error);
      },
    });
  }

  // Filtrer les offres en fonction des mots-clés, du domaine et du lieu
  searchJobs(): void {
    // Appliquer les filtres
    this.filteredOffres = this.offres.filter((offre) => {
      const matchesKeywords = !this.keywords || offre.titre?.toLowerCase().includes(this.keywords.toLowerCase());
      const matchesDomain = !this.domain || offre.domaine?.toUpperCase() === this.domain.toUpperCase();
      const matchesLocation = !this.location || offre.location?.toLowerCase().includes(this.location.toLowerCase());
      return matchesKeywords && matchesDomain && matchesLocation;
    });

    // Naviguer vers la page des résultats de recherche avec les paramètres
    this.router.navigate(['/job-listings'], {
      queryParams: {
        location: this.location || null,
        domaine: this.domain || null,
        keywords: this.keywords || null,
      },
    });
  }
}
