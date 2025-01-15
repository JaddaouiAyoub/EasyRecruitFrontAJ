import {CandidatDTO} from "./candidat-dto.model";
import {OffreStageDTO} from "./offre-stage-dto.model";

export class CandidatureDTO {
  candidatureId : number | undefined ;
  candidatDTO: CandidatDTO | undefined; // ID du candidat
  candidatId :  number | undefined ;
  offreStageDTO: OffreStageDTO | undefined; // ID de l'offre
  offreId : number | undefined ;
  lettreMotivation: string; // Lettre de motivation
  cv: string;         // Chemin ou contenu du CV
  etat : string;
  scoreInitial: number; // Score final du candidat
  scoreFinal: number; // Score final du candidat
  date : Date | undefined;
  rapport : string

  constructor(
    lettreMotivation: string = '',
    cv: string = '',
    etat : string = '',
    scoreFinal: number = 0.0,
    scoreInitial: number = 0.0,
    rapport : string = ''
  ) {
    // @ts-ignore
    this.candidatDTO = new CandidatDTO();
    this.offreStageDTO = new OffreStageDTO();
    this.lettreMotivation = lettreMotivation;
    this.cv = cv;
    this.scoreFinal = scoreFinal;
    this.etat = etat ;
    this.rapport = rapport
    this.scoreInitial = scoreInitial
  }
}
