import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dkv5rbnf6/image/upload'; // Replace with your Cloudinary endpoint
  private cloudinaryPreset = 'slnp8xy4';

  constructor(private http: HttpClient) { }

  uploadFile(photo: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', photo);
    formData.append('upload_preset', this.cloudinaryPreset);

    return this.http.post<any>(this.cloudinaryUrl, formData).pipe(
      map(response => response.secure_url) // Extract secure URL
    );
  }
}
