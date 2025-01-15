import { Injectable } from '@angular/core';
import { InterviewResult } from './interview-evaluation.service';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private fullName: string = '';
  private userString: string | null = null;
  private user: any;
  private logoData;

  constructor() {
    this.userString = localStorage.getItem('user');
    if (this.userString) {
      try {
        this.user = JSON.parse(this.userString);
        if (this.user.firstName && this.user.lastName) {
          this.fullName = `${this.user.firstName} ${this.user.lastName}`;
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
    this.logoData="data:image/jpeg;base64,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";
  }

  generateInterviewReport(interviewResults: InterviewResult[]): Blob {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const sectionSpacing = 12;
    const contentWidth = pageWidth - margin * 2;

    const logoDataUrl = this.logoData;
    const logoWidth = 40, logoHeight = 20;
    const logoX = (pageWidth - logoWidth) / 2, logoY = margin;

    if (logoDataUrl) {
      pdf.addImage(logoDataUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);
    }
    let yOffset = logoY + logoHeight + sectionSpacing;

    pdf.setFont('helvetica', 'bold').setFontSize(16);
    pdf.text('Interview Report', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += sectionSpacing;

    pdf.setFont('helvetica', 'normal').setFontSize(12);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, margin, yOffset);
    pdf.text(`Candidate Name: ${this.fullName}`, margin, yOffset + 10);
    yOffset += sectionSpacing + 10;

    interviewResults.forEach((result, index) => {
      if (yOffset + 50 > pageHeight - margin) {
        pdf.addPage();
        yOffset = margin;
      }

      const {
        question = 'Question non disponible',
        userResponse = 'Réponse non disponible',
        response: {
          correctedResponse = 'Réponse corrigée non disponible',
          skillsMentioned = [],
          evaluationParagraph = 'Évaluation non disponible',
          suggestions = 'Aucune suggestion disponible',
          totalScore = 'Non disponible',
        } = {},
      } = result;

      pdf.setFont('helvetica', 'bold').setFontSize(14);
      pdf.text(`${index + 1}. ${question}`, margin, yOffset);
      yOffset += sectionSpacing;

      pdf.setFont('helvetica', 'normal').setFontSize(12);
      pdf.text('Candidate Response:', margin, yOffset);
      yOffset += 8;
      yOffset = this.addMultilineText(pdf, userResponse, margin, yOffset, contentWidth);

      pdf.text('Corrected Response:', margin, yOffset);
      yOffset += 8;
      yOffset = this.addMultilineText(pdf, correctedResponse, margin, yOffset, contentWidth);

      pdf.text(`Skills Mentioned: ${skillsMentioned.join(', ') || 'Aucune compétence mentionnée'}`, margin, yOffset);
      yOffset += sectionSpacing;

      pdf.text(`Score: ${totalScore}/10`, margin, yOffset);
      yOffset += 10;
      pdf.text('Evaluation:', margin, yOffset);
      yOffset += 8;
      // yOffset = this.addMultilineText(pdf, evaluationParagraph, margin, yOffset, contentWidth);

      pdf.text('Suggestions:', margin, yOffset);
      yOffset += 8;
      yOffset = this.addMultilineText(pdf, suggestions, margin, yOffset + 10, contentWidth);
    });

    return pdf.output('blob');
  }

  private addMultilineText(pdf: jsPDF, text: string, x: number, y: number, maxWidth: number): number {
    const cleanedText = text.trim().replace(/\s+/g, ' ');
    const lines = pdf.splitTextToSize(cleanedText, maxWidth);
    pdf.text(lines, x, y);
    return y + lines.length * pdf.getLineHeight();
  }

  generateCandidateReport(interviewResults: InterviewResult[]): Blob {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const sectionSpacing = 12;
    let yOffset = margin + 20;

    const logoDataUrl = this.logoData;
    const logoWidth = 40, logoHeight = 20;
    const logoX = (pageWidth - logoWidth) / 2, logoY = margin;

    if (logoDataUrl) {
      pdf.addImage(logoDataUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);
      yOffset = logoY + logoHeight + sectionSpacing;
    }

    pdf.setFont('helvetica', 'bold').setFontSize(16);
    pdf.text('Candidate Interview Report', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += sectionSpacing + 10;

    pdf.setFont('helvetica', 'normal').setFontSize(12);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, margin, yOffset);
    pdf.text(`Candidate Name: ${this.fullName}`, margin, yOffset + 10);
    yOffset += sectionSpacing + 20;

    interviewResults.forEach((result, index) => {
      if (yOffset + 60 > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yOffset = margin;
      }

      const {
        question,
        userResponse,
        response: { correctedResponse, suggestions },
      } = result;

      pdf.setFont('helvetica', 'bold').text(`${index + 1}. ${question}`, margin, yOffset);
      yOffset += sectionSpacing;

      pdf.setFont('helvetica', 'normal').text('Your Response:', margin, yOffset);
      yOffset += sectionSpacing;
      yOffset = this.addMultilineText(pdf, userResponse, margin, yOffset, pageWidth - margin * 2);

      yOffset += sectionSpacing;
      pdf.text('Corrected Response:', margin, yOffset);
      yOffset += sectionSpacing;
      yOffset = this.addMultilineText(pdf, correctedResponse, margin, yOffset, pageWidth - margin * 2);

      yOffset += sectionSpacing;
      pdf.text('Suggestions for Improvement:', margin, yOffset);
      yOffset += sectionSpacing;
      yOffset = this.addMultilineText(pdf, suggestions, margin, yOffset, pageWidth - margin * 2);

      yOffset += sectionSpacing;
    });

    return pdf.output('blob');
  }

  generateRecruiterReport(interviewResults: InterviewResult[], remarks: Set<string>): { pdfBlob: Blob; averageScore: number } {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const sectionSpacing = 12;
    let totalScore = 0;

    const logoWidth = 40, logoHeight = 20, logoX = (pageWidth - logoWidth) / 2, logoY = margin;

    if (this.logoData) pdf.addImage(this.logoData, 'PNG', logoX, logoY, logoWidth, logoHeight);
    let yOffset = logoY + logoHeight + sectionSpacing;

    pdf.setFont('helvetica', 'bold').setFontSize(16);
    pdf.text('Recruiter Interview Report', pageWidth / 2, yOffset, { align: 'center' });
    yOffset += sectionSpacing;

    pdf.setFont('helvetica', 'normal').setFontSize(12);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, margin, yOffset);
    pdf.text(`Candidate Name: ${this.fullName}`, margin, yOffset + 10);
    yOffset += sectionSpacing + 15;

    interviewResults.forEach((result, index) => {
      if (yOffset + 60 > pageHeight - margin) {
        pdf.addPage();
        yOffset = margin;
      }

      const { question, userResponse, response: { skillsMentioned, evaluationParagraph, totalScore: score } } = result;

      pdf.setFont('helvetica', 'bold').text(`${index + 1}. ${question}`, margin, yOffset);
      yOffset += sectionSpacing;

      pdf.setFont('helvetica', 'normal').text('Candidate Response:', margin, yOffset);
      yOffset += sectionSpacing;
      yOffset = this.addMultilineText(pdf, userResponse, margin, yOffset, pageWidth - margin * 2);

      pdf.text(`Skills Mentioned: ${skillsMentioned.join(', ') || 'None'}`, margin, yOffset);
      yOffset += sectionSpacing;

      pdf.text('Evaluation:', margin, yOffset);
      yOffset += sectionSpacing;
      // yOffset = this.addMultilineText(pdf, evaluationParagraph, margin, yOffset, pageWidth - margin * 2);

      pdf.text(`Score: ${score}/10`, margin, yOffset);
      yOffset += sectionSpacing;

      totalScore += score;
    });

    const averageScore = (totalScore / interviewResults.length) || 0;
    if (yOffset + 20 > pageHeight - margin) {
      pdf.addPage();
      yOffset = margin;
    }
    pdf.text(`Average Score: ${averageScore.toFixed(2)}/10`, margin, yOffset);
    yOffset += sectionSpacing;

    if (remarks.size > 0) {
      if (yOffset + 30 > pageHeight - margin) {
        pdf.addPage();
        yOffset = margin;
      }
      pdf.setFont('helvetica', 'bold').setFontSize(14).text('Remarks', margin, yOffset);
      yOffset += sectionSpacing;

      Array.from(remarks).forEach((remark, index) => {
        if (yOffset + 10 > pageHeight - margin) {
          pdf.addPage();
          yOffset = margin;
        }
        pdf.setFont('helvetica', 'normal').text(`${index + 1}. ${remark}`, margin, yOffset);
        yOffset += sectionSpacing;
      });
    }

    return { pdfBlob: pdf.output('blob'), averageScore };
  }
}
