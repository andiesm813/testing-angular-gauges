import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'compare', pathMatch: 'full' },
  {
    path: 'compare',
    loadComponent: () => import('../compare-gauge/compare-gauge.component').then(m => m.CompareGaugeComponent)
  },
  {
    path: 'progress',
    loadComponent: () => import('../progress-gauge/progress-gauge').then(m => m.ProgressGaugeComponent)
  },
  {
    path: 'status',
    loadComponent: () => import('../Status-gauge/status-gauge.component').then(m => m.StatusGaugeComponent)
  }
];
