import { Component, inject } from '@angular/core';
import {
  IgxBulletGraphModule,
  IgxFormatLinearGraphLabelEventArgs,
  IgxFormatRadialGaugeLabelEventArgs,
  IgxLinearGaugeModule,
  IgxRadialGaugeModule
} from 'igniteui-angular-gauges';
import { SENSORS, GaugeSensor } from '../shared/gauge-data';
import { ThemeService } from '../shared/theme.service';

@Component({
  selector: 'app-progress-gauge',
  imports: [IgxLinearGaugeModule, IgxRadialGaugeModule, IgxBulletGraphModule],
  templateUrl: './progress-gauge.html',
  styleUrl: './progress-gauge.css'
})
export class ProgressGaugeComponent {
  protected readonly themeService = inject(ThemeService);
  readonly bulletScaleStartExtent = 0.02;
  readonly bulletScaleEndExtent = 0.96;
  readonly bulletValueInnerExtent = 0.34;
  readonly bulletValueOuterExtent = 0.66;

  readonly gaugeRecords = SENSORS;
  readonly customNeedle = SENSORS[2];
  readonly bulletSensor = SENSORS[1];

  get gaugeTrackBrush(): string   { return this.themeService.darkMode() ? '#2a2a34' : '#e0e0e8'; }
  get gaugeTickBrush(): string    { return this.themeService.darkMode() ? '#16181c' : '#f5f5f7'; }
  get gaugeFontBrush(): string    { return this.themeService.darkMode() ? '#c0c0d4' : '#5C5D60'; }
  get gaugeNeedleBrush(): string  { return this.themeService.darkMode() ? '#f0f0f8' : '#2E2E30'; }
  get gaugeNeedleOut(): string    { return this.themeService.darkMode() ? '#16181c' : '#ffffff'; }
  get gaugeValueBrush(): string   { return this.themeService.darkMode() ? '#f0f0f8' : '#2E2E30'; }

  activeRangeColor(sensor: GaugeSensor): string {
    const active = sensor.ranges.find(r =>
      sensor.value >= r.start && (sensor.value < r.end || r.end === sensor.max)
    );
    const lightHex = active?.color ?? sensor.ranges[sensor.ranges.length - 1].color;
    return this.themeService.resolveColor(lightHex);
  }

  targetOffsetPercent(sensor: GaugeSensor): number {
    const target = sensor.target ?? sensor.value;
    const span = sensor.max - sensor.min;
    if (span <= 0) {
      return this.bulletScaleStartExtent * 100;
    }
    const normalized = (target - sensor.min) / span;
    const extentNormalized = this.bulletScaleStartExtent + normalized * (this.bulletScaleEndExtent - this.bulletScaleStartExtent);
    return Math.max(0, Math.min(100, extentNormalized * 100));
  }

  bulletTrackCenterPercent(): number {
    return ((this.bulletValueInnerExtent + this.bulletValueOuterExtent) / 2) * 100;
  }

  bulletRangeBrush(sensor: GaugeSensor, index: number): string {
    const color = sensor.ranges[index]?.color ?? sensor.ranges[sensor.ranges.length - 1]?.color ?? '#cccccc';
    const resolvedColor = this.themeService.resolveColor(color);
    const activeIndex = sensor.ranges.findIndex(r =>
      sensor.value >= r.start && (sensor.value < r.end || r.end === sensor.max)
    );

    // Keep the active range vivid; fade inactive ranges for contrast.
    if (index === activeIndex) {
      return resolvedColor;
    }

    return this.withAlpha(resolvedColor, 0.45);
  }

  formatMinMaxLabel(
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

  private withAlpha(hexColor: string, alpha: number): string {
    const hex = hexColor.replace('#', '');
    const full = hex.length === 3
      ? hex.split('').map((c) => c + c).join('')
      : hex;

    if (full.length !== 6) {
      return hexColor;
    }

    const r = Number.parseInt(full.slice(0, 2), 16);
    const g = Number.parseInt(full.slice(2, 4), 16);
    const b = Number.parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
