import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateRoutingModule } from './candidate-routing.module';
import { ApplicationFormComponent } from './components/application-form/application-form.component';
import { ApplicationTrackingComponent } from './components/application-tracking/application-tracking.component';
import { JobListingsComponent } from './components/job-listings/job-listings.component';
import { VideoSimulationComponent } from './components/video-simulation/video-simulation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './components/profile/profile.component';
import { RouterModule } from '@angular/router';
import {MatIcon} from "@angular/material/icon";
import {ReadyForInterviewComponent} from "./ready-for-interview/ready-for-interview.component";
import { NavbarComponent } from './components/navbar/navbar.component';
import {MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SignUpLoginModule} from "../sign-up-login/sign-up-login.module";

@NgModule({
    declarations: [
        DashboardComponent,
        ApplicationFormComponent,
        ApplicationTrackingComponent,
        JobListingsComponent,
        VideoSimulationComponent,
        JobDetailsComponent,
        ProfileComponent,
        ReadyForInterviewComponent,
        NavbarComponent
    ],
    imports: [
        CommonModule,
        CandidateRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        MatIcon,
        MatDialogClose,
        MatButton,
        MatDialogContent,
        MatDialogTitle,
        MatProgressSpinner,
        SignUpLoginModule,
        // Assurez-vous que ce module est bien ajouté pour les requêtes HTTP
    ],
    exports: [
        NavbarComponent
    ]
})
export class CandidateModule {}
