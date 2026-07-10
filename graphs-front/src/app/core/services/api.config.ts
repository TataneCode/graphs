import { InjectionToken } from '@angular/core';

// Configuration for API base URL
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: (): string => {
    // Default to localhost for development
    // In production, this should be configured via environment variables
    return 'http://localhost:3000';
  },
});

export class ApiConfig {
  static readonly API_BASE_URL = 'http://localhost:3000';
  static readonly SERIES_ENDPOINT = '/series';
  static readonly POINTS_ENDPOINT = '/points';
  static readonly SEED_ENDPOINT = '/seed';
  static readonly TIMEOUT = 30000; // 30 seconds
}
