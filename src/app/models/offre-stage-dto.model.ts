import {RecruteurDTO} from "./recruteur-dto.model";

export class OffreStageDTO {
  id: number | undefined;
  location: string;
  salaire: string;
  titre: string;
  description: string;
  datePublication: Date;
  domaine: string;
  photo: string;
  recruteurDTO: RecruteurDTO;
  keywords: string | undefined
  entretienId : number | undefined;

  constructor(
    location: string = '',
    salaire: string = '',
    titre: string = '',
    description: string = '',
    datePublication: Date = new Date(),
    domaine: string = '',
    photo : string = '',
    entretienId : number = 0
  ) {
    this.location = location;
    this.salaire = salaire;
    this.titre = titre;
    this.description = description;
    this.datePublication = datePublication;
    this.domaine = domaine;
    this.photo = photo ;
    this.entretienId = entretienId ;
    // @ts-ignore
    this.recruteurDTO = new RecruteurDTO();

  }
}
