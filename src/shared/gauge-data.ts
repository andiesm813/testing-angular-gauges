export const PALETTE = {
  light: { good: '#6abf69', warning: '#f5c040', danger: '#e8736b' },
  dark:  { good: '#84d98b', warning: '#ffd166', danger: '#ff9b8f' },
} as const;

export interface GaugeRange {
  start: number;
  end: number;
  color: string;
}

export interface GaugeSensor {
  id: string;
  label: string;
  chartLabel: string;
  unit: string;
  value: number;
  target?: number;
  min: number;
  max: number;
  interval: number;
  ranges: GaugeRange[];
}

export const SENSORS: GaugeSensor[] = [
  {
    id: 'engine-temp',
    label: 'Engine Temperature',
    chartLabel: 'Engine',
    unit: '°C',
    value: 64,
    min: 0,
    max: 100,
    interval: 20,
    ranges: [
      { start: 0,  end: 45,  color: PALETTE.light.good },
      { start: 45, end: 75,  color: PALETTE.light.warning },
      { start: 75, end: 100, color: PALETTE.light.danger }
    ]
  },
  {
    id: 'oil-pressure',
    label: 'Oil Pressure',
    chartLabel: 'Oil',
    unit: 'psi',
    value: 88,
    min: 20,
    max: 120,
    interval: 20,
    ranges: [
      { start: 20, end: 55,  color: PALETTE.light.danger },
      { start: 55, end: 85,  color: PALETTE.light.warning },
      { start: 85, end: 120, color: PALETTE.light.good }
    ]
  },
  {
    id: 'battery-health',
    label: 'Battery Health',
    chartLabel: 'Battery',
    unit: '%',
    value: 28,
    target: 80,
    min: 0,
    max: 100,
    interval: 20,
    ranges: [
      { start: 0,  end: 30,  color: PALETTE.light.danger },
      { start: 30, end: 70,  color: PALETTE.light.warning },
      { start: 70, end: 100, color: PALETTE.light.good }
    ]
  }
];
