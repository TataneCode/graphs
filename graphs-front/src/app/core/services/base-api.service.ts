import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = inject(API_BASE_URL);

  protected getFullUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  protected get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | Array<string | number>>
  ): Observable<T> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => {
              httpParams = httpParams.append(`${key}[]`, v.toString());
            });
          } else {
            httpParams = httpParams.append(key, value.toString());
          }
        }
      });
    }

    const options = {
      params: httpParams,
      headers: this.getHeaders(),
    };

    return this.http.get<T>(this.getFullUrl(endpoint), options);
  }

  protected post<T, U>(endpoint: string, body: U): Observable<T> {
    return this.http.post<T>(this.getFullUrl(endpoint), body, {
      headers: this.getHeaders(),
    });
  }

  protected put<T, U>(endpoint: string, body: U): Observable<T> {
    return this.http.put<T>(this.getFullUrl(endpoint), body, {
      headers: this.getHeaders(),
    });
  }

  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.getFullUrl(endpoint), {
      headers: this.getHeaders(),
    });
  }

  protected patch<T, U>(endpoint: string, body: U): Observable<T> {
    return this.http.patch<T>(this.getFullUrl(endpoint), body, {
      headers: this.getHeaders(),
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
}
