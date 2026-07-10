import { PartialType } from '@nestjs/swagger';
import { CreateSerieDto } from '@/series/dto/request/create-serie.dto';

export class UpdateSerieDto extends PartialType(CreateSerieDto) {
  id: number;
}
