import { GaugeRange, GaugeSensor } from './gauge-data';

type GaugeLike = Pick<GaugeSensor, 'value' | 'min' | 'max' | 'ranges'>;

export interface GaugeMetrics {
  min: number;
  max: number;
  thresholds: number[];
}

export function getGaugeMetrics(gauge: Pick<GaugeSensor, 'min' | 'max' | 'ranges'>): GaugeMetrics {
  const rangeStarts = gauge.ranges.map((range) => range.start);
  const rangeEnds = gauge.ranges.map((range) => range.end);
  const min = Math.min(gauge.min, ...rangeStarts);
  const max = Math.max(gauge.max, ...rangeEnds);
  const thresholds = Array.from(new Set([min, max, ...rangeStarts, ...rangeEnds])).sort((left, right) => left - right);

  return { min, max, thresholds };
}

export function isRangeActive(gauge: GaugeLike, range: GaugeRange): boolean {
  const withinRange = gauge.value >= range.start && gauge.value < range.end;
  const onMaxBoundary = gauge.value === gauge.max && range.end === gauge.max;
  return withinRange || onMaxBoundary;
}

export function getActiveRangeIndex(gauge: GaugeLike): number {
  return gauge.ranges.findIndex((range) => isRangeActive(gauge, range));
}

export function getThresholdInterval(gauge: Pick<GaugeSensor, 'min' | 'max' | 'ranges'>): number {
  const { thresholds } = getGaugeMetrics(gauge);
  const differences = thresholds
    .slice(1)
    .map((threshold, index) => Math.abs(threshold - thresholds[index]))
    .filter((difference) => difference > 0);

  if (differences.length === 0) {
    return 1;
  }

  return differences.reduce((left, right) => greatestCommonDivisor(left, right));
}

function greatestCommonDivisor(left: number, right: number): number {
  let a = Math.round(left);
  let b = Math.round(right);

  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }

  return Math.max(a, 1);
}
