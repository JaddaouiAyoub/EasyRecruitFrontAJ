import {Role} from "./role.enum";

export class RecruteurDTO {
  id: number | null = null;
  email: string = '';
  password: string = '';
  role: Role = Role.RECRUTEUR;  // Assuming 'User' is a default role in your `Role` enum
  companyName: string = '';
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  profilPic : string = ''

  constructor() {
    // You can add additional logic here if necessary
  }
}
