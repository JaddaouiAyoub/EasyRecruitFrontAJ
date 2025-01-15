export interface EmailDTO {
  to: string; // Adresse email du destinataire
  subject: string; // Sujet de l'email
  variables: { [key: string]: any }; // Variables dynamiques pour l'email
}
