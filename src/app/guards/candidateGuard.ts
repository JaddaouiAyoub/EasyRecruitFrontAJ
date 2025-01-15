import {inject} from "@angular/core";
import {Router} from "@angular/router";

export const candidateGuard = () => {
  const router = inject(Router);

  const user = localStorage.getItem('user');
  if (user) {
    const role = JSON.parse(user)['role'];
    if (role === 'CANDIDAT') {
      return true; // Accès autorisé
    }
  }

  router.navigate(['/auth']); // Redirige vers login
  return false; // Accès refusé
};
