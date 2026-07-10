import { describe, it, expect, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { SeedController } from '@/seed/controllers/seed.controller';
import { SeedService } from '@/seed/services/seed.service';
import { SeedDto } from '@/seed/dto/request/seed.dto';

describe('SeedController', () => {
  let controller: SeedController;
  let mockSeedService: Partial<SeedService>;

  beforeEach(async () => {
    mockSeedService = {
      seed: (dto: SeedDto) => Promise.resolve({ seriesCreated: 10, pointsCreated: 1000000 }),
      clearAll: () => Promise.resolve({ pointsDeleted: 1000000 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedController],
      providers: [{ provide: SeedService, useValue: mockSeedService }],
    }).compile();

    controller = module.get<SeedController>(SeedController);
  });

  describe('seed', () => {
    it('should seed database with default values', async () => {
      const dto: SeedDto = {};
      const result = await controller.seed(dto);

      expect(result.message).toBe('Database seeded successfully');
      expect(result.seriesCreated).toBe(10);
      expect(result.pointsCreated).toBe(1000000);
    });

    it('should seed database with custom values', async () => {
      const dto: SeedDto = { count: 100, months: 2 };
      const result = await controller.seed(dto);

      expect(result.message).toBe('Database seeded successfully');
      expect(result.seriesCreated).toBe(10);
      expect(result.pointsCreated).toBe(1000000);
    });
  });

  describe('clearAll', () => {
    it('should clear all points from database', async () => {
      const result = await controller.clearAll();

      expect(result.message).toBe('All points cleared successfully');
      expect(result.pointsDeleted).toBe(1000000);
    });
  });
});
