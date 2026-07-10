import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '@/app/core/services/base-api.service';
import {
  PointResponse,
  Point,
  CreatePointRequest,
  UpdatePointRequest,
  PointsQueryParams,
} from '@/app/core/models';

@Injectable({
  providedIn: 'root',
})
export class PointsApiService extends BaseApiService {
  private readonly endpoint = '/points';

  getAll(params?: PointsQueryParams): Observable<PointResponse[]> {
    return this.get<PointResponse[]>(this.endpoint, params as any);
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

  deleteById(id: number): Observable<PointResponse> {
    return this.http.delete<PointResponse>(this.getFullUrl(`${this.endpoint}/${id}`), {
      headers: this.getHeaders(),
    });
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
