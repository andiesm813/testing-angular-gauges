import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { statusGaugeRoutes } from './status-gauge.routes';

export const statusGaugeConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(statusGaugeRoutes)
  ]
};
