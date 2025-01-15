import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecruiterRoutingModule } from './recruiter-routing.module';
import { RecruiterDashboardComponent } from './components/recruiter-dashboard/recruiter-dashboard.component';
import { JobPostingComponent } from './components/job-posting/job-posting.component';

import {SidebarComponent} from "./components/shared/sidebar/sidebar.component";
import { ProfileComponent } from './components/profile/profile.component';
import { OffersComponent } from './components/offers/offers.component';
import { OfferPageComponent } from './components/offer-page/offer-page.component';

import { MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatGridListModule} from "@angular/material/grid-list";
import {HeaderComponent} from "./components/shared/header/header.component";

import { InterviewFormComponent } from './components/interview/interview-form/interview-form.component';
import {FormsModule} from "@angular/forms";
import {CandidatesComponent} from "./components/candidates/candidates.component";
import {MesOffresComponent} from "./components/mes-offres/mes-offres.component";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {InterviewsListComponent} from "./components/interview/interviews-list/interviews-list.component";




@NgModule({
    declarations: [
        RecruiterDashboardComponent,
        JobPostingComponent,
        SidebarComponent,
        SidebarComponent,
        ProfileComponent,
        OffersComponent,
        OfferPageComponent,
        HeaderComponent,
        InterviewFormComponent,
        CandidatesComponent,
      MesOffresComponent,
      InterviewsListComponent
    ],
    exports: [
        HeaderComponent
    ],
    imports: [
      CommonModule,
        RecruiterRoutingModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatCardModule,
        MatGridListModule,
        FormsModule,
      MatSnackBarModule,
    ]
})
export class RecruiterModule { }
