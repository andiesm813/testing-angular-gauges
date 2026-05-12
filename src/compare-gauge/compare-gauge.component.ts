import { Component, inject } from '@angular/core';
import {
  IgxFormatLinearGraphLabelEventArgs,
  IgxFormatRadialGaugeLabelEventArgs,
  IgxLinearGaugeModule,
  IgxRadialGaugeModule
} from 'igniteui-angular-gauges';
import { SENSORS, GaugeRange } from '../shared/gauge-data';
import { ThemeService } from '../shared/theme.service';
import { CompareStateService } from './compare-state.service';

interface GaugeData {
  id: string;
  title: string;
  units: string;
  value: number;
  ranges: GaugeRange[];
  min: number;
  max: number;
  interval: number;
}

interface DisplayRange {
  start: number;
  end: number;
  brush: string;
}

@Component({
  selector: 'app-compare-gauge',
  imports: [IgxLinearGaugeModule, IgxRadialGaugeModule],
  templateUrl: './compare-gauge.component.html',
  styleUrl: './compare-gauge.component.css'
})
export class CompareGaugeComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly state = inject(CompareStateService);

  protected readonly gauges: GaugeData[] = SENSORS.map(sensor =>
    this.withComputedBounds({
      id: sensor.id,
      title: sensor.label,
      units: sensor.unit,
      value: sensor.value,
      ranges: sensor.ranges,
      min: 0,
      max: 0,
      interval: sensor.interval
    })
  );

  protected get gaugeLabelBrush(): string {
    return this.themeService.darkMode() ? '#c0c0d4' : '#5C5D60';
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

  protected get gaugeTickBrush(): string {
    return this.themeService.darkMode() ? '#16181c' : '#f5f5f7';
  }

  protected get gaugeNeedleOutlineBrush(): string {
    return this.themeService.darkMode() ? '#2a3442' : '#ffffff';
  }

  private get gaugeTrackGray(): string {
    return this.themeService.darkMode() ? '#404058' : '#e0e0e8';
  }

  protected get gaugeProgressScaleBrush(): string {
    return this.state.gaugeStyle() === 'progress' ? this.gaugeTrackGray : 'transparent';
  }

  protected isRangeActive(gauge: GaugeData, range: GaugeRange): boolean {
    const withinRange = gauge.value >= range.start && gauge.value < range.end;
    const onMaxBoundary = gauge.value === gauge.max && range.end === gauge.max;
    return withinRange || onMaxBoundary;
  }

  protected statusRangeBrush(gauge: GaugeData, range: GaugeRange): string {
    const color = this.themeService.resolveColor(range.color);
    if (this.isRangeActive(gauge, range)) {
      return color;
    }
    return this.hexToMuted(color, this.themeService.darkMode());
  }

  protected getLinearProgressRanges(gauge: GaugeData): DisplayRange[] {
    return this.buildProgressRanges(gauge, false);
  }

  protected getRadialProgressRanges(gauge: GaugeData): DisplayRange[] {
    return this.buildProgressRanges(gauge, true);
  }

  private buildProgressRanges(gauge: GaugeData, radial: boolean): DisplayRange[] {
    const activeIndex = gauge.ranges.findIndex(r => this.isRangeActive(gauge, r));
    const activeColor = activeIndex >= 0
      ? this.themeService.resolveColor(gauge.ranges[activeIndex].color)
      : this.gaugeTrackGray;
    const gray = this.gaugeTrackGray;

    const gapStart = (r: GaugeRange) => {
      if (r.start <= gauge.min) return r.start;
      return r.start + (radial ? this.radialSegmentGap(gauge) : this.linearSegmentGap(gauge)) / 2;
    };
    const gapEnd = (r: GaugeRange) => {
      if (r.end >= gauge.max) return r.end;
      return r.end - (radial ? this.radialSegmentGap(gauge) : this.linearSegmentGap(gauge)) / 2;
    };

    const result: DisplayRange[] = [];
    for (let i = 0; i < gauge.ranges.length; i++) {
      const range = gauge.ranges[i];
      const segStart = gapStart(range);
      const segEnd = gapEnd(range);

      // Explicitly fill the gap between the previous range and this one
      if (i > 0 && range.start > gauge.min) {
        const prevSegEnd = gapEnd(gauge.ranges[i - 1]);
        result.push({ start: prevSegEnd, end: segStart, brush: gray });
      }

      if (i < activeIndex) {
        result.push({ start: segStart, end: segEnd, brush: activeColor });
      } else if (i === activeIndex) {
        if (gauge.value > segStart) {
          result.push({ start: segStart, end: gauge.value, brush: activeColor });
        }
        if (gauge.value < segEnd) {
          result.push({ start: gauge.value, end: segEnd, brush: gray });
        }
      } else {
        result.push({ start: segStart, end: segEnd, brush: gray });
      }
    }
    return result;
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

  private segmentGap(gauge: GaugeData): number {
    return Math.max(gauge.max - gauge.min, 1) * 0.015;
  }

  private linearSegmentGap(gauge: GaugeData): number { return this.segmentGap(gauge) * 0.22; }
  private radialSegmentGap(gauge: GaugeData): number  { return this.segmentGap(gauge) * 0.75; }

  protected formatMinMaxLabel(
    event: { sender: unknown; args: IgxFormatLinearGraphLabelEventArgs | IgxFormatRadialGaugeLabelEventArgs },
    min: number,
    max: number
  ): void {
    const value = event.args.value;
    const epsilon = 0.0001;
    const isMin = Math.abs(value - min) < epsilon;
    const isMax = Math.abs(value - max) < epsilon;
    event.args.label = isMin || isMax ? `${Math.round(value) === value ? value : value.toFixed(2)}` : '';
  }

  private withComputedBounds(gauge: Omit<GaugeData, 'min' | 'max'> & { min: number; max: number }): GaugeData {
    const rangeStarts = gauge.ranges.map(r => r.start);
    const rangeEnds   = gauge.ranges.map(r => r.end);
    const min = Math.min(...rangeStarts);
    const max = Math.max(...rangeEnds);
    return { ...gauge, min, max };
  }

  private hexToMuted(hex: string, isDark: boolean): string {
    const n = hex.replace('#', '');
    const r = parseInt(n.slice(0, 2), 16) / 255;
    const g = parseInt(n.slice(2, 4), 16) / 255;
    const b = parseInt(n.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    if (max !== min) {
      const d = max - min;
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return `hsl(${Math.round(h * 360)}, ${isDark ? 30 : 65}%, ${isDark ? 38 : 88}%)`;
  }
}
