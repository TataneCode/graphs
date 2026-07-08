import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateUtils } from '../../app/core/utils';
import { SeriesStore, PointsStore, SeedStore } from '../../app/core/stores';
import {
  DatePickerComponent,
  ButtonComponent,
  CheckboxComponent,
} from '../../app/shared/components/ui';
import {
  EchartsChartComponent,
  HighchartsChartComponent,
  ScichartChartComponent,
} from '../../app/shared/components/charts';

@Component({
  selector: 'app-analogic-page',
  standalone: true,
  imports: [
    FormsModule,
    DatePickerComponent,
    ButtonComponent,
    CheckboxComponent,
    EchartsChartComponent,
    HighchartsChartComponent,
    ScichartChartComponent,
  ],
  template: `
    <div class="analogic-page">
      <h1 class="analogic-page__title">Simple Analogic Graph</h1>

      <div class="analogic-page__controls">
        <div class="analogic-page__form">
          <h2>Filters</h2>

          <!-- Date Range -->
          <div class="analogic-page__form-row">
            <app-date-picker
              label="Start Date"
              [value]="startDate()"
              (valueChange)="setStartDate($event)"
            />

            <app-date-picker
              label="End Date"
              [value]="endDate()"
              (valueChange)="setEndDate($event)"
            />
          </div>

          <!-- Flower Types Checkboxes -->
          <div class="analogic-page__form-section">
            <h3>Flower Types</h3>
            <div class="analogic-page__checkboxes">
              @for (flowerType of flowerTypes; track flowerType.value) {
                <app-checkbox
                  [label]="flowerType.label"
                  [checked]="isFlowerSelected(flowerType.value)"
                  (checkedChange)="toggleFlowerSelection(flowerType.value, $event)"
                />
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="analogic-page__actions">
            <app-button
              label="Load Data"
              variant="primary"
              [loading]="loading()"
              (click)="loadData()"
            />

            <app-button
              label="Seed Database"
              variant="success"
              [loading]="seeding()"
              (click)="seedDatabase()"
            />

            <app-button label="Clear Data" variant="danger" (click)="clearData()" />
          </div>

          @if (error()) {
            <div class="analogic-page__error">{{ error() }}</div>
          }
        </div>

        <div class="analogic-page__info">
          <h3>Statistics</h3>
          <p>Points loaded: {{ points().length }}</p>
          <p>Series selected: {{ selectedSeriesCount() }}</p>
          @if (lastSeedInfo()) {
            <div class="analogic-page__seed-info">
              <p>Last seed: {{ lastSeedInfo()?.pointsGenerated }} points generated</p>
              <p>From: {{ lastSeedInfo()?.startDate }}</p>
              <p>To: {{ lastSeedInfo()?.endDate }}</p>
            </div>
          }
        </div>
      </div>

      <!-- Charts Row -->
      <div class="analogic-page__charts">
        <div class="analogic-page__chart-container">
          <app-echarts-chart
            title="ECharts - Analogic Signal"
            [data]="filteredPoints()"
            [series]="allSeries()"
            [startDate]="startDate()"
            [endDate]="endDate()"
            chartType="line"
          />
        </div>

        <div class="analogic-page__chart-container">
          <app-highcharts-chart
            title="Highcharts - Analogic Signal"
            [data]="filteredPoints()"
            [series]="allSeries()"
            [startDate]="startDate()"
            [endDate]="endDate()"
            chartType="line"
          />
        </div>

        <div class="analogic-page__chart-container">
          <app-scichart-chart
            title="SciChart - Analogic Signal"
            [data]="filteredPoints()"
            [series]="allSeries()"
            [startDate]="startDate()"
            [endDate]="endDate()"
            chartType="line"
          />
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .analogic-page {
        max-width: 1600px;
        margin: 0 auto;
        padding: 1rem;
      }

      .analogic-page__title {
        text-align: center;
        color: #333;
        margin-bottom: 2rem;
      }

      .analogic-page__controls {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }

      .analogic-page__form {
        flex: 1;
        min-width: 400px;
        padding: 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        background: #f9f9f9;
      }

      .analogic-page__form-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }

      .analogic-page__form-section {
        margin-bottom: 1.5rem;
      }

      .analogic-page__checkboxes {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 0.5rem;
      }

      .analogic-page__actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        flex-wrap: wrap;
      }

      .analogic-page__info {
        flex: 0 0 300px;
        padding: 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        background: #f9f9f9;
      }

      .analogic-page__error {
        color: #dc3545;
        padding: 0.5rem;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 0.25rem;
        margin-top: 1rem;
      }

      .analogic-page__seed-info {
        margin-top: 1rem;
        padding: 0.5rem;
        background: #d1ecf1;
        border-radius: 0.25rem;
        font-size: 0.875rem;
      }

      .analogic-page__charts {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
      }

      .analogic-page__chart-container {
        flex: 1;
        min-width: 500px;
        margin-bottom: 1rem;
      }

      @media (max-width: 1200px) {
        .analogic-page__chart-container {
          min-width: 100%;
        }
      }
    `,
  ],
})
export class AnalogicPage implements OnInit {
  private readonly seriesStore = inject(SeriesStore);
  private readonly pointsStore = inject(PointsStore);
  private readonly seedStore = inject(SeedStore);

  // State
  startDate = signal<string>(DateUtils.formatForInput(DateUtils.oneMonthAgo()));
  endDate = signal<string>(DateUtils.formatForInput(DateUtils.now()));

  loading = signal<boolean>(false);
  seeding = signal<boolean>(false);
  error = signal<string>('');

  // Flower types for checkboxes
  flowerTypes = [
    { value: 'ROSE', label: 'Rose' },
    { value: 'TULIP', label: 'Tulip' },
    { value: 'DAISY', label: 'Daisy' },
    { value: 'LILY', label: 'Lily' },
    { value: 'ORCHID', label: 'Orchid' },
    { value: 'SUNFLOWER', label: 'Sunflower' },
    { value: 'VIOLET', label: 'Violet' },
    { value: 'LAVENDER', label: 'Lavender' },
    { value: 'POPPY', label: 'Poppy' },
    { value: 'JASMINE', label: 'Jasmine' },
  ];

  // Computed properties
  allSeries = this.seriesStore.allSeries;
  filteredPoints = this.pointsStore.allPoints;
  lastSeedInfo = this.seedStore.lastSeedInfo;
  selectedSeriesCount = this.seriesStore.selectedSeries;

  constructor() {
    // Effect to update points when filters change
    // This would be better with explicit method calls
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.loading.set(true);
    this.error.set('');

    // Load series first
    this.seriesStore.loadAll(undefined);

    // Then load points
    this.pointsStore.load();

    this.loading.set(false);
  }

  setStartDate(value: string): void {
    this.startDate.set(value);
    this.updatePointsFilter();
  }

  setEndDate(value: string): void {
    this.endDate.set(value);
    this.updatePointsFilter();
  }

  isFlowerSelected(flowerType: string): boolean {
    const selected = this.seriesStore.selectedSeries();
    return selected.some((s) => s.type === flowerType);
  }

  toggleFlowerSelection(flowerType: string, checked: boolean): void {
    const allSeries = this.seriesStore.allSeries();
    const serie = allSeries.find((s) => s.type === flowerType);

    if (serie) {
      if (checked) {
        this.seriesStore.selectSeries(serie);
      } else {
        this.seriesStore.deselectSeries(serie.id);
      }
    }

    this.updatePointsFilter();
  }

  private updatePointsFilter(): void {
    // Update points store with current filters
    const startDate = this.startDate();
    const endDate = this.endDate();
    const selectedSerieIds = this.seriesStore.getSelectedSeriesIds();

    this.pointsStore.setDateRange(startDate, endDate);
    this.pointsStore.setSelectedSerieIds(selectedSerieIds);
    this.pointsStore.load();
  }

  loadData(): void {
    this.loading.set(true);
    this.error.set('');

    try {
      this.updatePointsFilter();
    } catch (err) {
      this.error.set('Failed to load data');
    } finally {
      this.loading.set(false);
    }
  }

  seedDatabase(): void {
    this.seeding.set(true);
    this.error.set('');

    this.seedStore.seed({ count: 1000000, months: 1 });

    this.seeding.set(false);
  }

  clearData(): void {
    if (confirm('Are you sure you want to clear all points?')) {
      this.seedStore.clearAll();
    }
  }
}
