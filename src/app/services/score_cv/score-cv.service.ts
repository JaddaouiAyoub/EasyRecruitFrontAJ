import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ScoreCvService {

  constructor(private http:HttpClient) { }

  calculateCVScore(cvFile: File, keywords: string | undefined): Observable<any> {
    const formData = new FormData();
    formData.append('cv_file', cvFile);
    formData.append('keywords', JSON.stringify(keywords));

    return this.http.post('http://127.0.0.1:8000/score-cv/', formData);
  }

}
