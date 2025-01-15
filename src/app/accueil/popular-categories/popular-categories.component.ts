import { Component } from '@angular/core';

@Component({
  selector: 'app-popular-categories',
  templateUrl: './popular-categories.component.html',
  styleUrls: ['./popular-categories.component.css'],
})
export class PopularCategoriesComponent {
  categories = [
    { name: 'Accountance', positions: 9, icon: 'fa fa-line-chart' },
    { name: 'Banking', positions: 9, icon: 'fa fa-university' },
    { name: 'Design & Art', positions: 36, icon: 'fa fa-pencil' },
  ];
}
