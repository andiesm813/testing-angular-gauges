import { Injectable, signal } from '@angular/core';
import { PALETTE } from './gauge-data';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private static readonly STORAGE_KEY = 'ignite-gauges-theme';

  private readonly colorMap = new Map<string, string>([
    [PALETTE.light.good,    PALETTE.dark.good],
    [PALETTE.light.warning, PALETTE.dark.warning],
    [PALETTE.light.danger,  PALETTE.dark.danger],
  ]);

  readonly darkMode = signal(this.getInitialValue());

  toggle(): void {
    const next = !this.darkMode();
    this.darkMode.set(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ThemeService.STORAGE_KEY, next ? 'dark' : 'light');
    }
  }

  resolveColor(lightHex: string): string {
    return this.darkMode() ? (this.colorMap.get(lightHex) ?? lightHex) : lightHex;
  }

  private getInitialValue(): boolean {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(ThemeService.STORAGE_KEY);
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
