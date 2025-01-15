import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RecruiterDashboardComponent} from "./components/recruiter-dashboard/recruiter-dashboard.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {OffersComponent} from "./components/offers/offers.component";
import {JobPostingComponent} from "./components/job-posting/job-posting.component";
import {OfferPageComponent} from "./components/offer-page/offer-page.component";
import {InterviewFormComponent} from "./components/interview/interview-form/interview-form.component";
import {CandidatesComponent} from "./components/candidates/candidates.component";
import {MesOffresComponent} from "./components/mes-offres/mes-offres.component";
import {InterviewsListComponent} from "./components/interview/interviews-list/interviews-list.component";


const routes: Routes = [

  {path: 'dashboard'  , component : RecruiterDashboardComponent , data: { title: 'EasyRecruit - Dashboard' }},
  {path: 'recruiter-profile', component : ProfileComponent , data: { title: 'EasyRecruit - My Profile' }},
  {path: 'internship-offers' , component : OffersComponent , data: { title: 'EasyRecruit - Offers' }},
  {path: 'offer-posting/:id' , component : JobPostingComponent , data: { title: 'EasyRecruit - Update your offer' }},
  {path: 'offer-posting' , component : JobPostingComponent , data: { title: 'EasyRecruit - Create a new offer' }},
  { path: 'offer/:id', component: OfferPageComponent , data: { title: 'EasyRecruit - Offer' } },
  {path: 'offer-page' , component : OfferPageComponent , data: { title: 'EasyRecruit - offer' }},
  {path: 'interview-form', component : InterviewFormComponent , data: { title: 'EasyRecruit - Create Interview' }},
  {path: 'candidatures', component : CandidatesComponent , data: { title: 'EasyRecruit - My Candidates' }},
  {path: 'mes-offres', component : MesOffresComponent , data: { title: 'EasyRecruit - My offers' }},
  {path: 'interview-list', component : InterviewsListComponent , data: { title: 'EasyRecruit - Interviews List' }}



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruiterRoutingModule {

}
