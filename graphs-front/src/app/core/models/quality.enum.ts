export enum Quality {
  GOOD = 'GOOD',
  DEGRADED = 'DEGRADED',
  ERROR = 'ERROR',
}

export const QUALITIES: Quality[] = [Quality.GOOD, Quality.DEGRADED, Quality.ERROR];

export const qualityLabels: Record<Quality, string> = {
  [Quality.GOOD]: 'Good',
  [Quality.DEGRADED]: 'Degraded',
  [Quality.ERROR]: 'Error',
};

export const qualityColors: Record<Quality, string> = {
  [Quality.GOOD]: '#28a745', // Green
  [Quality.DEGRADED]: '#ffc107', // Orange
  [Quality.ERROR]: '#dc3545', // Red
};
