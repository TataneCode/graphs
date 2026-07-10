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
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, ScatterChart } from 'echarts/charts';
import type { EChartsCoreOption } from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
} from 'echarts/components';
import { BaseChartComponent, ChartData } from '@/app/shared/components/charts/base-chart.component';
import { Point, Serie } from '@/app/core/models';

// Register required components
echarts.use([
  CanvasRenderer,
  LineChart,
  BarChart,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
]);

@Component({
  selector: 'app-echarts-chart',
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
      <div #chartContainer class="echarts-container"></div>
    </app-base-chart>
  `,
  styles: [
    `
      .echarts-container {
        width: 100%;
        height: 100%;
      }
    `,
  ],
  imports: [BaseChartComponent],
})
export class EchartsChartComponent
  extends BaseChartComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef<HTMLElement>;

  private chart: echarts.ECharts | null = null;
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

    this.chart = echarts.init(this.chartContainer.nativeElement);
    this.updateChart();
  }

  private updateChart(): void {
    if (!this.chart) {
      return;
    }

    const chartData = this.prepareChartData();
    const options = this.getEChartsOptions(chartData);

    this.chart.setOption(options, { notMerge: true });
  }

  private getEChartsOptions(chartData: ChartData): EChartsCoreOption {
    const seriesConfig = chartData.datasets.map((dataset) => ({
      name: dataset.label,
      type: this.chartType() === 'line' ? 'line' : this.chartType() === 'bar' ? 'bar' : 'scatter',
      data: dataset.data.map((value, index) => [chartData.labels[index], value]),
      lineStyle: {
        color: dataset.borderColor,
        width: 2,
      },
      itemStyle: {
        color: (params: any) => {
          const dataIndex = params.dataIndex;
          return dataset.pointBackgroundColor[dataIndex] || dataset.backgroundColor;
        },
        borderColor: (params: any) => {
          const dataIndex = params.dataIndex;
          return dataset.pointBorderColor[dataIndex] || dataset.borderColor;
        },
        borderWidth: 1,
      },
      symbolSize: (params: any) => {
        const dataIndex = params.dataIndex;
        return dataset.pointRadius[dataIndex] || 4;
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          borderWidth: 2,
        },
      },
      smooth: this.chartType() === 'line',
      showSymbol: true,
    }));

    return {
      title: {
        text: this.title(),
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const seriesName = params.seriesName || '';
          const value = params.value[1] || params.value;
          const date = params.value[0] || params.name;
          return `${date}<br>${seriesName}: ${value.toFixed(2)}`;
        },
      },
      legend: {
        data: chartData.datasets.map((d) => d.label),
        top: 'bottom',
        left: 'center',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '20%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        name: 'Date/Time',
        data: chartData.labels,
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          rotate: 45,
          formatter: (value: string) => {
            // Format the date for better readability
            return value.replace('T', ' ').slice(0, 16);
          },
        },
      },
      yAxis: {
        type: 'value',
        name: 'Value',
        min: -65535,
        max: 65535,
        nameLocation: 'middle',
        nameGap: 40,
        axisLabel: {
          formatter: (value: number) => value.toFixed(2),
        },
      },
      series: seriesConfig,
      toolbox: {
        feature: {
          saveAsImage: { title: 'Save as Image' },
          restore: { title: 'Restore' },
          dataView: { title: 'Data View' },
        },
      },
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: 100,
          bottom: '10%',
        },
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
      ],
    };
  }

  private setupResizeObserver(): void {
    if (!this.chartContainer?.nativeElement) {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.chart?.resize();
    });

    this.resizeObserver.observe(this.chartContainer.nativeElement);
  }

  private cleanupChart(): void {
    if (this.chart) {
      this.chart.dispose();
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
