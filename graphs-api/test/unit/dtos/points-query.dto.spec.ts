import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { PointsQueryDto } from '../../../src/points/dto/request/points-query.dto';
import { Quality } from '../../../src/common/enums/quality.enum';

describe('PointsQueryDto', () => {
  it('should pass validation with empty dto', async () => {
    const dto = new PointsQueryDto();
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation with all fields', async () => {
    const dto = new PointsQueryDto();
    dto.serieIds = [1, 2, 3];
    dto.startDate = '2024-01-01T00:00:00Z';
    dto.endDate = '2024-01-31T23:59:59Z';
    dto.qualityFilter = [Quality.GOOD, Quality.DEGRADED];
    dto.skip = 0;
    dto.take = 100;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation with proper array inputs', async () => {
    const dto = new PointsQueryDto();
    dto.serieIds = [1, 2, 3];
    dto.qualityFilter = [Quality.GOOD, Quality.DEGRADED];

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with negative skip', async () => {
    const dto = new PointsQueryDto();
    dto.skip = -1;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation with zero take', async () => {
    const dto = new PointsQueryDto();
    dto.take = 0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation with invalid date', async () => {
    const dto = new PointsQueryDto();
    dto.startDate = 'invalid-date';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isDateString');
  });

  it('should pass validation with only start date', async () => {
    const dto = new PointsQueryDto();
    dto.startDate = '2024-01-01T00:00:00Z';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation with only end date', async () => {
    const dto = new PointsQueryDto();
    dto.endDate = '2024-01-31T23:59:59Z';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation with empty arrays', async () => {
    const dto = new PointsQueryDto();
    dto.serieIds = [];
    dto.qualityFilter = [];

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
