import { Module } from '@nestjs/common';
import { SeriesController } from '@/series/controllers/series.controller';
import { SeriesRepository } from '@/series/repositories/series.repository';

@Module({
  controllers: [SeriesController],
  providers: [SeriesRepository],
  exports: [SeriesRepository],
})
export class SeriesModule {}
