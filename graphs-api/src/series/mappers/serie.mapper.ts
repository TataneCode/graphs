import { Serie as PrismaSerie, Point as PrismaPoint } from '@prisma/client';
import { SerieResponseDto } from '@/series/dto/response/serie-response.dto';
import { CreateSerieDto } from '@/series/dto/request/create-serie.dto';
import { PointMapper } from '@/points/mappers/point.mapper';

export class SerieMapper {
  static toResponseDto(serie: PrismaSerie & { points?: unknown }): SerieResponseDto {
    const dto = new SerieResponseDto({
      id: serie.id,
      type: serie.type,
      description: serie.description,
      createdAt: serie.createdAt.toISOString(),
      updatedAt: serie.updatedAt.toISOString(),
    });

    if (serie.points && Array.isArray(serie.points)) {
      dto.points = serie.points.map((point: unknown) =>
        PointMapper.toResponseDto(point as PrismaPoint)
      );
    }

    return dto;
  }

  static toResponseDtos(series: (PrismaSerie & { points?: unknown })[]): SerieResponseDto[] {
    return series.map((serie) => this.toResponseDto(serie));
  }

  static toCreateInput(dto: CreateSerieDto): Omit<PrismaSerie, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      type: dto.type,
      description: dto.description,
    };
  }
}
