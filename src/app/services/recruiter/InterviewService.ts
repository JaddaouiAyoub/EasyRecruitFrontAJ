import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import {EntretienDTO} from "../../models/entretien-dto";

@Injectable({
    providedIn: 'root'
})
export class InterviewService {
    private baseUrl = `${environment.baseUrl}/api/entretiens`; // Base URL de l'API


    constructor(private http: HttpClient) {}

    // Appelle l'API pour créer un entretien
  createEntretien(offreId: number | undefined, questions: string[]): Observable<string> {
        const url = `${this.baseUrl}/create/${offreId}`;
        return this.http.post(url, questions, { responseType: 'text' });
    }

    interviewExists(offreId : number) : Observable<boolean>{
        const url = `${this.baseUrl}/exists/${offreId}`;
        return this.http.get<boolean>(url);
    }

  // Méthode pour récupérer un entretien par ID
  getEntretienById(id: number | undefined): Observable<EntretienDTO> {
    return this.http.get<EntretienDTO>(`${this.baseUrl}/${id}`);
  }

  getEntretienByOffreId(offreId: number): Observable<EntretienDTO> {
    return this.http.get<EntretienDTO>(`${this.baseUrl}/by-offre/${offreId}`);
  }
}
