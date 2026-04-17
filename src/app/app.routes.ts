import { Routes } from '@angular/router';
import { GaugesComponent } from './gauges/gauges.component';
import { SecondPageComponent } from './second-page/second-page.component';

export const routes: Routes = [
  { path: '', component: GaugesComponent },
  { path: 'second-page', component: SecondPageComponent },
];
