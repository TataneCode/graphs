import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '@/app/core/services/base-api.service';
import { SeedRequest, SeedResponse, SeedDeleteResponse } from '@/app/core/models';

@Injectable({
  providedIn: 'root',
})
export class SeedApiService extends BaseApiService {
  private readonly endpoint = '/seed';

  seed(request?: SeedRequest): Observable<SeedResponse> {
    const body = request ?? {};
    return this.post<SeedResponse, SeedRequest>(this.endpoint, body);
  }

  clearAll(): Observable<SeedDeleteResponse> {
    return this.delete<SeedDeleteResponse>(this.endpoint);
  }
}
