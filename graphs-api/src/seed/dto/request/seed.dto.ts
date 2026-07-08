import { IsNumber, IsOptional, Min } from 'class-validator';

export class SeedDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  count?: number = 1000000;

  @IsOptional()
  @IsNumber()
  @Min(1)
  months?: number = 1;
}
