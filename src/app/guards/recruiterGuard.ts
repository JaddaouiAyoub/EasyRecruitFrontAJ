import {Router} from "@angular/router";
import {inject} from "@angular/core";

export const recruiterGuard = () => {
  const router = inject(Router);

  const user = localStorage.getItem('user');
  if (user) {
    const role = JSON.parse(user)['role'];
    if (role === 'RECRUTEUR') {
      return true; // Accès autorisé
    }
  }

  router.navigate(['/auth']); // Redirige vers login
  return false; // Accès refusé
};
