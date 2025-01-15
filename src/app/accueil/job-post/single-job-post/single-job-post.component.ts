import { Component, Input } from '@angular/core';
import {OffreStageDTO} from "../../../models/offre-stage-dto.model";

@Component({
  selector: 'app-single-job-post',
  templateUrl: './single-job-post.component.html',
  styleUrls: ['./single-job-post.component.css']
})
export class SingleJobPostComponent {
  @Input() job: OffreStageDTO | undefined; // Reçoit les données de l'offre d'emploi via le parent
}
