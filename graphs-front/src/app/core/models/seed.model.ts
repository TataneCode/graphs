export interface SeedRequest {
  count?: number; // Default: 1000000
  months?: number; // Default: 1
}

export interface SeedResponse {
  message: string;
  pointsGenerated: number;
  startDate: string;
  endDate: string;
}

export interface SeedDeleteResponse {
  message: string;
  pointsDeleted: number;
}
