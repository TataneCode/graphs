import { FlowerType } from '@prisma/client';
import { PointResponseDto } from '@/points/dto/response/point-response.dto';

export { FlowerType };

export class SerieResponseDto {
  id: number;
  type: FlowerType;
  description: string;
  createdAt: string;
  updatedAt: string;
  points?: PointResponseDto[];

  constructor(data: Partial<SerieResponseDto>) {
    Object.assign(this, data);
  }
}
