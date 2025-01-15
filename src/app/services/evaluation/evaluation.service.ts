import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = 'https://chatgpt-42.p.rapidapi.com/conversationllama3';
  private apiKey = '1c8b9763d9mshafd0b292952042cp16c28ejsnae580d916dc8';

  constructor(private http: HttpClient) {}

  evaluateResponse(question: string, userResponse: string): Observable<any> {
    const payload = {
      messages: [
        { role: 'user', content: `Question: ${question}` },
        { role: 'user', content: `Response: ${userResponse}` },
        {
          role: 'assistant',
          content: `Act as a recruiter. Review and correct the response if necessary.
              Identify the skills mentioned, even if they are poorly written.
              Generate a summary paragraph evaluating the overall quality of the response.
              Provide a global score out of 10 for the response
              Additionally, identify specific points that could improve the response and present them in a "Suggestions for Improvement" short paragraph.
              in the following format:
              Corrected Response: [corrected text]
              Total Score: [score out of 10]
              Evaluation Paragraph: [evaluation].
              Suggestions for Improvement: [specific points].`
        }
      ],
      web_access: false
    };



    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com'
    });

    return this.http.post<any>(this.apiUrl, payload, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de l’appel à l’API d’évaluation :', error);
        return throwError(() => new Error('Erreur d’évaluation.'));
      })
    );
  }
}
