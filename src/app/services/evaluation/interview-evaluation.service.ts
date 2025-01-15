import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InterviewResult {
  question: string;
  userResponse: string;
  response: {
    correctedResponse: string;
    skillsMentioned: string[];
    evaluationParagraph: string;
    suggestions: string; // Ajout de la section Suggestions
    totalScore: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class InterviewEvaluationService {
  private apiUrl = 'https://chatgpt-42.p.rapidapi.com/conversationllama3';
  private headers = {
    'x-rapidapi-key': '1c8b9763d9mshafd0b292952042cp16c28ejsnae580d916dc8',
    'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
    'Content-Type': 'application/json',
  };

  private interviewResults: InterviewResult[] = [];

  constructor(private http: HttpClient) {
  }

  getResults(): InterviewResult[] {
    console.log('Appel a la fonction pour avoire les résultats ', this.interviewResults)
    return this.interviewResults;
  }

  evaluateResponse(question: string, userResponse: string): Observable<any> {
    const payload = {
      messages: [
        {role: 'user', content: `Question: ${question}`},
        {role: 'user', content: `Response: ${userResponse}`},
        {
          role: 'assistant',
          content: `Act as a recruiter. Correct the response if necessary and analyze it.
              Identify skills mentioned, even if poorly written.
              Generate a summary paragraph evaluating the overall quality of the response.
              Identify specific points that could improve the response and present them in a "Suggestions for Improvement" section.
              Return a global score out of 10 in the following format:

              Corrected Response:
              [corrected text]

              Score Total:
              [score out of 10]

              Evaluation Paragraph:
              [evaluation]

              Skills Mentioned:
              [skills list]

              Suggestions for Improvement:
              [short improvement paragraph]`
        },
      ],
      web_access: false,
    };

    return this.http.post(this.apiUrl, payload, {headers: this.headers});
  }

  addResult(question: string, userResponse: string, apiResponse: any): void {
    const correctedResponse = this.extractCorrectedResponse(apiResponse.result);
    const skillsMentioned = this.extractSkillsMentioned(apiResponse.result);
    const evaluationParagraph = this.extractEvaluationParagraph(apiResponse.result);
    const suggestions = this.extractSuggestions(apiResponse.result); // Extraction des suggestions
    const totalScore = this.extractTotalScore(apiResponse.result);

    const result: InterviewResult = {
      question,
      userResponse,
      response: {
        correctedResponse,
        skillsMentioned,
        evaluationParagraph,
        suggestions,
        totalScore,
      },
    };

    this.interviewResults.push(result);
  }

  private extractCorrectedResponse(result: string): string {
    const match = result.match(/Corrected Response:\s*([\s\S]+?)\n\s*Score Total:/);
    return match ? match[1].trim() : 'Corrected response not found.';
  }

  private extractSkillsMentioned(result: string): string[] {
    const match = result.match(/Skills Mentioned:\s*([\s\S]+?)(?:\n\s*\n|$)/); // Capturer tout après "Skills Mentioned" jusqu'à une ligne vide ou la fin
    if (match) {
      // Diviser les compétences listées par lignes en utilisant '*' ou autre symbole de liste
      return match[1]
        .split('\n') // Divise par lignes
        .map(skill => skill.replace(/^\*+\s*/, '').trim()) // Supprime les symboles '*' et espaces au début
        .filter(skill => skill.length > 0); // Supprime les lignes vides
    }
    return [];
  }

  private extractEvaluationParagraph(result: string): string {
    const match = result.match(/Evaluation Paragraph:\s*([\s\S]+)/);
    return match ? match[1].trim() : 'Evaluation paragraph not found.';
  }
  private extractSuggestions(result: string): string {
    const match = result.match(/Suggestions for Improvement:\s*([\s\S]+)/);
    return match ? match[1].trim() : 'Suggestions not found.';
  }
  private extractTotalScore(result: string): number {
    const match = result.match(/Score Total:\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
