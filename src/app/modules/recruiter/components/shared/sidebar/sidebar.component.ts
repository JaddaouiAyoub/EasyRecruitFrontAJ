
import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../../services/auth/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userName: string | null = null; // Propriété pour stocker le nom d'utilisateur
  constructor(private authService:AuthService) {
  }
  ngOnInit(): void {
    const user = localStorage.getItem('user'); // Récupérer les données utilisateur de localStorage
    if (user) {
      const parsedUser = JSON.parse(user); // Convertir les données JSON en objet
      this.userName = parsedUser.username || 'Utilisateur'; // Assurez-vous que 'name' correspond à la clé utilisée
    }
  }
    logout() {
      console.log('appell a la fonction logout()')
      this.authService.logout();
    }

}
