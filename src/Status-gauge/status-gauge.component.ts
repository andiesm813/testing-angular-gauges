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
  min: number;
  max: number;
  interval: number;
}

@Component({
  selector: 'status-gauge-root',
  imports: [IgxLinearGaugeModule, IgxRadialGaugeModule],
  templateUrl: './status-gauge.component.html',
  styleUrl: './status-gauge.component.css'
})
export class StatusGaugeComponent {
  protected readonly themeService = inject(ThemeService);
  protected inactiveRangeOpacityEnabled = true;

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

  protected isRangeActive(gauge: GaugeData, range: GaugeRange): boolean {
    const withinRange = gauge.value >= range.start && gauge.value < range.end;
    const onMaxBoundary = gauge.value === gauge.max && range.end === gauge.max;
    return withinRange || onMaxBoundary;
  }

  protected rangeBrush(gauge: GaugeData, range: GaugeRange): string {
    const isDark = this.themeService.darkMode();
    const color = this.themeService.resolveColor(range.color);
    if (this.isRangeActive(gauge, range) || !this.inactiveRangeOpacityEnabled) {
      return color;
    }
    return this.hexToRgba(color, isDark ? 0.4 : 0.3);
  }

  protected rangeOutline(gauge: GaugeData, range: GaugeRange): string {
    const isDark = this.themeService.darkMode();
    const color = this.themeService.resolveColor(range.color);
    if (this.isRangeActive(gauge, range) || !this.inactiveRangeOpacityEnabled) {
      return color;
    }
    return this.hexToRgba(color, isDark ? 0.78 : 0.66);
  }

  protected setInactiveRangeOpacity(enabled: boolean): void {
    this.inactiveRangeOpacityEnabled = enabled;
  }

  protected rangeStrokeThickness(gauge: GaugeData, range: GaugeRange): number {
    return this.isRangeActive(gauge, range) ? 1 : 1.35;
  }

  protected rangeInnerExtent(gauge: GaugeData, range: GaugeRange): number {
    return 0.06;
  }

  protected rangeOuterExtent(gauge: GaugeData, range: GaugeRange): number {
    return this.isRangeActive(gauge, range) ? 0.64 : 0.495;
  }

  protected radialInnerExtent(gauge: GaugeData, range: GaugeRange): number {
    return 0.567;
  }

  protected radialOuterExtent(gauge: GaugeData, range: GaugeRange): number {
    return this.isRangeActive(gauge, range) ? 0.733 : 0.692;
  }

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

  private hexToRgba(hex: string, alpha: number): string {
    const n = hex.replace('#', '');
    return `rgba(${parseInt(n.slice(0, 2), 16)}, ${parseInt(n.slice(2, 4), 16)}, ${parseInt(n.slice(4, 6), 16)}, ${alpha})`;
  }
}
