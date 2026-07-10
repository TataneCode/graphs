import { IsDateString, IsEnum, IsNumber, Max, Min } from 'class-validator';
import { Quality } from '@/common/enums/quality.enum';

export class CreatePointDto {
  @IsNumber({}, { message: 'serieId must be a number' })
  serieId: number;

  @IsDateString({}, { message: 'creationDate must be a valid ISO date string' })
  creationDate: string;

  @IsNumber({}, { message: 'value must be a number' })
  @Min(-65535, { message: 'value must be greater than or equal to -65535' })
  @Max(65535, { message: 'value must be less than or equal to 65535' })
  value: number;

  @IsEnum(Quality)
  quality: Quality;
}
