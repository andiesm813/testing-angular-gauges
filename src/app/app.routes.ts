import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'progress', pathMatch: 'full' },
  {
    path: 'progress',
    loadComponent: () => import('../progress-gauge/progress-gauge').then(m => m.ProgressGaugeComponent)
  },
  {
    path: 'status',
    loadComponent: () => import('../Status-gauge/status-gauge.component').then(m => m.StatusGaugeComponent)
  }
];
