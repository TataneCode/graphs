import { inject, Injectable } from '@angular/core';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Serie, SeriesQueryParams } from '@/app/core/models';
import { SeriesApiService } from '@/app/core/services';

interface SeriesState {
  series: Serie[];
  loading: boolean;
  error: string | null;
  selectedSeries: Serie[];
}

const initialState: SeriesState = {
  series: [],
  loading: false,
  error: null,
  selectedSeries: [],
};

@Injectable({
  providedIn: 'root',
})
export class SeriesStore extends signalStore(
  { providedIn: 'root', protectedState: false },
  withState(initialState),
  withMethods((store: any) => {
    const seriesApi = inject(SeriesApiService);
    return {
      // State getters
    allSeries: () => store.series(),
    loading: () => store.loading(),
    error: () => store.error(),
    selectedSeries: () => store.selectedSeries(),

    // CRUD Methods
    loadAll: rxMethod<SeriesQueryParams | undefined>(
      pipe(
        tap(() => {
          store.patchState({ loading: true, error: null });
        }),
        switchMap((params) => {
          return seriesApi.getAll(params).pipe(
            tap((responses) => {
              const series = seriesApi.mapResponsesToModels(responses);
              store.patchState({
                series,
                loading: false,
                selectedSeries: series, // Initially select all series
              });
            })
          );
        })
      )
    ),

    getById: rxMethod<number>(
      pipe(
        switchMap((id) => {
          return seriesApi.getById(id).pipe(
            tap((response) => {
              const serie = seriesApi.mapResponseToModel(response);
              // Add to state if not already present
              const currentSeries = store.series();
              if (!currentSeries.some((s: any) => s.id === serie.id)) {
                store.patchState({
                  series: [...currentSeries, serie],
                  loading: false,
                });
              }
            })
          );
        })
      )
    ),

    create: rxMethod<{ type: any; description: string }>(
      pipe(
        tap(() => store.patchState({ loading: true, error: null })),
        switchMap((request) => {
          return seriesApi.create(request as any).pipe(
            tap((response) => {
              const serie = seriesApi.mapResponseToModel(response);
              store.patchState({
                series: [...store.series(), serie],
                loading: false,
              });
            })
          );
        })
      )
    ),

    update: rxMethod<{ id: number; type?: any; description?: string }>(
      pipe(
        tap(() => store.patchState({ loading: true, error: null })),
        switchMap((request) => {
          return seriesApi.update(request.id, request as any).pipe(
            tap((response) => {
              const serie = seriesApi.mapResponseToModel(response);
              const updatedSeries = store.series().map((s: any) => (s.id === serie.id ? serie : s));
              store.patchState({
                series: updatedSeries,
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
          return seriesApi.deleteById(id).pipe(
            tap(() => {
              const filteredSeries = store.series().filter((s: any) => s.id !== id);
              const filteredSelected = store.selectedSeries().filter((s: any) => s.id !== id);
              store.patchState({
                series: filteredSeries,
                selectedSeries: filteredSelected,
                loading: false,
              });
            })
          );
        })
      )
    ),

    // Selection methods
    selectSeries: (serie: Serie) => {
      const currentSelected = store.selectedSeries();
      if (!currentSelected.some((s: any) => s.id === serie.id)) {
        store.patchState({
          selectedSeries: [...currentSelected, serie],
        });
      }
    },

    deselectSeries: (serieId: number) => {
      const currentSelected = store.selectedSeries();
      store.patchState({
        selectedSeries: currentSelected.filter((s: any) => s.id !== serieId),
      });
    },

    toggleSeries: (serie: Serie) => {
      const currentSelected = store.selectedSeries();
      const isSelected = currentSelected.some((s: any) => s.id === serie.id);

      if (isSelected) {
        store.patchState({
          selectedSeries: currentSelected.filter((s: any) => s.id !== serie.id),
        });
      } else {
        store.patchState({
          selectedSeries: [...currentSelected, serie],
        });
      }
    },

    selectAll: () => {
      store.patchState({
        selectedSeries: [...store.series()],
      });
    },

    deselectAll: () => {
      store.patchState({
        selectedSeries: [],
      });
    },

    // Helper methods
    getSelectedSeriesIds: () => store.selectedSeries().map((s: any) => s.id),

    getSeriesByType: (type: string) => store.series().find((s: any) => s.type === type),

    clearError: () => {
      store.patchState({ error: null });
    },

    setError: (error: string) => {
      store.patchState({ error, loading: false });
    },

    reset: () => {
      store.patchState(initialState);
    },
  }
})
) {}
