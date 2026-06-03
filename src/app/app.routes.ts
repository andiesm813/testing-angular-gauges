import { Routes } from '@angular/router';
import { GaugesComponent } from './gauges/gauges.component';
import { SecondPageComponent } from './second-page/second-page.component';
import { StatusPageComponent } from './status-page/status-page.component';
import { StatusStyleV2Component } from './status-style-v2/status-style-v2.component';

export const routes: Routes = [
  { path: '', component: GaugesComponent },
  { path: 'second-page', component: SecondPageComponent },
  { path: 'status-style-v1', component: StatusPageComponent },
  { path: 'status-style-v2', component: StatusStyleV2Component },
];
