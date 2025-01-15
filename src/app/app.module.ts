import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';
import { CandidateModule } from './modules/candidate/candidate.module';
import { RecruiterModule } from './modules/recruiter/recruiter.module';
import { SignUpLoginModule } from './modules/sign-up-login/sign-up-login.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {Interceptor} from "./interceptors/interceptor";
import { AccueilModule } from './accueil/accueil.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from "@angular/material/icon";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideAnimations} from "@angular/platform-browser/animations";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";


@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    RouterModule,
    CandidateModule,
    RecruiterModule,
    SignUpLoginModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    AccueilModule,
    MatSnackBarModule
  ],
  providers: [
    provideAnimationsAsync(),
    /*{
      provide: HTTP_INTERCEPTORS,

      useClass: Interceptor,
      multi: true, // Important pour permettre plusieurs interceptors
    },**/
    MatIconModule

  ],
    // {
    //   provide: HTTP_INTERCEPTORS,
    //
    //   useClass: Interceptor,
    //   multi: true, // Important pour permettre plusieurs interceptors
    // },

  bootstrap: [AppComponent],
})
export class AppModule {}
