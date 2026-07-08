import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { FlowerType } from '../../../common/enums/flower-type.enum';

export class CreateSerieDto {
  @IsEnum(FlowerType)
  type: FlowerType;

  @IsString()
  @IsOptional()
  @MinLength(0)
  @MaxLength(256)
  description: string = '';
}
