import {Role} from "./role.enum";

export interface CandidatDTO {
  id: number|null;
  email: string;
  password: string;
  role: Role.CANDIDAT;
  cvUrl: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber:string;
  linkedin:string;
  profilPic : string | null
}
