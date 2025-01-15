import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from "../services/auth/auth.service";

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Exclure les requêtes qui commencent par "/auth"
    if (req.url.includes('/auth') || req.url.includes('/api/candidats')) {
      console.log('Request bypassed without modification.');
      return next.handle(req); // Passer directement la requête sans modification
    }

    // Récupérer le token depuis le localStorage
    const accessToken = localStorage.getItem('access_token');

    // Ajouter le token aux en-têtes de la requête si disponible
    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`, // Correction de la syntaxe
        },
      });
    }

    // Envoyer la requête
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Vérifier si l'erreur est une 401 Unauthorized (token expiré)
        if (error.status === 401 && accessToken) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error); // Passer l'erreur si ce n'est pas une 401
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      // Si aucun refresh_token n'est disponible, rediriger vers la page de login
      this.authService.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    // Tenter de rafraîchir le token
    return this.authService.refreshToken(refreshToken).pipe(
      switchMap((response) => {
        // Mettre à jour les tokens dans le localStorage
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);

        // Réessayer la requête initiale avec le nouveau token
        const newAuthReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${response.access_token}`, // Correction de la syntaxe
          },
        });
        return next.handle(newAuthReq);
      }),
      catchError((refreshError) => {
        // Si le rafraîchissement échoue, déconnecter l'utilisateur
        this.authService.logout();
        return throwError(() => refreshError);
      })
    );
  }
}
