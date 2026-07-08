import { inject, Injectable } from '@angular/core';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Point, PointsQueryParams } from '../models';
import { PointsApiService } from '../services';
import { SeriesStore } from './series.store';

interface PointsState {
  points: Point[];
  loading: boolean;
  error: string | null;
  // Filter state
  startDate: string | null;
  endDate: string | null;
  selectedSerieIds: number[];
  selectedQualityFilters: string[];
  // Pagination
  skip: number;
  take: number;
  total: number | null;
}

const initialState: PointsState = {
  points: [],
  loading: false,
  error: null,
  startDate: null,
  endDate: null,
  selectedSerieIds: [],
  selectedQualityFilters: [],
  skip: 0,
  take: 1000,
  total: null,
};

@Injectable({
  providedIn: 'root',
})
export class PointsStore extends signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, pointsApi = inject(PointsApiService), seriesStore = inject(SeriesStore)) => ({
    // State getters
    allPoints: (): Point[] => store.points(),
    loading: (): boolean => store.loading(),
    error: (): string | null => store.error(),
    startDate: (): string | null => store.startDate(),
    endDate: (): string | null => store.endDate(),
    selectedSerieIds: (): number[] => store.selectedSerieIds(),
    selectedQualityFilters: (): string[] => store.selectedQualityFilters(),
    skip: (): number => store.skip(),
    take: (): number => store.take(),
    total: (): number | null => store.total(),

    // Query builder
    getQueryParams: (): PointsQueryParams => {
      const params: PointsQueryParams = {
        skip: store.skip(),
        take: store.take(),
      };

      if (store.startDate()) {
        params.startDate = store.startDate();
      }

      if (store.endDate()) {
        params.endDate = store.endDate();
      }

      if (store.selectedSerieIds().length > 0) {
        params.serieIds = store.selectedSerieIds();
      }

      if (store.selectedQualityFilters().length > 0) {
        params.qualityFilter = store.selectedQualityFilters() as any[];
      }

      return params;
    },

    // Load points with current filters
    load: rxMethod<void>(
      pipe(
        tap(() => {
          store.patchState({ loading: true, error: null });
        }),
        switchMap(() => {
          const params = store.getQueryParams();
          return pointsApi.getAll(params).pipe(
            tap((responses) => {
              const points = pointsApi.mapResponsesToModels(responses);
              store.patchState({
                points,
                loading: false,
              });
            })
          );
        })
      )
    ),

    // Load more (pagination)
    loadMore: rxMethod<void>(
      pipe(
        tap(() => {
          const currentSkip = store.skip();
          store.patchState({ skip: currentSkip + store.take() });
        }),
        switchMap(() => store.load())
      )
    ),

    // Reset pagination
    resetPagination: () => {
      store.patchState({
        skip: 0,
        points: [],
      });
    },

    // Filter methods
    setDateRange: (startDate: string | null, endDate: string | null) => {
      store.patchState({ startDate, endDate });
      store.resetPagination();
    },

    setSelectedSerieIds: (serieIds: number[]) => {
      store.patchState({ selectedSerieIds: serieIds });
      store.resetPagination();
    },

    setSelectedQualityFilters: (qualityFilters: string[]) => {
      store.patchState({ selectedQualityFilters: qualityFilters });
      store.resetPagination();
    },

    // Convenience method to set filters from series store
    setSelectedSeriesFromStore: () => {
      const selectedSerieIds = seriesStore.getSelectedSeriesIds();
      store.setSelectedSerieIds(selectedSerieIds);
    },

    // Single point operations
    getById: rxMethod<number>(
      pipe(
        switchMap((id) => {
          return pointsApi.getById(id).pipe(
            tap((response) => {
              const point = pointsApi.mapResponseToModel(response);
              const currentPoints = store.points();
              if (!currentPoints.some((p) => p.id === point.id)) {
                store.patchState({
                  points: [...currentPoints, point],
                  loading: false,
                });
              }
            })
          );
        })
      )
    ),

    create: rxMethod<{ serieId: number; creationDate: string; value: number; quality: string }>(
      pipe(
        tap(() => store.patchState({ loading: true, error: null })),
        switchMap((request) => {
          return pointsApi.create(request).pipe(
            tap((response) => {
              const point = pointsApi.mapResponseToModel(response);
              store.patchState({
                points: [...store.points(), point],
                loading: false,
              });
            })
          );
        })
      )
    ),

    update: rxMethod<{
      id: number;
      serieId?: number;
      creationDate?: string;
      value?: number;
      quality?: string;
    }>(
      pipe(
        tap(() => store.patchState({ loading: true, error: null })),
        switchMap((request) => {
          return pointsApi.update(request.id, request).pipe(
            tap((response) => {
              const point = pointsApi.mapResponseToModel(response);
              const updatedPoints = store.points().map((p) => (p.id === point.id ? point : p));
              store.patchState({
                points: updatedPoints,
                loading: false,
              });
            })
          );
        })
      )
    ),

    delete: rxMethod<number>(
      pipe(
        tap(() => store.patchState({ loading: true, error: null })),
        switchMap((id) => {
          return pointsApi.delete(id).pipe(
            tap(() => {
              const filteredPoints = store.points().filter((p) => p.id !== id);
              store.patchState({
                points: filteredPoints,
                loading: false,
              });
            })
          );
        })
      )
    ),

    // Helper methods
    getPointsBySerie: (serieId: number) => {
      return store.points().filter((p) => p.serieId === serieId);
    },

    getPointsInDateRange: (startDate: Date, endDate: Date) => {
      return store.points().filter((p) => {
        const pointDate = p.creationDate;
        return pointDate >= startDate && pointDate <= endDate;
      });
    },

    clearError: () => {
      store.patchState({ error: null });
    },

    setError: (error: string) => {
      store.patchState({ error, loading: false });
    },

    reset: () => {
      store.patchState(initialState);
    },
  }))
) {}
