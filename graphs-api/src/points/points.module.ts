import { Module } from '@nestjs/common';
import { PointsController } from './controllers/points.controller';
import { PointsRepository } from './repositories/points.repository';
import { PointMapper } from './mappers/point.mapper';

@Module({
  controllers: [PointsController],
  providers: [PointsRepository],
  exports: [PointsRepository],
})
export class PointsModule {}
