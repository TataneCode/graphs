import { PartialType } from '@nestjs/swagger';
import { CreatePointDto } from '@/points/dto/request/create-point.dto';

export class UpdatePointDto extends PartialType(CreatePointDto) {
  id: number;
}
