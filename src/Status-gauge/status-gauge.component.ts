import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  IgxFormatLinearGraphLabelEventArgs,
  IgxFormatRadialGaugeLabelEventArgs,
  IgxLinearGaugeModule,
  IgxRadialGaugeModule
} from 'igniteui-angular-gauges';

interface GaugeRange {
  start: number;
  end: number;
  color: string;
}

interface GaugeData {
  id: string;
  title: string;
  units: string;
  value: number;
  ranges: GaugeRange[];
  thresholds: number[];
  min: number;
  max: number;
}

@Component({
  selector: 'status-gauge-root',
  imports: [CommonModule, IgxLinearGaugeModule, IgxRadialGaugeModule],
  templateUrl: './status-gauge.component.html',
  styleUrl: './status-gauge.component.css'
})
export class StatusGaugeComponent {
  private static readonly C = {
    good: '#6abf69',
    warning: '#f5c040',
    danger: '#e8736b',
  } as const;

  private static readonly DARK_C = {
    good: '#84d98b',
    warning: '#ffd166',
    danger: '#ff9b8f',
  } as const;

  private static readonly THEME_STORAGE_KEY = 'ignite-gauges-theme';

  protected darkMode = this.getInitialDarkMode();

  protected gauges: GaugeData[] = [
    {
      id: 'engine-temp',
      title: 'Engine Temperature',
      units: 'C',
      value: 64,
      ranges: [
        { start: 0, end: 45, color: StatusGaugeComponent.C.good },
        { start: 45, end: 75, color: StatusGaugeComponent.C.warning },
        { start: 75, end: 100, color: StatusGaugeComponent.C.danger }
      ],
      thresholds: [],
      min: 0,
      max: 0
    },
    {
      id: 'oil-pressure',
      title: 'Oil Pressure',
      units: 'psi',
      value: 88,
      ranges: [
        { start: 20, end: 55, color: StatusGaugeComponent.C.danger },
        { start: 55, end: 85, color: StatusGaugeComponent.C.warning },
        { start: 85, end: 120, color: StatusGaugeComponent.C.good }
      ],
      thresholds: [],
      min: 0,
      max: 0
    },
    {
      id: 'battery-health',
      title: 'Battery Health',
      units: '%',
      value: 28,
      ranges: [
        { start: 0, end: 30, color: StatusGaugeComponent.C.danger },
        { start: 30, end: 70, color: StatusGaugeComponent.C.warning },
        { start: 70, end: 100, color: StatusGaugeComponent.C.good }
      ],
      thresholds: [],
      min: 0,
      max: 0
    }
  ].map((gauge) => this.withComputedBounds(gauge));

  protected get gaugeLabelBrush(): string {
		return this.darkMode ? '#f8f9fa' : '#212529';
  }

  protected get gaugeSurfaceBrush(): string {
		return 'transparent';
  }

  protected get gaugeSurfaceOutlineBrush(): string {
		return 'transparent';
  }

  protected get gaugeNeedleBrush(): string {
		return this.darkMode ? '#f8f9fa' : '#111827';
  }

  protected get gaugeNeedleOutlineBrush(): string {
		return this.darkMode ? '#2a3442' : '#ffffff';
  }

  protected toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    this.persistThemePreference();
  }

  protected formatThresholdLabel(
    event: { sender: unknown; args: IgxFormatLinearGraphLabelEventArgs | IgxFormatRadialGaugeLabelEventArgs },
    gauge: GaugeData
  ): void {
    const value = event.args.value;
    const shouldShow = gauge.thresholds.some((threshold) => Math.abs(threshold - value) < 0.0001);

    event.args.label = shouldShow ? `${this.formatValue(value)}` : '';
  }

  protected isRangeActive(gauge: GaugeData, range: GaugeRange): boolean {
    const withinRange = gauge.value >= range.start && gauge.value < range.end;
    const onMaxBoundary = gauge.value === gauge.max && range.end === gauge.max;
    return withinRange || onMaxBoundary;
  }

  protected rangeBrush(gauge: GaugeData, range: GaugeRange): string {
    const color = this.themedColor(range.color);
    return this.isRangeActive(gauge, range) ? color : this.hexToRgba(color, this.darkMode ? 0.32 : 0.2);
  }

  protected rangeOutline(gauge: GaugeData, range: GaugeRange): string {
    const dark = this.darkenHex(this.themedColor(range.color), this.darkMode ? 0.82 : 0.6);
    return this.isRangeActive(gauge, range) ? dark : this.hexToRgba(dark, this.darkMode ? 0.7 : 0.45);
  }

  protected displayRangeStart(gauge: GaugeData, range: GaugeRange): number {
		if (range.start <= gauge.min) {
			return range.start;
		}

    return range.start + this.linearSegmentGap(gauge) / 2;
  }

  protected displayRangeEnd(gauge: GaugeData, range: GaugeRange): number {
		if (range.end >= gauge.max) {
			return range.end;
		}

    return range.end - this.linearSegmentGap(gauge) / 2;
  }

  protected displayRadialRangeStart(gauge: GaugeData, range: GaugeRange): number {
    if (range.start <= gauge.min) {
      return range.start;
    }

    return range.start + this.radialSegmentGap(gauge) / 2;
  }

  protected displayRadialRangeEnd(gauge: GaugeData, range: GaugeRange): number {
    if (range.end >= gauge.max) {
      return range.end;
    }

    return range.end - this.radialSegmentGap(gauge) / 2;
  }

  protected rangeInnerExtent(gauge: GaugeData, range: GaugeRange): number {
    return 0.38;
  }

  protected rangeOuterExtent(gauge: GaugeData, range: GaugeRange): number {
    return 0.63;
  }

  protected radialInnerExtent(gauge: GaugeData, range: GaugeRange): number {
    return 0.567;
  }

  protected radialOuterExtent(gauge: GaugeData, range: GaugeRange): number {
    return 0.733;
  }

  protected radialInterval(gauge: GaugeData): number {
    const differences = gauge.thresholds
      .slice(1)
      .map((threshold, index) => Math.abs(threshold - gauge.thresholds[index]))
      .filter((difference) => difference > 0);

    if (differences.length === 0) {
      return 1;
    }

    return differences.reduce((accumulator, value) => this.greatestCommonDivisor(accumulator, value));
  }

  private segmentGap(gauge: GaugeData): number {
    const span = Math.max(gauge.max - gauge.min, 1);
    return span * 0.015;
  }

  private linearSegmentGap(gauge: GaugeData): number {
    return this.segmentGap(gauge) * 0.6;
  }

  private radialSegmentGap(gauge: GaugeData): number {
    return this.segmentGap(gauge);
  }

  private withComputedBounds(gauge: Omit<GaugeData, 'min' | 'max'> & { min: number; max: number }): GaugeData {
    const rangeStarts = gauge.ranges.map((range) => range.start);
    const rangeEnds = gauge.ranges.map((range) => range.end);
    const min = Math.min(...rangeStarts);
    const max = Math.max(...rangeEnds);
    const thresholds = Array.from(new Set([min, max, ...rangeStarts, ...rangeEnds])).sort((a, b) => a - b);

    return {
      ...gauge,
      min,
      max,
      thresholds
    };
  }

  private formatValue(value: number): string {
    return Number.isInteger(value) ? `${value}` : value.toFixed(2);
  }

  private getInitialDarkMode(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const stored = window.localStorage.getItem(StatusGaugeComponent.THEME_STORAGE_KEY);

    if (stored === 'dark') {
      return true;
    }

    if (stored === 'light') {
      return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private persistThemePreference(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(StatusGaugeComponent.THEME_STORAGE_KEY, this.darkMode ? 'dark' : 'light');
  }

  private themedColor(color: string): string {
    const normalized = color.toLowerCase();

    if (!this.darkMode) {
      return normalized;
    }

    switch (normalized) {
      case StatusGaugeComponent.C.good:
        return StatusGaugeComponent.DARK_C.good;
      case StatusGaugeComponent.C.warning:
        return StatusGaugeComponent.DARK_C.warning;
      case StatusGaugeComponent.C.danger:
        return StatusGaugeComponent.DARK_C.danger;
      default:
        return normalized;
    }
  }

  private darkenHex(hex: string, factor: number): string {
    const normalized = hex.replace('#', '');
    const r = Math.round(Number.parseInt(normalized.slice(0, 2), 16) * factor);
    const g = Math.round(Number.parseInt(normalized.slice(2, 4), 16) * factor);
    const b = Math.round(Number.parseInt(normalized.slice(4, 6), 16) * factor);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private greatestCommonDivisor(left: number, right: number): number {
    let a = Math.round(left);
    let b = Math.round(right);

    while (b !== 0) {
      const remainder = a % b;
      a = b;
      b = remainder;
    }

    return Math.max(a, 1);
  }

  private hexToRgba(hex: string, alpha: number): string {
    const normalized = hex.replace('#', '');
    const red = Number.parseInt(normalized.slice(0, 2), 16);
    const green = Number.parseInt(normalized.slice(2, 4), 16);
    const blue = Number.parseInt(normalized.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
}
