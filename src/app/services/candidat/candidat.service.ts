import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {CandidatDTO} from "../../models/candidat-dto.model";

export interface Candidature {
  id: number;
  candidat: { id: number; nom: string; prenom: string }; // Ou utilisez une interface pour le candidat
  offre: { id: number; titre: string }; // Ou une interface pour OffreStage
  lettreMotivation: string;
  cv: string;
  scoreInitial?: number;
  scoreFinal?: number;
}


export interface JobOffer {
    id: number;
    title: string;
    description: string;
    deadline: string;
}

@Injectable({
    providedIn: 'root',
})
export class CandidatService {
    private apiUrl = `${environment.baseUrl}/api`;

    constructor(private http: HttpClient) {}

    /**
     * Récupérer les candidatures d'un candidat
     * @param candidateId ID du candidat
     * @returns Observable<Candidature[]>
     */
    getCandidaturesByCandidat(candidatId: number): Observable<any[]> {
        return this.http
            .get<any[]>(`${this.apiUrl}/candidatures/candidat/${candidatId}`)
            .pipe(catchError(this.handleError));
    }

    /**
     * Récupérer les candidatures pour une offre
     * @param offerId ID de l'offre
     * @returns Observable<Candidature[]>
     */
    getCandidaturesByOffer(offerId: number): Observable<Candidature[]> {
        return this.http
            .get<Candidature[]>(`${this.apiUrl}/candidatures/offre/${offerId}`)
            .pipe(catchError(this.handleError));
    }

    /**
     * Créer une nouvelle candidature pour une offre
     * @param offerId ID de l'offre
     * @param candidature Données de la candidature
     * @returns Observable<any>
     */
    createCandidature(offerId: number, candidature: any): Observable<any> {
        return this.http
            .post<any>(`${this.apiUrl}/candidatures/${offerId}`, candidature)
            .pipe(catchError(this.handleError));
    }
  getProfile(candidatId: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/candidats/${candidatId}`)
      .pipe(catchError(this.handleError));
  }



  updateProfile(candidat: CandidatDTO): Observable<CandidatDTO> {
    return this.http.put<CandidatDTO>(`${this.apiUrl}/candidats/${candidat.id}`, candidat);
  }



  getCandidatById(id: number): Observable<CandidatDTO> {
    return this.http.get<CandidatDTO>(`${this.apiUrl}/candidats/${id}`);
  }

  /**
     * Mettre à jour une candidature
     * @param candidatureId ID de la candidature
     * @param candidature Données mises à jour
     * @returns Observable<any>
     */
    updateCandidature(
        candidatureId: number,
        candidature: any
    ): Observable<any> {
        return this.http
            .put<any>(`${this.apiUrl}/candidatures/${candidatureId}`, candidature)
            .pipe(catchError(this.handleError));
    }

    /**
     * Supprimer une candidature
     * @param candidatureId ID de la candidature
     * @returns Observable<any>
     */
    deleteCandidature(candidatureId: number): Observable<any> {
        return this.http
            .delete<any>(`${this.apiUrl}/candidatures/${candidatureId}`)
            .pipe(catchError(this.handleError));
    }

    /**
     * Récupérer toutes les offres
     * @returns Observable<JobOffer[]>
     */
    // Récupérer toutes les offres
    getAllOffres(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/offres`).pipe(catchError(this.handleError));
    }

// Rechercher des offres par mot-clé
    searchOffers(keyword: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/offres/search/${keyword}`).pipe(catchError(this.handleError));
    }
    getRelatedJobs(keyword: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/offres/search/${keyword}`);
    }
// Récupérer les détails d'une offre par ID
    getOfferById(offerId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/offres/${offerId}`).pipe(catchError(this.handleError));
    }
    createCandidat(candidat: CandidatDTO): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/candidats`, candidat);  // Assurez-vous que l'endpoint backend existe
    }
    /**
     * Gestion des erreurs HTTP
     * @param error HttpErrorResponse
     * @returns Observable<never>
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Client error: ${error.error.message}`;
        } else {
            errorMessage = `Server error: ${error.status}\nMessage: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }


}
