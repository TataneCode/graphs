import { describe, it, expect, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PointsController } from '../../../src/points/controllers/points.controller';
import { PointsRepository } from '../../../src/points/repositories/points.repository';
import { PointMapper } from '../../../src/points/mappers/point.mapper';
import { CreatePointDto } from '../../../src/points/dto/request/create-point.dto';
import { UpdatePointDto } from '../../../src/points/dto/request/update-point.dto';
import { PointsQueryDto } from '../../../src/points/dto/request/points-query.dto';
import { Quality } from '@prisma/client';

describe('PointsController', () => {
  let controller: PointsController;
  let mockPointsRepository: Partial<PointsRepository>;
  let mockPointMapper: Partial<typeof PointMapper>;

  const mockPoint = {
    id: 1,
    serieId: 1,
    creationDate: new Date(),
    value: 100.5,
    quality: Quality.GOOD,
  };

  const mockPointResponse = {
    id: 1,
    serieId: 1,
    creationDate: '2024-01-01T00:00:00.000Z',
    value: 100.5,
    quality: Quality.GOOD,
  };

  beforeEach(async () => {
    mockPointsRepository = {
      findAll: (query?: PointsQueryDto) => Promise.resolve([mockPoint] as any),
      findById: (id: number) => Promise.resolve(id === 1 ? { ...mockPoint } : null),
      create: (dto: CreatePointDto) => Promise.resolve({ ...mockPoint, ...dto, creationDate: new Date(dto.creationDate) }),
      update: (id: number, dto: UpdatePointDto) => Promise.resolve(id === 1 ? { ...mockPoint, ...dto } : null),
      delete: (id: number) => Promise.resolve(id === 1 ? mockPoint : null),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointsController],
      providers: [
        { provide: PointsRepository, useValue: mockPointsRepository },
      ],
    }).compile();

    controller = module.get<PointsController>(PointsController);
  });

  describe('findAll', () => {
    it('should return all points', async () => {
      const result = await controller.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should return filtered points with query', async () => {
      const query: PointsQueryDto = {
        serieIds: [1],
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
      };

      const result = await controller.findAll(query);
      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should return a point by ID', async () => {
      const result = await controller.findById(1);
      expect(result.id).toBe(1);
      expect(result.value).toBe(100.5);
    });

    it('should throw error for non-existent point', async () => {
      await expect(controller.findById(999)).rejects.toThrow('Point not found');
    });
  });

  describe('create', () => {
    it('should create a new point', async () => {
      const dto: CreatePointDto = {
        serieId: 1,
        creationDate: '2024-01-01T00:00:00Z',
        value: 200.5,
        quality: Quality.GOOD,
      };

      const result = await controller.create(dto);
      expect(result.serieId).toBe(1);
      expect(result.value).toBe(200.5);
    });
  });

  describe('update', () => {
    it('should update a point', async () => {
      const dto: UpdatePointDto = {
        id: 1,
        value: 300.5,
      };

      const result = await controller.update(1, dto);
      expect(result.value).toBe(300.5);
    });

    it('should throw error for non-existent point', async () => {
      const dto: UpdatePointDto = { id: 999, value: 300.5 };
      await expect(controller.update(999, dto)).rejects.toThrow('Point not found');
    });
  });

  describe('delete', () => {
    it('should delete a point', async () => {
      await expect(controller.delete(1)).resolves.not.toThrow();
    });

    it('should throw error for non-existent point', async () => {
      await expect(controller.delete(999)).rejects.toThrow('Point not found');
    });
  });
});
