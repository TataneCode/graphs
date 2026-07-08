import { Component, input, output, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Point, Serie, Quality, FlowerType } from '../../../app/core/models';

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  pointBackgroundColor: string[];
  pointBorderColor: string[];
  pointRadius: number[];
}

export interface ChartOptions {
  title?: string;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  scales?: {
    x?: {
      type: string;
      title?: string;
    };
    y?: {
      title?: string;
      min?: number;
      max?: number;
    };
  };
  plugins?: {
    legend?: {
      display?: boolean;
      position?: string;
    };
    tooltip?: {
      callbacks?: {
        label?: (context: any) => string;
      };
    };
  };
}

@Component({
  selector: 'app-base-chart',
  standalone: true,
  template: `
    <div class="base-chart">
      <div class="base-chart__header">
        @if (title()) {
          <h3 class="base-chart__title">{{ title() }}</h3>
        }
        <div class="base-chart__legend">
          @for (legendItem of legendItems(); track legendItem.label) {
            <div class="base-chart__legend-item">
              <span
                class="base-chart__legend-color"
                [style.backgroundColor]="legendItem.color"
              ></span>
              <span class="base-chart__legend-label">{{ legendItem.label }}</span>
            </div>
          }
        </div>
      </div>
      <div class="base-chart__container">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .base-chart {
        display: flex;
        flex-direction: column;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        padding: 1rem;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .base-chart__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
      }

      .base-chart__title {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: #333;
      }

      .base-chart__legend {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .base-chart__legend-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.75rem;
        color: #666;
      }

      .base-chart__legend-color {
        display: inline-block;
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 0.125rem;
        border: 1px solid #ddd;
      }

      .base-chart__legend-label {
        white-space: nowrap;
      }

      .base-chart__container {
        height: 400px;
        position: relative;
      }
    `,
  ],
})
export class BaseChartComponent implements OnInit, OnChanges {
  // Inputs
  title = input<string>('Chart');
  data = input<Point[]>([]);
  series = input<Serie[]>([]);
  startDate = input<string>('');
  endDate = input<string>('');

  // Chart-specific configuration
  chartType = input<'line' | 'bar' | 'scatter'>('line');
  showQualityColors = input<boolean>(true);

  // Outputs
  dataLoaded = output<ChartData>();

  // State
  legendItems = signal<Array<{ label: string; color: string }>>([]);

  // Flower type colors for consistent series coloring
  private flowerTypeColors: Record<FlowerType, string> = {
    [FlowerType.ROSE]: '#FF6B6B',
    [FlowerType.TULIP]: '#4ECDC4',
    [FlowerType.DAISY]: '#45B7D1',
    [FlowerType.LILY]: '#96CEB4',
    [FlowerType.ORCHID]: '#FFEAA7',
    [FlowerType.SUNFLOWER]: '#DDA0DD',
    [FlowerType.VIOLET]: '#98D8C8',
    [FlowerType.LAVENDER]: '#F7DC6F',
    [FlowerType.POPPY]: '#BB8FCE',
    [FlowerType.JASMINE]: '#85C1E9',
  };

  // Quality colors
  private qualityColors: Record<Quality, string> = {
    [Quality.GOOD]: '#28a745',
    [Quality.DEGRADED]: '#ffc107',
    [Quality.ERROR]: '#dc3545',
  };

  ngOnInit(): void {
    this.updateLegend();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series'] || changes['data']) {
      this.updateLegend();
    }
  }

  protected prepareChartData(): ChartData {
    const points = this.data();
    const seriesList = this.series();

    if (points.length === 0 || seriesList.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Group points by series
    const pointsBySeries: Record<number, Point[]> = {};
    points.forEach((point) => {
      if (!pointsBySeries[point.serieId]) {
        pointsBySeries[point.serieId] = [];
      }
      pointsBySeries[point.serieId].push(point);
    });

    // Create datasets for each series
    const datasets: ChartDataset[] = seriesList.map((serie) => {
      const seriePoints = pointsBySeries[serie.id] || [];

      // Sort by creation date
      seriePoints.sort(
        (a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime()
      );

      const data = seriePoints.map((p) => p.value);
      const labels = seriePoints.map((p) => this.formatDate(p.creationDate));

      // Set colors based on quality if enabled
      const pointBackgroundColors = this.showQualityColors()
        ? seriePoints.map((p) => this.qualityColors[p.quality])
        : Array(data.length).fill(this.flowerTypeColors[serie.type]);

      const pointBorderColors = pointBackgroundColors.map((color) => this.adjustAlpha(color, 0.3));

      const pointRadii = seriePoints.map((p) => this.getPointRadius(p.quality));

      return {
        label: serie.type,
        data,
        borderColor: this.flowerTypeColors[serie.type],
        backgroundColor: this.adjustAlpha(this.flowerTypeColors[serie.type], 0.1),
        pointBackgroundColor: pointBackgroundColors,
        pointBorderColor: pointBorderColors,
        pointRadius: pointRadii,
      };
    });

    // Use the first series' labels (assuming they're aligned)
    const firstSeriesPoints = pointsBySeries[seriesList[0]?.id] || [];
    const labels = firstSeriesPoints
      .sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime())
      .map((p) => this.formatDate(p.creationDate));

    return { labels, datasets };
  }

  protected formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16).replace('T', ' ');
  }

  private updateLegend(): void {
    const seriesList = this.series();
    const legendItems = seriesList.map((serie) => ({
      label: serie.type,
      color: this.flowerTypeColors[serie.type],
    }));

    if (this.showQualityColors()) {
      legendItems.push(
        { label: 'Good', color: this.qualityColors[Quality.GOOD] },
        { label: 'Degraded', color: this.qualityColors[Quality.DEGRADED] },
        { label: 'Error', color: this.qualityColors[Quality.ERROR] }
      );
    }

    this.legendItems.set(legendItems);
  }

  private adjustAlpha(color: string, alpha: number): string {
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private getPointRadius(quality: Quality): number {
    switch (quality) {
      case Quality.GOOD:
        return 4;
      case Quality.DEGRADED:
        return 6;
      case Quality.ERROR:
        return 8;
      default:
        return 4;
    }
  }

  // Common chart options
  protected getBaseChartOptions(): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Date/Time',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Value',
          },
          min: -65535,
          max: 65535,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y || 0;
              return `${label}: ${value.toFixed(2)}`;
            },
          },
        },
      },
    };
  }
}
