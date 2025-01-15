import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router) {}

  // Méthode pour effectuer le login
  login(username: string, password: string): Observable<{ access_token: string; refresh_token: string; user: object }> {
    const body = { username, password };
    return this.http.post<{ access_token: string; refresh_token: string; user: object }>(
      `${this.baseUrl}/auth/login`, // Correction des accents graves
      body
    );
  }


  // Méthode pour rafraîchir le token
  refreshToken(refreshToken: string): Observable<{ access_token: string; refresh_token: string }> {
    return this.http.post<{ access_token: string; refresh_token: string }>(
      `${this.baseUrl}/refresh`, // Correction des accents graves
      { refreshToken }
    );
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.router.navigate(['']); // Redirigez vers la page de connexion
  }
}
