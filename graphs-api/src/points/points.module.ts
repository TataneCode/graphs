import { Module } from '@nestjs/common';
import { PointsController } from '@/points/controllers/points.controller';
import { PointsRepository } from '@/points/repositories/points.repository';

@Module({
  controllers: [PointsController],
  providers: [PointsRepository],
  exports: [PointsRepository],
})
export class PointsModule {}
