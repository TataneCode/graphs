import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  PointResponse,
  Point,
  CreatePointRequest,
  UpdatePointRequest,
  PointsQueryParams,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class PointsApiService extends BaseApiService {
  private readonly endpoint = '/points';

  getAll(params?: PointsQueryParams): Observable<PointResponse[]> {
    return this.get<PointResponse[]>(this.endpoint, params);
  }

  getById(id: number): Observable<PointResponse> {
    return this.get<PointResponse>(`${this.endpoint}/${id}`);
  }

  create(createRequest: CreatePointRequest): Observable<PointResponse> {
    return this.post<PointResponse, CreatePointRequest>(this.endpoint, createRequest);
  }

  update(id: number, updateRequest: UpdatePointRequest): Observable<PointResponse> {
    return this.put<PointResponse, UpdatePointRequest>(`${this.endpoint}/${id}`, updateRequest);
  }

  delete(id: number): Observable<PointResponse> {
    return this.delete<PointResponse>(`${this.endpoint}/${id}`);
  }

  // Helper method to map response to model
  mapResponseToModel(response: PointResponse): Point {
    return {
      id: response.id,
      serieId: response.serieId,
      creationDate: new Date(response.creationDate),
      value: response.value,
      quality: response.quality,
    };
  }

  mapResponsesToModels(responses: PointResponse[]): Point[] {
    return responses.map((r) => this.mapResponseToModel(r));
  }
}
