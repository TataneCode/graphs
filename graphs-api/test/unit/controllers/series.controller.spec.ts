import { describe, it, expect, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { SeriesController } from '../../../src/series/controllers/series.controller';
import { SeriesRepository } from '../../../src/series/repositories/series.repository';
import { SerieMapper } from '../../../src/series/mappers/serie.mapper';
import { CreateSerieDto } from '../../../src/series/dto/request/create-serie.dto';
import { UpdateSerieDto } from '../../../src/series/dto/request/update-serie.dto';
import { FlowerType } from '@prisma/client';

describe('SeriesController', () => {
  let controller: SeriesController;
  let mockSeriesRepository: Partial<SeriesRepository>;
  let mockSerieMapper: Partial<typeof SerieMapper>;

  const mockSerie = {
    id: 1,
    type: FlowerType.ROSE,
    description: 'Test rose',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSerieResponse = {
    id: 1,
    type: FlowerType.ROSE,
    description: 'Test rose',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    mockSeriesRepository = {
      findAll: () => Promise.resolve([mockSerie] as any),
      findById: (id: number) => Promise.resolve(id === 1 ? { ...mockSerie } : null),
      create: (dto: CreateSerieDto) => Promise.resolve({ ...mockSerie, ...dto }),
      update: (id: number, dto: UpdateSerieDto) =>
        Promise.resolve(id === 1 ? { ...mockSerie, ...dto } : null),
      delete: (id: number) => Promise.resolve(id === 1 ? mockSerie : null),
    };

    mockSerieMapper = {
      toResponseDto: (serie: any) => ({
        ...serie,
        createdAt: serie.createdAt.toISOString(),
        updatedAt: serie.updatedAt.toISOString(),
      }),
      toResponseDtos: (series: any[]) =>
        series.map((serie) => ({
          ...serie,
          createdAt: serie.createdAt.toISOString(),
          updatedAt: serie.updatedAt.toISOString(),
        })),
      toCreateInput: (dto: CreateSerieDto) => ({ type: dto.type, description: dto.description }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeriesController],
      providers: [{ provide: SeriesRepository, useValue: mockSeriesRepository }],
    }).compile();

    controller = module.get<SeriesController>(SeriesController);
  });

  describe('findAll', () => {
    it('should return all series', async () => {
      const result = await controller.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe(FlowerType.ROSE);
    });
  });

  describe('findById', () => {
    it('should return a serie by ID', async () => {
      const result = await controller.findById(1);
      expect(result.id).toBe(1);
      expect(result.type).toBe(FlowerType.ROSE);
    });

    it('should throw error for non-existent serie', async () => {
      await expect(controller.findById(999)).rejects.toThrow('Serie not found');
    });
  });

  describe('create', () => {
    it('should create a new serie', async () => {
      const dto: CreateSerieDto = {
        type: FlowerType.TULIP,
        description: 'Test tulip',
      };

      const result = await controller.create(dto);
      expect(result.type).toBe(FlowerType.TULIP);
      expect(result.description).toBe('Test tulip');
    });
  });

  describe('update', () => {
    it('should update a serie', async () => {
      const dto: UpdateSerieDto = {
        id: 1,
        description: 'Updated description',
      };

      const result = await controller.update(1, dto);
      expect(result.description).toBe('Updated description');
    });

    it('should throw error for non-existent serie', async () => {
      const dto: UpdateSerieDto = { id: 999, description: 'Test' };
      await expect(controller.update(999, dto)).rejects.toThrow('Serie not found');
    });
  });

  describe('delete', () => {
    it('should delete a serie', async () => {
      await expect(controller.delete(1)).resolves.not.toThrow();
    });

    it('should throw error for non-existent serie', async () => {
      await expect(controller.delete(999)).rejects.toThrow('Serie not found');
    });
  });
});
