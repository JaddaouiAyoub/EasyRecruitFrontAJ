import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, switchMap} from 'rxjs';
import {OffreStageDTO} from "../../models/offre-stage-dto.model";
import {CandidatureDTO} from "../../models/candidature-dto.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OffreService {
  private baseUrl = `${environment.baseUrl}/api/offres`; // Your backend URL
  private cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dkv5rbnf6/image/upload'; // Replace with your Cloudinary endpoint
  private cloudinaryPreset = 'slnp8xy4';

  constructor(private http: HttpClient) {}

  // Method to get all offres
  getAllOffres(): Observable<OffreStageDTO[]> {
    return this.http.get<OffreStageDTO[]>(`${this.baseUrl}`);
  }

  // Method to search offres by keyword
  searchOffres(keyword: string): Observable<OffreStageDTO[]> {
    return this.http.get<OffreStageDTO[]>(`${this.baseUrl}/search/${keyword}`);
  }

  getOffreById(id: number | undefined): Observable<OffreStageDTO> {
    return this.http.get<OffreStageDTO>(`${this.baseUrl}/${id}`);
  }


  // Récupérer les offres par recruteur (id du recruteur)
  getOffresByRecruteur(id: number | null): Observable<OffreStageDTO[]> {
    return this.http.get<OffreStageDTO[]>(`${this.baseUrl}/mes-offres/${id}`);
  }

  // getPaginatedOffres(page: number, size: number): Observable<OffreStageDTO[]> {
  //   return this.http.get<OffreStageDTO[]>(`${this.baseUrl}/paginated?page=${page}&size=${size}`);
  // }
  getPaginatedOffres(page: number, size: number): Observable<{ content: OffreStageDTO[]; totalPages: number; totalElements: number }> {
    return this.http.get<{ content: OffreStageDTO[]; totalPages: number; totalElements: number }>(
      `${this.baseUrl}/paginated?page=${page}&size=${size}`
    );
  }

  getRelatedOffers(keyword: string, category?: string, location?: string , excludeId?: number): Observable<OffreStageDTO[]> {
    const params: any = { keyword };
    params.excludeId = excludeId;
    if (category) params.category = category.toUpperCase();
    if (location) params.location = location;

    return this.http.get<OffreStageDTO[]>(`${this.baseUrl}/related`, { params });
  }

  // Upload the file to Cloudinary
  uploadPhoto(photo: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', photo);
    formData.append('upload_preset', this.cloudinaryPreset);

    return this.http.post<any>(this.cloudinaryUrl, formData).pipe(
      map(response => response.secure_url) // Extract secure URL
    );
  }

  // Post offer to the backend
  postOffre(offre: OffreStageDTO, photo?: File | null): Observable<OffreStageDTO> {
    if (photo) {
      return this.uploadPhoto(photo).pipe(
        switchMap(photoUrl => {
          offre.photo = photoUrl; // Assign Cloudinary URL
          return this.http.post<OffreStageDTO>(this.baseUrl, offre);
        })
      );
    } else {
      return this.http.post<OffreStageDTO>(this.baseUrl, offre);
    }
  }

  updateOffre(id: number, offre: OffreStageDTO, photo: File | null): Observable<OffreStageDTO> {
    if (photo) {
      // Si une nouvelle photo est sélectionnée, on télécharge l'image sur Cloudinary
      return this.uploadPhoto(photo).pipe(
        switchMap(photoUrl => {
          offre.photo = photoUrl; // Assigner l'URL de la photo téléchargée à l'offre
          console.log("offre updated" + offre)
          return this.http.put<OffreStageDTO>(`${this.baseUrl}/${id}`, offre); // Mettre à jour l'offre avec la nouvelle photo
        })
      );
    } else {
      // Si aucune nouvelle photo, on met à jour l'offre sans changer la photo
      return this.http.put<OffreStageDTO>(`${this.baseUrl}/${id}`, offre);
    }
  }

  deleteOffer(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Récupérer les candidatures pour une offre
  getCandidatures(offreId: number): Observable<CandidatureDTO[]> {
    return this.http.get<CandidatureDTO[]>(`${this.baseUrl}/${offreId}/candidatures`);
  }

  // Nouvelle méthode pour récupérer la liste des locations
  getLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/locations`); // Ajustez l'URL selon votre API
  }

}
