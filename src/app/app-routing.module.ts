import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AccueilPageComponent} from "./accueil/accueilpage/accueilpage.component";


import {authGuard} from "./guards/authGuard";
import {candidateGuard} from "./guards/candidateGuard";
import {recruiterGuard} from "./guards/recruiterGuard";
import {JobDetailsComponent} from "./modules/candidate/components/job-details/job-details.component";

const routes: Routes = [
  { path: '',
    canActivate: [authGuard],
   // component: AccueilPageComponent },
  loadChildren: () =>
    import('./accueil/accueil.module').then((m) => m.AccueilModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/sign-up-login/sign-up-login.module').then((m) => m.SignUpLoginModule),
  },
  {
    path: 'candidate',
    canActivate: [candidateGuard], // Garde spécifique pour les candidats
    loadChildren: () =>
      import('./modules/candidate/candidate.module').then((m) => m.CandidateModule),
  },
  {
    path: 'recruiter',
    canActivate: [recruiterGuard], // Garde spécifique pour les recruteurs
    loadChildren: () =>
      import('./modules/recruiter/recruiter.module').then((m) => m.RecruiterModule),
  },

  {
    path: 'login',
    canActivate: [authGuard], // Utilisez la fonction de garde ici
    loadChildren: () =>
      import('./modules/sign-up-login/sign-up-login.module').then((m) => m.SignUpLoginModule),
  },

  {
    path: 'job-details/:id', component: JobDetailsComponent
  },



];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
