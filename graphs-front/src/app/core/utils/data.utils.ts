import { Point, Serie, Quality } from '@/app/core/models';

export class DataUtils {
  /**
   * Filter points by date range
   */
  static filterByDateRange(
    points: Point[],
    startDate: string | Date,
    endDate: string | Date
  ): Point[] {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return points.filter((point) => {
      const pointDate = new Date(point.creationDate);
      return pointDate >= start && pointDate <= end;
    });
  }

  /**
   * Filter points by series IDs
   */
  static filterBySeriesIds(points: Point[], serieIds: number[]): Point[] {
    if (serieIds.length === 0) return points;
    return points.filter((point) => serieIds.includes(point.serieId));
  }

  /**
   * Filter points by quality
   */
  static filterByQuality(points: Point[], qualityFilters: Quality[]): Point[] {
    if (qualityFilters.length === 0) return points;
    return points.filter((point) => qualityFilters.includes(point.quality));
  }

  /**
   * Convert all-or-nothing logic: value > threshold -> 1, else 0
   */
  static toAllOrNothing(points: Point[], threshold: number): Point[] {
    return points.map((point) => ({
      ...point,
      value: point.value > threshold ? 1 : 0,
    }));
  }

  /**
   * Sort points by creation date
   */
  static sortByDate(points: Point[], ascending: boolean = true): Point[] {
    return [...points].sort((a, b) => {
      const dateA = new Date(a.creationDate).getTime();
      const dateB = new Date(b.creationDate).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Group points by series
   */
  static groupBySeries(points: Point[]): Record<number, Point[]> {
    return points.reduce(
      (acc, point) => {
        if (!acc[point.serieId]) {
          acc[point.serieId] = [];
        }
        acc[point.serieId].push(point);
        return acc;
      },
      {} as Record<number, Point[]>
    );
  }

  /**
   * Get unique quality values from points
   */
  static getUniqueQuality(points: Point[]): Quality[] {
    const qualities = points.map((p) => p.quality);
    return [...new Set(qualities)];
  }

  /**
   * Sample data for performance (reduce number of points)
   */
  static sampleData(points: Point[], maxPoints: number = 1000): Point[] {
    if (points.length <= maxPoints) return points;

    const sampled: Point[] = [];
    const interval = Math.ceil(points.length / maxPoints);

    for (let i = 0; i < points.length; i += interval) {
      sampled.push(points[i]);
    }

    return sampled;
  }

  /**
   * Aggregate data by time intervals (for large datasets)
   */
  static aggregateByInterval(points: Point[], intervalMinutes: number = 5): Point[] {
    if (points.length === 0) return [];

    const aggregated: Record<string, { sum: number; count: number; quality: Quality }> = {};

    points.forEach((point) => {
      const date = new Date(point.creationDate);
      const intervalStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        Math.floor((date.getHours() * 60) / intervalMinutes) * intervalMinutes,
        0,
        0,
        0
      );
      const key = intervalStart.toISOString();

      if (!aggregated[key]) {
        aggregated[key] = { sum: 0, count: 0, quality: point.quality };
      }

      aggregated[key].sum += point.value;
      aggregated[key].count += 1;
      // Keep the most severe quality
      if (this.isMoreSevere(point.quality, aggregated[key].quality)) {
        aggregated[key].quality = point.quality;
      }
    });

    return Object.entries(aggregated).map(([key, agg]) => ({
      id: 0, // Will be regenerated on backend
      serieId: points[0].serieId, // Use first point's series
      creationDate: new Date(key),
      value: agg.sum / agg.count, // Average
      quality: agg.quality,
    }));
  }

  /**
   * Check if one quality is more severe than another
   */
  private static isMoreSevere(q1: Quality, q2: Quality): boolean {
    const severity: Record<Quality, number> = {
      [Quality.GOOD]: 0,
      [Quality.DEGRADED]: 1,
      [Quality.ERROR]: 2,
    };
    return severity[q1] > severity[q2];
  }

  /**
   * Generate random points for testing
   */
  static generateRandomPoints(
    serieId: number,
    count: number = 100,
    startDate: Date = new Date(),
    endDate: Date = new Date()
  ): Point[] {
    const points: Point[] = [];
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const range = endTime - startTime;

    for (let i = 0; i < count; i++) {
      const time = startTime + Math.random() * range;
      const date = new Date(time);

      points.push({
        id: i + 1,
        serieId,
        creationDate: date,
        value: Math.random() * 131070 - 65535, // Range: -65535 to 65535
        quality: this.getRandomQuality(),
      });
    }

    return points;
  }

  /**
   * Get random quality
   */
  private static getRandomQuality(): Quality {
    const qualities: Quality[] = [Quality.GOOD, Quality.DEGRADED, Quality.ERROR];
    const randomIndex = Math.floor(Math.random() * qualities.length);
    return qualities[randomIndex];
  }

  /**
   * Check if two points are equal
   */
  static arePointsEqual(p1: Point, p2: Point): boolean {
    return (
      p1.id === p2.id &&
      p1.serieId === p2.serieId &&
      new Date(p1.creationDate).getTime() === new Date(p2.creationDate).getTime() &&
      p1.value === p2.value &&
      p1.quality === p2.quality
    );
  }

  /**
   * Clone a point
   */
  static clonePoint(point: Point): Point {
    return {
      ...point,
      creationDate: new Date(point.creationDate),
    };
  }
}
