import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.baseUrl}/api/dashboard`; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  getDashboardData(recruteurId: number | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${recruteurId}`);
  }
}
