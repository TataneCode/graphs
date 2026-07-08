import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateUtils, DataUtils } from '../../app/core/utils';
import { SeriesStore, PointsStore, SeedStore } from '../../app/core/stores';
import {
  DatePickerComponent,
  ButtonComponent,
  DropdownComponent,
  CheckboxComponent,
} from '../../app/shared/components/ui';
import {
  EchartsChartComponent,
  HighchartsChartComponent,
  ScichartChartComponent,
} from '../../app/shared/components/charts';
import { Point, Quality } from '../../app/core/models';

@Component({
  selector: 'app-all-or-nothing-page',
  standalone: true,
  imports: [
    FormsModule,
    DatePickerComponent,
    ButtonComponent,
    DropdownComponent,
    CheckboxComponent,
    EchartsChartComponent,
    HighchartsChartComponent,
    ScichartChartComponent,
  ],
  template: `
    <div class="all-or-nothing-page">
      <h1 class="all-or-nothing-page__title">All-or-Nothing Signal Graph</h1>

      <div class="all-or-nothing-page__controls">
        <div class="all-or-nothing-page__form">
          <h2>Filters</h2>

          <!-- Date Range -->
          <div class="all-or-nothing-page__form-row">
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

          <!-- Flower Type Dropdown -->
          <div class="all-or-nothing-page__form-row">
            <app-dropdown
              label="Flower Type"
              [value]="selectedFlowerType()"
              [options]="flowerTypeOptions()"
              placeholder="Select a flower"
              (valueChange)="setSelectedFlowerType($event)"
            />
          </div>

          <!-- Threshold Input -->
          <div class="all-or-nothing-page__form-row">
            <div class="all-or-nothing-page__input-group">
              <label class="all-or-nothing-page__input-label">Threshold</label>
              <input
                type="number"
                [value]="threshold()"
                (input)="setThreshold($event)"
                class="all-or-nothing-page__input"
                placeholder="Enter threshold value"
                step="0.01"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="all-or-nothing-page__actions">
            <app-button
              label="Apply Filters"
              variant="primary"
              [loading]="loading()"
              (click)="applyFilters()"
            />

            <app-button label="Reset" variant="secondary" (click)="resetFilters()" />
          </div>

          <!-- Quality Filters -->
          <div class="all-or-nothing-page__form-section">
            <h3>Quality Filters</h3>
            <div class="all-or-nothing-page__checkboxes">
              @for (quality of qualityOptions; track quality.value) {
                <app-checkbox
                  [label]="quality.label"
                  [checked]="isQualitySelected(quality.value)"
                  (checkedChange)="toggleQualitySelection(quality.value, $event)"
                />
              }
            </div>
          </div>

          @if (error()) {
            <div class="all-or-nothing-page__error">{{ error() }}</div>
          }
        </div>

        <div class="all-or-nothing-page__info">
          <h3>Statistics</h3>
          <p>Points processed: {{ processedPoints().length }}</p>
          <p>Above threshold: {{ aboveThresholdCount() }}</p>
          <p>Below threshold: {{ belowThresholdCount() }}</p>
          @if (threshold()) {
            <p>Threshold: {{ threshold() }}</p>
          }
        </div>
      </div>

      <!-- Charts Row -->
      <div class="all-or-nothing-page__charts">
        <div class="all-or-nothing-page__chart-container">
          <app-echarts-chart
            title="ECharts - All-or-Nothing"
            [data]="processedPoints()"
            [series]="[selectedSerie()]"
            [startDate]="startDate()"
            [endDate]="endDate()"
            chartType="line"
            [showQualityColors]="true"
          />
        </div>

        <div class="all-or-nothing-page__chart-container">
          <app-highcharts-chart
            title="Highcharts - All-or-Nothing"
            [data]="processedPoints()"
            [series]="[selectedSerie()]"
            [startDate]="startDate()"
            [endDate]="endDate()"
            chartType="line"
            [showQualityColors]="true"
          />
        </div>

        <div class="all-or-nothing-page__chart-container">
          <app-scichart-chart
            title="SciChart - All-or-Nothing"
            [data]="processedPoints()"
            [series]="[selectedSerie()]"
            [startDate]="startDate()"
            [endDate]="endDate()"
            chartType="line"
            [showQualityColors]="true"
          />
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .all-or-nothing-page {
        max-width: 1600px;
        margin: 0 auto;
        padding: 1rem;
      }

      .all-or-nothing-page__title {
        text-align: center;
        color: #333;
        margin-bottom: 2rem;
      }

      .all-or-nothing-page__controls {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }

      .all-or-nothing-page__form {
        flex: 1;
        min-width: 400px;
        padding: 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        background: #f9f9f9;
      }

      .all-or-nothing-page__form-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }

      .all-or-nothing-page__form-section {
        margin-bottom: 1.5rem;
      }

      .all-or-nothing-page__input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
        min-width: 200px;
      }

      .all-or-nothing-page__input-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #333;
      }

      .all-or-nothing-page__input {
        padding: 0.5rem 0.75rem;
        border: 1px solid #ddd;
        border-radius: 0.25rem;
        font-size: 1rem;
        transition: border-color 0.2s;

        &:focus {
          outline: none;
          border-color: #007bff;
        }
      }

      .all-or-nothing-page__checkboxes {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 0.5rem;
      }

      .all-or-nothing-page__actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        flex-wrap: wrap;
      }

      .all-or-nothing-page__info {
        flex: 0 0 300px;
        padding: 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        background: #f9f9f9;
      }

      .all-or-nothing-page__error {
        color: #dc3545;
        padding: 0.5rem;
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 0.25rem;
        margin-top: 1rem;
      }

      .all-or-nothing-page__charts {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
      }

      .all-or-nothing-page__chart-container {
        flex: 1;
        min-width: 500px;
        margin-bottom: 1rem;
      }

      @media (max-width: 1200px) {
        .all-or-nothing-page__chart-container {
          min-width: 100%;
        }
      }
    `,
  ],
})
export class AllOrNothingPage implements OnInit {
  private readonly seriesStore = inject(SeriesStore);
  private readonly pointsStore = inject(PointsStore);
  private readonly seedStore = inject(SeedStore);

  // State
  startDate = signal<string>(DateUtils.formatForInput(DateUtils.oneMonthAgo()));
  endDate = signal<string>(DateUtils.formatForInput(DateUtils.now()));
  selectedFlowerType = signal<string>('');
  threshold = signal<string>('0');
  loading = signal<boolean>(false);
  error = signal<string>('');

  // Quality filters
  selectedQualities = signal<string[]>([]);

  // Computed properties
  allSeries = this.seriesStore.allSeries;
  allPoints = this.pointsStore.allPoints;

  flowerTypeOptions = computed(() => {
    const series = this.seriesStore.allSeries();
    return series.map((s) => ({ value: s.type, label: s.type }));
  });

  qualityOptions = [
    { value: 'GOOD', label: 'Good' },
    { value: 'DEGRADED', label: 'Degraded' },
    { value: 'ERROR', label: 'Error' },
  ];

  selectedSerie = computed(() => {
    const series = this.seriesStore.allSeries();
    const flowerType = this.selectedFlowerType();
    return series.find((s) => s.type === flowerType) || series[0];
  });

  processedPoints = computed(() => {
    const points = this.filterPoints();
    const threshold = parseFloat(this.threshold()) || 0;
    return DataUtils.toAllOrNothing(points, threshold);
  });

  aboveThresholdCount = computed(() => {
    const points = this.filterPoints();
    const threshold = parseFloat(this.threshold()) || 0;
    return points.filter((p) => p.value > threshold).length;
  });

  belowThresholdCount = computed(() => {
    const points = this.filterPoints();
    const threshold = parseFloat(this.threshold()) || 0;
    return points.filter((p) => p.value <= threshold).length;
  });

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

    // Set default flower type to first series
    const series = this.seriesStore.allSeries();
    if (series.length > 0) {
      this.selectedFlowerType.set(series[0].type);
    }

    this.loading.set(false);
  }

  setStartDate(value: string): void {
    this.startDate.set(value);
  }

  setEndDate(value: string): void {
    this.endDate.set(value);
  }

  setSelectedFlowerType(value: string | number): void {
    this.selectedFlowerType.set(value.toString());
  }

  setThreshold(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.threshold.set(input.value);
  }

  isQualitySelected(quality: string): boolean {
    return this.selectedQualities().includes(quality);
  }

  toggleQualitySelection(quality: string, checked: boolean): void {
    const current = this.selectedQualities();
    if (checked) {
      this.selectedQualities.set([...current, quality]);
    } else {
      this.selectedQualities.set(current.filter((q) => q !== quality));
    }
  }

  applyFilters(): void {
    this.loading.set(true);
    this.error.set('');

    try {
      this.updatePointsFilter();
    } catch (err) {
      this.error.set('Failed to apply filters');
    } finally {
      this.loading.set(false);
    }
  }

  resetFilters(): void {
    this.startDate.set(DateUtils.formatForInput(DateUtils.oneMonthAgo()));
    this.endDate.set(DateUtils.formatForInput(DateUtils.now()));
    this.threshold.set('0');
    this.selectedQualities.set([]);

    const series = this.seriesStore.allSeries();
    if (series.length > 0) {
      this.selectedFlowerType.set(series[0].type);
    }

    this.updatePointsFilter();
  }

  private filterPoints(): Point[] {
    let points = this.pointsStore.allPoints();

    // Filter by date range
    const startDate = this.startDate();
    const endDate = this.endDate();

    if (startDate) {
      points = DataUtils.filterByDateRange(points, startDate, endDate);
    }

    // Filter by selected flower type
    const flowerType = this.selectedFlowerType();
    if (flowerType) {
      const serie = this.seriesStore.allSeries().find((s) => s.type === flowerType);
      if (serie) {
        points = DataUtils.filterBySeriesIds(points, [serie.id]);
      }
    }

    // Filter by quality
    const qualities = this.selectedQualities();
    if (qualities.length > 0) {
      points = DataUtils.filterByQuality(points, qualities as Quality[]);
    }

    return points;
  }

  private updatePointsFilter(): void {
    const startDate = this.startDate();
    const endDate = this.endDate();
    const flowerType = this.selectedFlowerType();

    // Update points store with current filters
    this.pointsStore.setDateRange(startDate, endDate);

    if (flowerType) {
      const serie = this.seriesStore.allSeries().find((s) => s.type === flowerType);
      if (serie) {
        this.pointsStore.setSelectedSerieIds([serie.id]);
      }
    }

    this.pointsStore.load();
  }
}
