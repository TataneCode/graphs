import { inject, Injectable } from '@angular/core';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { SeedRequest } from '@/app/core/models';
import { SeedApiService } from '@/app/core/services';
import { PointsStore } from '@/app/core/stores/points.store';

interface SeedState {
  seeding: boolean;
  clearing: boolean;
  error: string | null;
  lastSeedInfo: {
    pointsGenerated: number;
    startDate: string;
    endDate: string;
  } | null;
}

const initialState: SeedState = {
  seeding: false,
  clearing: false,
  error: null,
  lastSeedInfo: null,
};

@Injectable({
  providedIn: 'root',
})
export class SeedStore extends signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store: any) => {
    const seedApi = inject(SeedApiService);
    const pointsStore = inject(PointsStore);
    return {
      // State getters
    seeding: () => store.seeding(),
    clearing: () => store.clearing(),
    error: () => store.error(),
    lastSeedInfo: () => store.lastSeedInfo(),

    // Seed the database with test data
    seed: rxMethod<SeedRequest | undefined>(
      pipe(
        tap(() => {
          store.patchState({ seeding: true, error: null });
          (pointsStore as any).reset();
        }),
        switchMap((request) => {
          return seedApi.seed(request).pipe(
            tap((response) => {
              store.patchState({
                seeding: false,
                lastSeedInfo: {
                  pointsGenerated: response.pointsGenerated,
                  startDate: response.startDate,
                  endDate: response.endDate,
                },
              });
            }),
            switchMap(() => (pointsStore as any).load())
          );
        })
      )
    ),

    // Clear all points
    clearAll: rxMethod<void>(
      pipe(
        tap(() => {
          store.patchState({ clearing: true, error: null });
        }),
        switchMap(() => {
          return seedApi.clearAll().pipe(
            tap(() => {
              store.patchState({
                clearing: false,
                lastSeedInfo: null,
              });
              (pointsStore as any).reset();
            })
          );
        })
      )
    ),

    // Load points after seed operation
    load: rxMethod<void>(pipe(switchMap(() => (pointsStore as any).load()))),

    // Helper methods
    clearError: () => {
      store.patchState({ error: null });
    },

    setError: (error: string) => {
      store.patchState({ error, seeding: false, clearing: false });
    },

    reset: () => {
      store.patchState(initialState);
    },
  }
})
) {}
