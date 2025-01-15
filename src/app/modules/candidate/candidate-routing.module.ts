import {Component, NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { JobListingsComponent } from './components/job-listings/job-listings.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import {VideoSimulationComponent} from "./components/video-simulation/video-simulation.component";
import {ApplicationTrackingComponent} from "./components/application-tracking/application-tracking.component";
import {ApplicationFormComponent} from "./components/application-form/application-form.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {ReadyForInterviewComponent} from "./ready-for-interview/ready-for-interview.component";

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, // Tableau de bord par défaut
  { path: 'job-details/:id', component: JobDetailsComponent },
  { path: 'job-listings', component: JobListingsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'tracking', component: ApplicationTrackingComponent }, // Suivi des candidatures
  { path: 'application-form', component: ApplicationFormComponent },
  { path: 'candidate/video-simulation', component: VideoSimulationComponent }, // Simulation vidéo
  { path: 'candidate/readyForInterview', component: ReadyForInterviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateRoutingModule {}
