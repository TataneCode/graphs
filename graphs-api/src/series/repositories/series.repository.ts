import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Serie as PrismaSerie } from '@prisma/client';
import { SerieMapper } from '../mappers/serie.mapper';
import { CreateSerieDto } from '../dto/request/create-serie.dto';
import { UpdateSerieDto } from '../dto/request/update-serie.dto';
import { FlowerType } from '../../common/enums/flower-type.enum';

@Injectable()
export class SeriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PrismaSerie[]> {
    return this.prisma.serie.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: number): Promise<PrismaSerie | null> {
    return this.prisma.serie.findUnique({
      where: { id },
    });
  }

  async findByType(type: FlowerType): Promise<PrismaSerie | null> {
    return this.prisma.serie.findUnique({
      where: { type: type },
    });
  }

  async create(dto: CreateSerieDto): Promise<PrismaSerie> {
    return this.prisma.serie.create({
      data: SerieMapper.toCreateInput(dto),
    });
  }

  async update(id: number, dto: UpdateSerieDto): Promise<PrismaSerie | null> {
    return this.prisma.serie.update({
      where: { id },
      data: {
        ...(dto.type && { type: dto.type }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });
  }

  async delete(id: number): Promise<PrismaSerie | null> {
    return this.prisma.serie.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return this.prisma.serie.count();
  }

  async exists(id: number): Promise<boolean> {
    const result = await this.prisma.serie.count({
      where: { id },
    });
    return result > 0;
  }

  async findAllWithPoints(): Promise<(PrismaSerie & { points: unknown })[]> {
    return this.prisma.serie.findMany({
      include: { points: true },
      orderBy: { id: 'asc' },
    });
  }
}
