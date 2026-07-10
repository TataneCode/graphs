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
import * as Highcharts from 'highcharts';
import { BaseChartComponent, ChartData } from '@/app/shared/components/charts/base-chart.component';
import { Point, Serie, Quality } from '@/app/core/models';

@Component({
  selector: 'app-highcharts-chart',
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
      <div #chartContainer class="highcharts-container"></div>
    </app-base-chart>
  `,
  styles: [
    `
      .highcharts-container {
        width: 100%;
        height: 100%;
      }
    `,
  ],
  imports: [BaseChartComponent],
})
export class HighchartsChartComponent
  extends BaseChartComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef<HTMLElement>;

  private chart: Highcharts.Chart | null = null;
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
    if (!this.chartContainer?.nativeElement) {
      return;
    }

    this.chart = Highcharts.chart(this.chartContainer.nativeElement, this.getHighchartsOptions());
    this.updateChart();
  }

  private updateChart(): void {
    if (!this.chart) {
      return;
    }

    const chartData = this.prepareChartData();
    const options = this.getHighchartsOptions(chartData);

    this.chart.update(options, true, true, false);
  }

  private getHighchartsOptions(chartData: ChartData = this.prepareChartData()): Highcharts.Options {
    const seriesConfig = chartData.datasets.map((dataset) => ({
      name: dataset.label,
      type: this.chartType(),
      data: dataset.data.map((value, index) => ({
        x: chartData.labels[index],
        y: value,
        marker: {
          fillColor:
            dataset.pointBackgroundColor[chartData.labels.indexOf(chartData.labels[index])] ||
            dataset.backgroundColor,
          lineColor:
            dataset.pointBorderColor[chartData.labels.indexOf(chartData.labels[index])] ||
            dataset.borderColor,
          lineWidth: 1,
          radius: dataset.pointRadius[chartData.labels.indexOf(chartData.labels[index])] || 4,
        },
      })),
      color: dataset.borderColor,
      lineWidth: 2,
    }));

    return {
      title: {
        text: this.title(),
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
        },
      },
      tooltip: {
        formatter: function (this: any) {
          const seriesName = this.series.name || '';
          const value = this.y || 0;
          const date = this.x || this.key;
          return `<b>${date}</b><br>${seriesName}: ${value.toFixed(2)}`;
        },
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
      },
      xAxis: {
        type: 'category',
        title: {
          text: 'Date/Time',
        },
        categories: chartData.labels,
        labels: {
          rotation: -45,
          align: 'right',
          formatter: function (this: any) {
            return this.value.replace('T', ' ').slice(0, 16);
          },
        },
      },
      yAxis: {
        title: {
          text: 'Value',
        },
        min: -65535,
        max: 65535,
        labels: {
          formatter: function (this: any) {
            return this.value.toFixed(2);
          },
        },
      },
      series: seriesConfig,
      chart: {
        height: '100%',
        width: '100%',
        zoomType: 'x',
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: true,
      },
    };
  }

  private setupResizeObserver(): void {
    if (!this.chartContainer?.nativeElement) {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.chart?.reflow();
    });

    this.resizeObserver.observe(this.chartContainer.nativeElement);
  }

  private cleanupChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private cleanupResizeObserver(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
}
