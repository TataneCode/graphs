import { Module } from '@nestjs/common';
import { SeedController } from './controllers/seed.controller';
import { SeedService } from './services/seed.service';
import { SeriesRepository } from '../series/repositories/series.repository';
import { PointsRepository } from '../points/repositories/points.repository';

@Module({
  controllers: [SeedController],
  providers: [SeedService, SeriesRepository, PointsRepository],
  exports: [SeedService],
})
export class SeedModule {}
