import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilPageComponent } from './accueilpage/accueilpage.component';
import {FooterComponent} from "./shared/footer/footer.component";

const routes: Routes = [
  {path : '' , component : AccueilPageComponent},
  {path : 'accueil' , component : AccueilPageComponent},
  {path : 'footer' , component : FooterComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccueilRoutingModule {}
