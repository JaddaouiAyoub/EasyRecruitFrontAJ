import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccueilRoutingModule } from './accueil-routing.module';
import { AccueilPageComponent } from './accueilpage/accueilpage.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MainSearchComponent } from './main-search/main-search.component';
import { PopularCategoriesComponent } from './popular-categories/popular-categories.component';
import { JobPostComponent } from './job-post/job-post.component';
import { LatestNewsComponent } from './latest-news/latest-news.component';
import { SignupSectionComponent } from './signup-section/signup-section.component';
import {JobSidebarComponent} from "./job-post/job-sidebar/job-sidebar.component";
import {SingleJobPostComponent} from "./job-post/single-job-post/single-job-post.component";
import {BlogPostComponent} from "./latest-news/blog-post/blog-post.component";
import {FormsModule} from "@angular/forms";
import {SignUpLoginModule} from "../modules/sign-up-login/sign-up-login.module";

@NgModule({
  declarations: [
    AccueilPageComponent,
    HeaderComponent,
    FooterComponent,
    MainSearchComponent,
    PopularCategoriesComponent,
    JobPostComponent,
    LatestNewsComponent,
    SignupSectionComponent,
    SingleJobPostComponent, // Ajouté ici
    JobSidebarComponent,
    BlogPostComponent
  ],
  exports: [
    HeaderComponent, // Exporté pour utilisation dans d'autres modules
    FooterComponent,
    MainSearchComponent,
    PopularCategoriesComponent,
    JobPostComponent,
    LatestNewsComponent,
    SignupSectionComponent
  ],
  imports: [
    CommonModule, // Fournit *ngFor, *ngIf, etc.
    AccueilRoutingModule,
    FormsModule,
    SignUpLoginModule,
  ]
})
export class AccueilModule {}
