import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Graphs API - Flower Series Benchmarking';
  }

  @Get('/health')
  healthCheck(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('/api')
  getApiInfo(): {
    name: string;
    version: string;
    description: string;
    endpoints: {
      health: string;
      docs: string;
      series: string;
      points: string;
      seed: string;
    };
  } {
    return {
      name: 'Graphs API',
      version: '1.0.0',
      description: 'Benchmarking graphs API for flower series and points',
      endpoints: {
        health: '/health',
        docs: '/docs',
        series: '/series',
        points: '/points',
        seed: '/seed',
      },
    };
  }
}
