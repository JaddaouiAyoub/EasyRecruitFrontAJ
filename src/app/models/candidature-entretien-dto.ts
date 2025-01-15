export interface CandidatureEntretienDTO {
  candidatureId: number;
  offreTitre: string;
  offreId: number;
  etatCandidature: string;
  entretienId?: number; // Peut être null si pas d'entretien associé
  etatEntretien?: string; // Peut être null si pas d'entretien associé
}
