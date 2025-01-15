import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = `${environment.baseUrl}/api/candidatures`; // Remplacez par votre URL backend

  constructor(private http: HttpClient) {}

  checkAuthorization(candidatureId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${candidatureId}/isAuthorized`);
  }
}
