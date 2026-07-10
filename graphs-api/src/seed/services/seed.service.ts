import { Injectable } from '@nestjs/common';
import { Prisma, Point, FlowerType, Quality } from '@prisma/client';
import { SeriesRepository } from '@/series/repositories/series.repository';
import { PointsRepository } from '@/points/repositories/points.repository';
import { SeedDto } from '@/seed/dto/request/seed.dto';

@Injectable()
export class SeedService {
  constructor(
    private readonly seriesRepository: SeriesRepository,
    private readonly pointsRepository: PointsRepository
  ) {}

  private readonly flowerDescriptions: Record<string, string> = {
    ROSE: 'A beautiful red rose with thorns',
    TULIP: 'Elegant tulip with colorful petals',
    DAISY: 'Simple and cheerful white daisy',
    LILY: 'Fragrant lily with large petals',
    ORCHID: 'Exotic orchid with complex structure',
    SUNFLOWER: 'Tall sunflower that follows the sun',
    VIOLET: 'Delicate violet with sweet scent',
    LAVENDER: 'Aromatic lavender with purple flowers',
    POPPY: 'Bright red poppy with papery petals',
    JASMINE: 'Fragrant jasmine with white flowers',
  };

  async seed(dto: SeedDto): Promise<{ seriesCreated: number; pointsCreated: number }> {
    const { count = 1000000, months = 1 } = dto;

    // Create all 10 flower series first
    const existingSeries = await this.seriesRepository.findAll();

    if (existingSeries.length === 0) {
      // Create all flower types
      const flowerTypes = Object.values(FlowerType) as FlowerType[];
      for (const type of flowerTypes) {
        await this.seriesRepository.create({
          type,
          description: this.flowerDescriptions[type],
        });
      }
    }

    // Get all series to distribute points
    const allSeries = await this.seriesRepository.findAll();
    const seriesIds = allSeries.map((s) => s.id);

    // Clear existing points first
    await this.pointsRepository.deleteAll();

    // Calculate points per series (distribute evenly)
    const pointsPerSeries = Math.floor(count / seriesIds.length);
    const totalPoints = pointsPerSeries * seriesIds.length;

    // Generate points for each series
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - months * 30 * 24 * 60 * 60 * 1000);

    const pointsToCreate: Array<Omit<Point, 'id'>> = [];

    for (const serieId of seriesIds) {
      for (let i = 0; i < pointsPerSeries; i++) {
        // Distribute points evenly across the timeframe
        const timeRatio = i / pointsPerSeries;
        const pointDate = new Date(
          oneMonthAgo.getTime() + timeRatio * (now.getTime() - oneMonthAgo.getTime())
        );

        // Generate realistic analog values with some randomness
        const baseValue = Math.sin(timeRatio * Math.PI * 2) * 32767; // Sine wave pattern
        const noise = (Math.random() - 0.5) * 1000; // Add some noise
        const value = Math.round(baseValue + noise);

        // Randomly assign quality
        const qualityValues = Object.values(Quality) as Quality[];
        const quality = qualityValues[Math.floor(Math.random() * qualityValues.length)];

        pointsToCreate.push({
          serieId,
          creationDate: pointDate,
          value: value as unknown as Prisma.Decimal,
          quality,
        });
      }
    }

    // Batch insert for better performance
    await this.pointsRepository.createMany(pointsToCreate);

    return {
      seriesCreated: allSeries.length,
      pointsCreated: totalPoints,
    };
  }

  async clearAll(): Promise<{ pointsDeleted: number }> {
    const count = await this.pointsRepository.count();
    await this.pointsRepository.deleteAll();
    return { pointsDeleted: count };
  }
}
