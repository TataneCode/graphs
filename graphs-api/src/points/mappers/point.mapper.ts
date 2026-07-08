import { Point as PrismaPoint, Quality } from '@prisma/client';
import { PointResponseDto } from '../dto/response/point-response.dto';
import { CreatePointDto } from '../dto/request/create-point.dto';

export class PointMapper {
  static toResponseDto(point: PrismaPoint): PointResponseDto {
    return new PointResponseDto({
      id: point.id,
      serieId: point.serieId,
      creationDate: point.creationDate.toISOString(),
      value: Number(point.value),
      quality: point.quality as Quality,
    });
  }

  static toResponseDtos(points: PrismaPoint[]): PointResponseDto[] {
    return points.map((point) => this.toResponseDto(point));
  }

  static toCreateInput(dto: CreatePointDto): Omit<PrismaPoint, 'id'> {
    return {
      serieId: dto.serieId,
      creationDate: new Date(dto.creationDate),
      value: dto.value as unknown as PrismaPoint['value'],
      quality: dto.quality,
    };
  }
}
