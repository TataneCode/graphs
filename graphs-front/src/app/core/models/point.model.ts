import { Quality } from './quality.enum';

export interface Point {
  id: number;
  serieId: number;
  creationDate: Date;
  value: number;
  quality: Quality;
}

export interface PointResponse {
  id: number;
  serieId: number;
  creationDate: string; // ISO date string
  value: number;
  quality: Quality;
}

export interface CreatePointRequest {
  serieId: number;
  creationDate: string; // ISO date string
  value: number;
  quality: Quality;
}

export interface UpdatePointRequest {
  serieId?: number;
  creationDate?: string;
  value?: number;
  quality?: Quality;
}

export interface PointsQueryParams {
  skip?: number;
  take?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  serieIds?: number[];
  qualityFilter?: Quality[];
}
