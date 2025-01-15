import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);

  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');

  if (token && user) {
    const userObject = JSON.parse(user);
    const role = userObject['role'];

    if (role === 'CANDIDAT') {
      router.navigate(['/candidate/dashboard']);
    } else if (role === 'RECRUTEUR') {
      router.navigate(['/recruiter/dashboard']);
    }
    return false; // Empêche d'accéder à la route actuelle.
  }

  // Si aucun token, laisser accéder à la route (exemple : login).
  return true;
};
