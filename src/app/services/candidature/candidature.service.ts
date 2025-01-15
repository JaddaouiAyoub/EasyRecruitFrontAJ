import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CandidatureDTO} from "../../models/candidature-dto.model";
import {CandidatureDTOApply} from "../../models/apply-candidature-dto";
import {environment} from "../../../environments/environment";
import {CandidatureEntretienDTO} from "../../models/candidature-entretien-dto";

@Injectable({
  providedIn: 'root',
})
export class CandidatureService {
  private apiUrl = `${environment.baseUrl}/api/candidatures`; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  // Récupérer les candidatures par recruteur
  getCandidaturesByRecruteur(recruteurId: number | null): Observable<CandidatureDTO[]> {
    return this.http.get<CandidatureDTO[]>(`${this.apiUrl}/recruteur/${recruteurId}`);
  }

  getCandidaturesWithInterviews(candidatId: number): Observable<CandidatureEntretienDTO[]> {
    return this.http.get<CandidatureEntretienDTO[]>(
      `${this.apiUrl}/with-interviews?candidatId=${candidatId}`
    );
  }

  getCandidaturesByOffreAndEtat(id: number | null,etat : string): Observable<CandidatureDTO[]> {
    return this.http.get<CandidatureDTO[]>(`${this.apiUrl}/offre/${id}/${etat}`);
  }

  // Ajouter une candidature
  postuler(offreId: number, candidatureDTO: CandidatureDTOApply): Observable<any> {
    return this.http.post(`${this.apiUrl}/${offreId}`, candidatureDTO);
  }
  deleteCandidature(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Updates a candidature by ID with a new final score and report.
   *
   * @param id The ID of the candidature to update.
   * @param scoreFinal The new final score.
   * @param rapport The new report URL.
   * @returns An Observable of the updated candidature.
   */
  updateCandidature(id: number, scoreFinal: number, rapport: string): Observable<any> {
    const url = `${this.apiUrl}/${id}/update`;
    const params = {
      scoreFinal: scoreFinal.toString(),
      rapport: rapport,
    };
    return this.http.put<any>(url, {}, { params });
  }

  getCandidaturesByCandidat(candidatId: number): Observable<CandidatureDTO[]> {
    return this.http.get<CandidatureDTO[]>(`${this.apiUrl}/candidat/${candidatId}`);
  }
}
