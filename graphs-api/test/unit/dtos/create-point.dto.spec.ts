import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { CreatePointDto } from '../../../src/points/dto/request/create-point.dto';
import { Quality } from '../../../src/common/enums/quality.enum';

describe('CreatePointDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new CreatePointDto();
    dto.serieId = 1;
    dto.creationDate = '2024-01-15T10:30:00Z';
    dto.value = 100.5;
    dto.quality = Quality.GOOD;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation with boundary values', async () => {
    const dto = new CreatePointDto();
    dto.serieId = 1;
    dto.creationDate = '2024-01-15T10:30:00Z';
    dto.value = -65535;
    dto.quality = Quality.DEGRADED;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation with max boundary values', async () => {
    const dto = new CreatePointDto();
    dto.serieId = 1;
    dto.creationDate = '2024-01-15T10:30:00Z';
    dto.value = 65535;
    dto.quality = Quality.ERROR;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with value below minimum', async () => {
    const dto = new CreatePointDto();
    dto.serieId = 1;
    dto.creationDate = '2024-01-15T10:30:00Z';
    dto.value = -65536;
    dto.quality = Quality.GOOD;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should fail validation with value above maximum', async () => {
    const dto = new CreatePointDto();
    dto.serieId = 1;
    dto.creationDate = '2024-01-15T10:30:00Z';
    dto.value = 65536;
    dto.quality = Quality.GOOD;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('max');
  });

  it('should fail validation with invalid date', async () => {
    const dto = new CreatePointDto();
    dto.serieId = 1;
    dto.creationDate = 'invalid-date';
    dto.value = 100;
    dto.quality = Quality.GOOD;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isDateString');
  });

  it('should fail validation with invalid quality', async () => {
    const dto = new CreatePointDto();
    dto.serieId = 1;
    dto.creationDate = '2024-01-15T10:30:00Z';
    dto.value = 100;
    (dto as any).quality = 'INVALID_QUALITY';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should pass validation with all quality types', async () => {
    const qualities = Object.values(Quality);

    for (const quality of qualities) {
      const dto = new CreatePointDto();
      dto.serieId = 1;
      dto.creationDate = '2024-01-15T10:30:00Z';
      dto.value = 100;
      dto.quality = quality;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });
});
