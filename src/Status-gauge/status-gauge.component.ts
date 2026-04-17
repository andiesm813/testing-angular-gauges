import { Component, inject } from '@angular/core';
import {
  IgxFormatLinearGraphLabelEventArgs,
  IgxFormatRadialGaugeLabelEventArgs,
  IgxLinearGaugeModule,
  IgxRadialGaugeModule
} from 'igniteui-angular-gauges';
import { SENSORS, GaugeRange } from '../shared/gauge-data';
import { ThemeService } from '../shared/theme.service';

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
  imports: [IgxLinearGaugeModule, IgxRadialGaugeModule],
  templateUrl: './status-gauge.component.html',
  styleUrl: './status-gauge.component.css'
})
export class StatusGaugeComponent {
  protected readonly themeService = inject(ThemeService);

  protected readonly gauges: GaugeData[] = SENSORS.map(sensor =>
    this.withComputedBounds({
      id: sensor.id,
      title: sensor.label,
      units: sensor.unit,
      value: sensor.value,
      ranges: sensor.ranges,
      thresholds: [],
      min: 0,
      max: 0
    })
  );

  protected get gaugeLabelBrush(): string {
    return this.themeService.darkMode() ? '#f8f9fa' : '#212529';
  }

  protected get gaugeSurfaceBrush(): string {
    return 'transparent';
  }

  protected get gaugeSurfaceOutlineBrush(): string {
    return 'transparent';
  }

  protected get gaugeNeedleBrush(): string {
    return this.themeService.darkMode() ? '#f8f9fa' : '#111827';
  }

  protected get gaugeNeedleOutlineBrush(): string {
    return this.themeService.darkMode() ? '#2a3442' : '#ffffff';
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
    const isDark = this.themeService.darkMode();
    const color = this.themeService.resolveColor(range.color);
    return this.isRangeActive(gauge, range) ? color : this.hexToRgba(color, isDark ? 0.32 : 0.2);
  }

  protected rangeOutline(gauge: GaugeData, range: GaugeRange): string {
    const isDark = this.themeService.darkMode();
    const dark = this.darkenHex(this.themeService.resolveColor(range.color), isDark ? 0.82 : 0.6);
    return this.isRangeActive(gauge, range) ? dark : this.hexToRgba(dark, isDark ? 0.7 : 0.45);
  }

  protected displayRangeStart(gauge: GaugeData, range: GaugeRange): number {
    if (range.start <= gauge.min) return range.start;
    return range.start + this.linearSegmentGap(gauge) / 2;
  }

  protected displayRangeEnd(gauge: GaugeData, range: GaugeRange): number {
    if (range.end >= gauge.max) return range.end;
    return range.end - this.linearSegmentGap(gauge) / 2;
  }

  protected displayRadialRangeStart(gauge: GaugeData, range: GaugeRange): number {
    if (range.start <= gauge.min) return range.start;
    return range.start + this.radialSegmentGap(gauge) / 2;
  }

  protected displayRadialRangeEnd(gauge: GaugeData, range: GaugeRange): number {
    if (range.end >= gauge.max) return range.end;
    return range.end - this.radialSegmentGap(gauge) / 2;
  }

  protected rangeInnerExtent(_gauge: GaugeData, _range: GaugeRange): number { return 0.06; }
  protected rangeOuterExtent(_gauge: GaugeData, _range: GaugeRange): number { return 0.64; }
  protected radialInnerExtent(_gauge: GaugeData, _range: GaugeRange): number { return 0.567; }
  protected radialOuterExtent(_gauge: GaugeData, _range: GaugeRange): number { return 0.733; }

  protected radialInterval(gauge: GaugeData): number {
    const differences = gauge.thresholds
      .slice(1)
      .map((t, i) => Math.abs(t - gauge.thresholds[i]))
      .filter(d => d > 0);
    if (differences.length === 0) return 1;
    return differences.reduce((a, v) => this.greatestCommonDivisor(a, v));
  }

  private segmentGap(gauge: GaugeData): number {
    return Math.max(gauge.max - gauge.min, 1) * 0.015;
  }

  private linearSegmentGap(gauge: GaugeData): number { return this.segmentGap(gauge) * 0.6; }
  private radialSegmentGap(gauge: GaugeData): number  { return this.segmentGap(gauge); }

  private withComputedBounds(gauge: Omit<GaugeData, 'min' | 'max'> & { min: number; max: number }): GaugeData {
    const rangeStarts = gauge.ranges.map(r => r.start);
    const rangeEnds   = gauge.ranges.map(r => r.end);
    const min = Math.min(...rangeStarts);
    const max = Math.max(...rangeEnds);
    const thresholds = Array.from(new Set([min, max, ...rangeStarts, ...rangeEnds])).sort((a, b) => a - b);
    return { ...gauge, min, max, thresholds };
  }

  private formatValue(value: number): string {
    return Number.isInteger(value) ? `${value}` : value.toFixed(2);
  }

  private darkenHex(hex: string, factor: number): string {
    const n = hex.replace('#', '');
    const r = Math.round(parseInt(n.slice(0, 2), 16) * factor);
    const g = Math.round(parseInt(n.slice(2, 4), 16) * factor);
    const b = Math.round(parseInt(n.slice(4, 6), 16) * factor);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private greatestCommonDivisor(left: number, right: number): number {
    let a = Math.round(left), b = Math.round(right);
    while (b !== 0) { const r = a % b; a = b; b = r; }
    return Math.max(a, 1);
  }

  private hexToRgba(hex: string, alpha: number): string {
    const n = hex.replace('#', '');
    return `rgba(${parseInt(n.slice(0, 2), 16)}, ${parseInt(n.slice(2, 4), 16)}, ${parseInt(n.slice(4, 6), 16)}, ${alpha})`;
  }
}
