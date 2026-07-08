import { Module } from '@nestjs/common';
import { SeriesController } from './controllers/series.controller';
import { SeriesRepository } from './repositories/series.repository';
import { SerieMapper } from './mappers/serie.mapper';

@Module({
  controllers: [SeriesController],
  providers: [SeriesRepository],
  exports: [SeriesRepository],
})
export class SeriesModule {}
