import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {EmailDTO} from "../../models/email-dto.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = `${environment.baseUrl}/api/emails`; // URL de l'API backend

  constructor(private http: HttpClient) {}

  /**
   * Envoie un email en utilisant le backend.
   * @param emailDTO - Les données de l'email à envoyer.
   * @returns Observable<string> - Réponse du backend.
   */
  sendEmail(emailDTO: EmailDTO): Observable<string> {
    return this.http.post<any>(`${this.apiUrl}/send`, emailDTO);
  }
}
