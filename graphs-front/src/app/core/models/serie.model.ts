import { FlowerType } from './flower-type.enum';

export interface Serie {
  id: number;
  type: FlowerType;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SerieResponse {
  id: number;
  type: FlowerType;
  description: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CreateSerieRequest {
  type: FlowerType;
  description: string;
}

export interface UpdateSerieRequest {
  type?: FlowerType;
  description?: string;
}

export interface SeriesQueryParams {
  skip?: number;
  take?: number;
  type?: FlowerType;
}
