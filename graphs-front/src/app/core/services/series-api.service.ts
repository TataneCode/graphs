import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '@/app/core/services/base-api.service';
import {
  SerieResponse,
  Serie,
  CreateSerieRequest,
  UpdateSerieRequest,
  SeriesQueryParams,
} from '@/app/core/models';

@Injectable({
  providedIn: 'root',
})
export class SeriesApiService extends BaseApiService {
  private readonly endpoint = '/series';

  getAll(params?: SeriesQueryParams): Observable<SerieResponse[]> {
    return this.get<SerieResponse[]>(this.endpoint, params as any);
  }

  getById(id: number): Observable<SerieResponse> {
    return this.get<SerieResponse>(`${this.endpoint}/${id}`);
  }

  create(createRequest: CreateSerieRequest): Observable<SerieResponse> {
    return this.post<SerieResponse, CreateSerieRequest>(this.endpoint, createRequest);
  }

  update(id: number, updateRequest: UpdateSerieRequest): Observable<SerieResponse> {
    return this.put<SerieResponse, UpdateSerieRequest>(`${this.endpoint}/${id}`, updateRequest);
  }

  deleteById(id: number): Observable<SerieResponse> {
    return this.http.delete<SerieResponse>(this.getFullUrl(`${this.endpoint}/${id}`), {
      headers: this.getHeaders(),
    });
  }

  // Helper method to map response to model
  mapResponseToModel(response: SerieResponse): Serie {
    return {
      id: response.id,
      type: response.type,
      description: response.description,
      createdAt: response.createdAt ? new Date(response.createdAt) : undefined,
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined,
    };
  }

  mapResponsesToModels(responses: SerieResponse[]): Serie[] {
    return responses.map((r) => this.mapResponseToModel(r));
  }
}
