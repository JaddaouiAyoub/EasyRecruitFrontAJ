import { Component, OnInit } from '@angular/core';
import { OffreStageDTO } from "../../../../models/offre-stage-dto.model";
import { OffreService } from "../../../../services/offreStage/offreStage";
import { InterviewService } from "../../../../services/recruiter/InterviewService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  offres: OffreStageDTO[] = [];
  allOffres: OffreStageDTO[] = [];  // Garde toutes les offres initiales
  filteredOffres: OffreStageDTO[] = [];  // Offres filtrées
  searchKeyword: string = '';
  selectedDomain: string = '';
  selectedLocation: string = '';
  selectedSalary: number | string = '';
  userId: any;  // ID de l'utilisateur connecté
  userRole: string = '';  // Rôle de l'utilisateur connecté
  interviewExistsResult : boolean = false;


  // Données pour les filtres
  domains: string[] = [
    'INFORMATIQUE',
    'MARKETING',
    'FINANCE',
    'RESSOURCES_HUMAINES',
    'COMMUNICATION',
    'INGENIERIE',
    'DESIGN',
    'VENTE',
    'LOGISTIQUE'
  ];
  locations: string[] = [];  // Liste des localisations
  salaries: number[] = [1000, 2500, 3500, 5000, 10000, 15000, 20000];

  constructor(private offreService: OffreService,private interviewService: InterviewService,
              private router : Router) {}

  ngOnInit(): void {
    const offreId = 3;
    this.interviewService.interviewExists(offreId).subscribe({
      next: (result) => {
        this.interviewExistsResult = result;
        console.log("Interview exists:", result); // Logs `true` or `false`
      },
      error: (err) => {
        console.error("Error checking interview existence:", err); // Logs any error
      }
    });
    this.initializeUser();  // Initialisation des informations utilisateur
    this.loadOffres();  // Chargement des offres
    this.loadLocations();  // Chargement des localisations
  }

  /**
   * Initialise les informations de l'utilisateur connecté depuis le localStorage.
   */
  private initializeUser(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.userId = user.id;
      this.userRole = user.role;
    } else {
      console.warn('Aucun utilisateur trouvé dans localStorage.');
    }
  }

  /**
   * Charge toutes les offres depuis le backend.
   */
  loadOffres(): void {
    this.offreService.getAllOffres().subscribe(
      (data: OffreStageDTO[]) => {
        this.offres = data || [];  // Ensure offres is always an array
        this.allOffres = data || [];  // Ensure allOffres is always an array
        this.filteredOffres = data || [];  // Ensure filteredOffres is always an array
      },
      (error) => console.error('Erreur lors du chargement des offres :', error)
    );
  }


  /**
   * Charge les localisations disponibles depuis le backend.
   */
  loadLocations(): void {
    this.offreService.getLocations().subscribe(
      (data: string[]) => this.locations = data,
      (error) => console.error('Erreur lors du chargement des localisations :', error)
    );
  }

  /**
   * Charge les offres associées au recruteur connecté.
   */


  /**
   * Filtre les offres en fonction des critères sélectionnés.
   */
  applyFilters(): void {
    this.filteredOffres = this.allOffres.filter(offre => {
      const matchesDomain = this.selectedDomain ? offre.domaine === this.selectedDomain : true;
      const matchesLocation = this.selectedLocation ? offre.location === this.selectedLocation : true;
      const matchesSalary = this.selectedSalary ? Number(offre.salaire) <= Number(this.selectedSalary) : true;

      return matchesDomain && matchesLocation && matchesSalary;
    });
  }

  /**
   * Méthode déclenchée lors du changement de filtre.
   */
  onFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Recherche des offres basées sur un mot-clé.
   */
  onSearch(): void {
    if (this.searchKeyword.trim()) {
      this.offreService.searchOffres(this.searchKeyword).subscribe(
        (data: OffreStageDTO[]) => {
          this.filteredOffres = data || [];  // Ensure filteredOffres is an empty array if data is null or undefined
          console.log(this.filteredOffres.length);
        },
        (error) => console.error('Erreur lors de la recherche :', error)
      );
    } else {
      this.offres = this.allOffres;
      this.applyFilters();
    }
  }


  /**
   * Réinitialise tous les filtres.
   */
  resetFilters(): void {
    this.selectedDomain = '';
    this.selectedLocation = '';
    this.selectedSalary = '';
    this.searchKeyword = '';
    this.applyFilters();
  }


  navigateToForm(): void {
    if (!this.interviewExistsResult) {
      this.router.navigate(['/recruiter/interview-form']); // Inject Router in the constructor
    }
  }

}
