import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {environment} from "../../../environments/environment";
import {RecruteurDTO} from "../../models/recruteur-dto.model";

@Injectable({
  providedIn: 'root',
})
export class RecruteurService {
  private apiUrl = `${environment.baseUrl}/api/recruteurs`; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  /**
   * Récupérer tous les recruteurs
   * @returns Observable<RecruteurDTO[]>
   */
  getAllRecruteurs(): Observable<RecruteurDTO[]> {
    return this.http.get<RecruteurDTO[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  /**
   * Créer un nouveau recruteur
   * @param recruteur RecruteurDTO
   * @returns Observable<RecruteurDTO | string>
   */
  createRecruteur(recruteur: RecruteurDTO): Observable<RecruteurDTO | string> {
    return this.http.post<RecruteurDTO | string>(this.apiUrl, recruteur).pipe(catchError(this.handleError));
  }

  /**
   * Récupérer un recruteur par ID
   * @param id number
   * @returns Observable<RecruteurDTO>
   */
  getRecruteurById(id: number): Observable<RecruteurDTO> {
    return this.http.get<RecruteurDTO>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Mettre à jour un recruteur
   * @param id number
   * @param recruteur RecruteurDTO
   * @returns Observable<RecruteurDTO>
   */
  updateRecruteur(id: number | null, recruteur: RecruteurDTO): Observable<RecruteurDTO> {
    console.log('Data sent to backend:', recruteur); // Vérifiez les données envoyées ici
    return this.http.put<RecruteurDTO>(`${this.apiUrl}/${id}`, recruteur).pipe(catchError(this.handleError));
  }


  /**
   * Supprimer un recruteur par ID
   * @param id number
   * @returns Observable<void>
   */
  deleteRecruteur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Gestion des erreurs HTTP
   * @param error HttpErrorResponse
   * @returns Observable<never>
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Server error: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
