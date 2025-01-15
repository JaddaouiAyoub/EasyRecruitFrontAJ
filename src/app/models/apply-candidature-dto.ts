export interface CandidatureDTOApply {
  candidatureId?: number;          // ID de la candidature (optionnel, car généré par le backend)
  candidatId: number | undefined;              // ID du candidat
  offreId: number;                 // ID de l'offre
  lettreMotivation?: string | null;       // Lettre de motivation (optionnelle)
  cv?: string | null;                     // CV (optionnel, généralement un lien ou base64)
  scoreInitial?: number;           // Score initial du CV (optionnel)
  scoreFinal?: number;             // Score final (optionnel)
  date?: Date;                     // Date de la candidature (optionnelle)
  etat?: EtatCandidature;          // État de la candidature (optionnel)
}

// Énumération pour l'état de la candidature
export enum EtatCandidature {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE',
  NON_TRAITE = 'NON_TRAITE'
}
