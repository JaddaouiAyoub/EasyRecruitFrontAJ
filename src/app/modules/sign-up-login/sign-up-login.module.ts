import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignUpLoginRoutingModule } from './sign-up-login-routing.module';
import {LoginComponent} from "./login/login.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AccueilModule} from "../../accueil/accueil.module";
import {CandidateModule} from "../candidate/candidate.module";



@NgModule({

    declarations: [
        LoginComponent,
        SignUpComponent
    ],
    exports: [
        LoginComponent,
      SignUpComponent
    ],
  imports: [
    CommonModule,
    SignUpLoginRoutingModule,
    FormsModule,
    RouterModule,
  ]
})
export class SignUpLoginModule { }
