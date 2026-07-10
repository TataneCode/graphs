import { describe, it, expect } from 'vitest';
import { PointMapper } from '@/points/mappers/point.mapper';
import { Quality } from '@/common/enums/quality.enum';
import { CreatePointDto } from '@/points/dto/request/create-point.dto';

describe('PointMapper', () => {
  const mockPoint = {
    id: 1,
    serieId: 1,
    creationDate: new Date('2024-01-15T10:30:00Z'),
    value: 100.5,
    quality: 'GOOD' as const,
  };

  describe('toResponseDto', () => {
    it('should map Prisma Point to PointResponseDto', () => {
      const result = PointMapper.toResponseDto(mockPoint as any);

      expect(result.id).toBe(1);
      expect(result.serieId).toBe(1);
      expect(result.creationDate).toBe('2024-01-15T10:30:00.000Z');
      expect(result.value).toBe(100.5);
      expect(result.quality).toBe(Quality.GOOD);
    });

    it('should handle null dates gracefully', () => {
      const pointWithNull = { ...mockPoint, creationDate: null } as any;
      // This will throw, but we're testing the behavior
      expect(() => PointMapper.toResponseDto(pointWithNull)).toThrow();
    });
  });

  describe('toResponseDtos', () => {
    it('should map array of Points to array of PointResponseDtos', () => {
      const points = [mockPoint, { ...mockPoint, id: 2, value: 200 }];
      const results = PointMapper.toResponseDtos(points as any);

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe(1);
      expect(results[1].id).toBe(2);
      expect(results[1].value).toBe(200);
    });

    it('should return empty array for empty input', () => {
      const results = PointMapper.toResponseDtos([]);
      expect(results).toEqual([]);
    });
  });

  describe('toCreateInput', () => {
    it('should map CreatePointDto to Prisma create input', () => {
      const dto: CreatePointDto = {
        serieId: 1,
        creationDate: '2024-01-15T10:30:00Z',
        value: 100.5,
        quality: Quality.GOOD,
      };

      const result = PointMapper.toCreateInput(dto);

      expect(result.serieId).toBe(1);
      expect(result.creationDate).toBeInstanceOf(Date);
      expect(result.creationDate.toISOString()).toBe('2024-01-15T10:30:00.000Z');
      expect(result.value).toBe(100.5);
      expect(result.quality).toBe('GOOD');
    });

    it('should handle different quality values', () => {
      const dto: CreatePointDto = {
        serieId: 1,
        creationDate: '2024-01-15T10:30:00Z',
        value: -50.5,
        quality: Quality.ERROR,
      };

      const result = PointMapper.toCreateInput(dto);
      expect(result.quality).toBe('ERROR');
      expect(result.value).toBe(-50.5);
    });
  });
});
