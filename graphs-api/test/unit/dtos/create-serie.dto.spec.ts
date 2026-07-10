import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { CreateSerieDto } from '@/series/dto/request/create-serie.dto';
import { FlowerType } from '@/common/enums/flower-type.enum';

describe('CreateSerieDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new CreateSerieDto();
    dto.type = FlowerType.ROSE;
    dto.description = 'A beautiful rose';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation with default empty description', async () => {
    const dto = new CreateSerieDto();
    dto.type = FlowerType.TULIP;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with description too long', async () => {
    const dto = new CreateSerieDto();
    dto.type = FlowerType.DAISY;
    dto.description = 'a'.repeat(257);

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  it('should fail validation with invalid type', async () => {
    const dto = new CreateSerieDto();
    (dto as any).type = 'INVALID_TYPE';
    dto.description = 'test';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should fail validation with missing type', async () => {
    const dto = new CreateSerieDto();
    dto.description = 'test';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should pass validation with missing description (optional field)', async () => {
    const dto = new CreateSerieDto();
    dto.type = FlowerType.LILY;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation with all flower types', async () => {
    const flowerTypes = Object.values(FlowerType);

    for (const type of flowerTypes) {
      const dto = new CreateSerieDto();
      dto.type = type;
      dto.description = `Test ${type}`;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });
});
