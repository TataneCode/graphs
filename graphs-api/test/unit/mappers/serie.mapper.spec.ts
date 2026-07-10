import { describe, it, expect } from 'vitest';
import { SerieMapper } from '@/series/mappers/serie.mapper';
import { FlowerType } from '@/common/enums/flower-type.enum';
import { CreateSerieDto } from '@/series/dto/request/create-serie.dto';

describe('SerieMapper', () => {
  const mockSerie = {
    id: 1,
    type: 'ROSE' as const,
    description: 'Beautiful red rose',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-16T10:30:00Z'),
    points: [],
  };

  describe('toResponseDto', () => {
    it('should map Prisma Serie to SerieResponseDto', () => {
      const result = SerieMapper.toResponseDto(mockSerie);

      expect(result.id).toBe(1);
      expect(result.type).toBe(FlowerType.ROSE);
      expect(result.description).toBe('Beautiful red rose');
      expect(result.createdAt).toBe('2024-01-15T10:30:00.000Z');
      expect(result.updatedAt).toBe('2024-01-16T10:30:00.000Z');
      expect(result.points).toEqual([]);
    });

    it('should map with points included', () => {
      const serieWithPoints = {
        ...mockSerie,
        points: [{ id: 1, creationDate: new Date(), value: 100, quality: 'GOOD' }],
      };
      const result = SerieMapper.toResponseDto(serieWithPoints);

      expect(result.points).toHaveLength(1);
      expect(result.points?.[0].id).toBe(1);
    });
  });

  describe('toResponseDtos', () => {
    it('should map array of Series to array of SerieResponseDtos', () => {
      const series = [mockSerie, { ...mockSerie, id: 2, type: 'TULIP' as const }];
      const results = SerieMapper.toResponseDtos(series);

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe(1);
      expect(results[1].id).toBe(2);
      expect(results[1].type).toBe(FlowerType.TULIP);
    });

    it('should return empty array for empty input', () => {
      const results = SerieMapper.toResponseDtos([]);
      expect(results).toEqual([]);
    });
  });

  describe('toCreateInput', () => {
    it('should map CreateSerieDto to Prisma create input', () => {
      const dto: CreateSerieDto = {
        type: FlowerType.DAISY,
        description: 'White daisy',
      };

      const result = SerieMapper.toCreateInput(dto);

      expect(result.type).toBe('DAISY');
      expect(result.description).toBe('White daisy');
      expect(result).not.toHaveProperty('id');
      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('updatedAt');
    });

    it('should handle special characters in description', () => {
      const dto: CreateSerieDto = {
        type: FlowerType.LILY,
        description: 'Lily with special chars: <>&"\'',
      };

      const result = SerieMapper.toCreateInput(dto);
      expect(result.description).toBe('Lily with special chars: <>&"\'');
    });
  });
});
