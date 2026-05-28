import { Routes } from '@angular/router';
import { GaugesComponent } from './gauges/gauges.component';
import { SecondPageComponent } from './second-page/second-page.component';
import { StatusPageComponent } from './status-page/status-page.component';

export const routes: Routes = [
  { path: '', component: GaugesComponent },
  { path: 'second-page', component: SecondPageComponent },
  { path: 'status-page', component: StatusPageComponent },
];
