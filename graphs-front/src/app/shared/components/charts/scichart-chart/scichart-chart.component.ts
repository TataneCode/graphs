import {
  Component,
  input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { BaseChartComponent, ChartData } from '@/app/shared/components/charts/base-chart.component';
import { Point, Serie, Quality } from '@/app/core/models';

// SciChart types - using any for flexibility since SciChart JS API varies
declare const SciChart: any;

@Component({
  selector: 'app-scichart-chart',
  standalone: true,
  template: `
    <app-base-chart
      [title]="title()"
      [data]="data()"
      [series]="series()"
      [startDate]="startDate()"
      [endDate]="endDate()"
      [chartType]="chartType()"
      [showQualityColors]="showQualityColors()"
    >
      <div #chartContainer class="scichart-container"></div>
    </app-base-chart>
  `,
  styles: [
    `
      .scichart-container {
        width: 100%;
        height: 100%;
      }
    `,
  ],
  imports: [BaseChartComponent],
})
export class ScichartChartComponent
  extends BaseChartComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef<HTMLElement>;

  private chart: any = null;
  private resizeObserver: ResizeObserver | null = null;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    this.initChart();
    this.setupResizeObserver();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    this.updateChart();
  }

  ngOnDestroy(): void {
    this.cleanupChart();
    this.cleanupResizeObserver();
  }

  private initChart(): void {
    if (!this.chartContainer?.nativeElement || typeof SciChart === 'undefined') {
      return;
    }

    // Initialize SciChart
    try {
      this.chart = SciChart.Surface.create(this.chartContainer.nativeElement);
      this.updateChart();
    } catch (error) {
      console.error('Failed to initialize SciChart:', error);
    }
  }

  private updateChart(): void {
    if (!this.chart || !SciChart) {
      return;
    }

    const chartData = this.prepareChartData();

    try {
      // Clear existing series
      this.chart.renderableSeries.clear();
      this.chart.xAxes.clear();
      this.chart.yAxes.clear();

      // Add X and Y axes
      const xAxis = SciChart.Axis.create('Date/Time', SciChart.EAxisType.DateTime);
      const yAxis = SciChart.Axis.create('Value', SciChart.EAxisType.Numeric);

      yAxis.axisAlignment = SciChart.EAxisAlignment.Left;
      yAxis.visibleRange = { min: -65535, max: 65535 };

      this.chart.xAxes.add(xAxis);
      this.chart.yAxes.add(yAxis);

      // Create series for each dataset
      chartData.datasets.forEach((dataset) => {
        const points = dataset.data.map((value, index) => ({
          x: this.parseDate(chartData.labels[index]),
          y: value,
        }));

        const lineSeries = SciChart.Series.create(
          dataset.label,
          points,
          SciChart.ESeriesType.LineSeries
        );

        // Set series styling
        lineSeries.stroke = dataset.borderColor;
        lineSeries.strokeThickness = 2;
        lineSeries.pointMarker = SciChart.EPointMarker.Ellipse;
        lineSeries.pointMarkerSize = 8;
        lineSeries.pointMarkerFill = dataset.backgroundColor;
        lineSeries.pointMarkerStroke = dataset.borderColor;
        lineSeries.pointMarkerStrokeThickness = 1;

        this.chart.renderableSeries.add(lineSeries);
      });

      // Add zoom/pan modifiers
      this.chart.chartModifiers.add(
        SciChart.Modifiers.create(SciChart.EModifierType.ZoomPanModifier)
      );

      this.chart.chartModifiers.add(
        SciChart.Modifiers.create(SciChart.EModifierType.MouseWheelZoomModifier)
      );

      this.chart.chartModifiers.add(
        SciChart.Modifiers.create(SciChart.EModifierType.RollOverModifier, {
          showTooltip: true,
          toolTipFormatting: (context: any) => {
            const seriesName = context.series.name;
            const point = context.dataPoint;
            const date = new Date(point.x).toISOString().slice(0, 16).replace('T', ' ');
            const value = point.y.toFixed(2);
            return `${date}<br>${seriesName}: ${value}`;
          },
        })
      );

      this.chart.requestRedraw();
    } catch (error) {
      console.error('Failed to update SciChart:', error);
    }
  }

  private parseDate(dateString: string): number {
    // Convert ISO date string to timestamp
    return new Date(dateString).getTime();
  }

  private setupResizeObserver(): void {
    if (!this.chartContainer?.nativeElement) {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.chart?.updateController();
      this.chart?.requestRedraw();
    });

    this.resizeObserver.observe(this.chartContainer.nativeElement);
  }

  private cleanupChart(): void {
    if (this.chart && SciChart) {
      try {
        SciChart.Surface.delete(this.chart);
        this.chart = null;
      } catch (error) {
        console.error('Failed to cleanup SciChart:', error);
      }
    }
  }

  private cleanupResizeObserver(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
}
