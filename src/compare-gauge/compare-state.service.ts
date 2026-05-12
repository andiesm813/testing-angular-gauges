import { Injectable, signal } from '@angular/core';

export type GaugeStyle = 'status' | 'progress';
export type InactiveRangeMode = 'keep' | 'remove' | 'gray';

@Injectable({ providedIn: 'root' })
export class CompareStateService {
  readonly gaugeStyle = signal<GaugeStyle>('status');
  readonly inactiveMode = signal<InactiveRangeMode>('keep');
}
