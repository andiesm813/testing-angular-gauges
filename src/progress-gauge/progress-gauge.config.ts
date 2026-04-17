import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { progressGaugeRoutes } from './progress-gauge.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

export const progressGaugeConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(progressGaugeRoutes)],
};
