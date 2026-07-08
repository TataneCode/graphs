import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsNumber, IsOptional, Min } from 'class-validator';
import { Quality } from '@prisma/client';

export class PointsQueryDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((v: string) => Number(v));
    }
    return value;
  })
  serieIds?: number[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',') as Quality[];
    }
    return value as Quality[];
  })
  qualityFilter?: Quality[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  skip?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  take?: number = 100;
}
