import { DataUtils } from './data.utils';
import { Point, Quality } from '../models';

describe('DataUtils', () => {
  const mockPoints: Point[] = [
    {
      id: 1,
      serieId: 1,
      creationDate: new Date('2023-01-15T10:00:00Z'),
      value: 100,
      quality: Quality.GOOD,
    },
    {
      id: 2,
      serieId: 1,
      creationDate: new Date('2023-01-15T11:00:00Z'),
      value: 200,
      quality: Quality.DEGRADED,
    },
    {
      id: 3,
      serieId: 2,
      creationDate: new Date('2023-01-15T12:00:00Z'),
      value: -50,
      quality: Quality.ERROR,
    },
  ];

  describe('filterByDateRange', () => {
    it('should filter points by date range', () => {
      const startDate = '2023-01-15T10:30:00Z';
      const endDate = '2023-01-15T11:30:00Z';
      const result = DataUtils.filterByDateRange(mockPoints, startDate, endDate);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(2);
    });
  });

  describe('filterBySeriesIds', () => {
    it('should filter points by series IDs', () => {
      const result = DataUtils.filterBySeriesIds(mockPoints, [1]);
      expect(result.length).toBe(2);
      expect(result.every((p) => p.serieId === 1)).toBe(true);
    });

    it('should return all points for empty serieIds', () => {
      const result = DataUtils.filterBySeriesIds(mockPoints, []);
      expect(result.length).toBe(mockPoints.length);
    });
  });

  describe('filterByQuality', () => {
    it('should filter points by quality', () => {
      const result = DataUtils.filterByQuality(mockPoints, [Quality.GOOD]);
      expect(result.length).toBe(1);
      expect(result[0].quality).toBe(Quality.GOOD);
    });
  });

  describe('toAllOrNothing', () => {
    it('should convert values to 1 or 0 based on threshold', () => {
      const threshold = 150;
      const result = DataUtils.toAllOrNothing(mockPoints, threshold);
      expect(result[0].value).toBe(0); // 100 <= 150
      expect(result[1].value).toBe(1); // 200 > 150
      expect(result[2].value).toBe(0); // -50 <= 150
    });
  });

  describe('sortByDate', () => {
    it('should sort points by creation date ascending', () => {
      const result = DataUtils.sortByDate(mockPoints, true);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });

    it('should sort points by creation date descending', () => {
      const result = DataUtils.sortByDate(mockPoints, false);
      expect(result[0].id).toBe(3);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(1);
    });
  });

  describe('groupBySeries', () => {
    it('should group points by series ID', () => {
      const result = DataUtils.groupBySeries(mockPoints);
      expect(Object.keys(result).length).toBe(2);
      expect(result[1].length).toBe(2);
      expect(result[2].length).toBe(1);
    });
  });

  describe('getUniqueQuality', () => {
    it('should return unique quality values', () => {
      const result = DataUtils.getUniqueQuality(mockPoints);
      expect(result.length).toBe(3);
      expect(result).toContain(Quality.GOOD);
      expect(result).toContain(Quality.DEGRADED);
      expect(result).toContain(Quality.ERROR);
    });
  });

  describe('sampleData', () => {
    it('should sample data to maxPoints', () => {
      const points = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        serieId: 1,
        creationDate: new Date(`2023-01-${i + 1}`),
        value: i * 10,
        quality: Quality.GOOD,
      }));
      const result = DataUtils.sampleData(points, 10);
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it('should return all points if less than maxPoints', () => {
      const result = DataUtils.sampleData(mockPoints, 10);
      expect(result.length).toBe(mockPoints.length);
    });
  });

  describe('arePointsEqual', () => {
    it('should compare points for equality', () => {
      const point1: Point = {
        id: 1,
        serieId: 1,
        creationDate: new Date('2023-01-15'),
        value: 100,
        quality: Quality.GOOD,
      };
      const point2: Point = {
        ...point1,
        creationDate: new Date('2023-01-15'),
      };
      expect(DataUtils.arePointsEqual(point1, point2)).toBe(true);
    });

    it('should return false for different points', () => {
      const point1: Point = {
        id: 1,
        serieId: 1,
        creationDate: new Date('2023-01-15'),
        value: 100,
        quality: Quality.GOOD,
      };
      const point2: Point = {
        ...point1,
        value: 200,
      };
      expect(DataUtils.arePointsEqual(point1, point2)).toBe(false);
    });
  });

  describe('clonePoint', () => {
    it('should create a clone of a point', () => {
      const point: Point = {
        id: 1,
        serieId: 1,
        creationDate: new Date('2023-01-15'),
        value: 100,
        quality: Quality.GOOD,
      };
      const clone = DataUtils.clonePoint(point);
      expect(clone).toEqual(point);
      expect(clone.creationDate).toBeInstanceOf(Date);
    });
  });
});
