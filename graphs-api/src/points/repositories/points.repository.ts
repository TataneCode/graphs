import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Point as PrismaPoint } from '@prisma/client';
import { CreatePointDto } from '@/points/dto/request/create-point.dto';
import { UpdatePointDto } from '@/points/dto/request/update-point.dto';
import { PointsQueryDto } from '@/points/dto/request/points-query.dto';

@Injectable()
export class PointsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: PointsQueryDto): Promise<PrismaPoint[]> {
    const where: Prisma.PointWhereInput = {};

    if (query?.serieIds && query.serieIds.length > 0) {
      where.serieId = { in: query.serieIds };
    }

    if (query?.startDate || query?.endDate) {
      where.creationDate = {
        gte: query?.startDate ? new Date(query.startDate) : undefined,
        lte: query?.endDate ? new Date(query.endDate) : undefined,
      };
    }

    if (query?.qualityFilter && query.qualityFilter.length > 0) {
      where.quality = { in: query.qualityFilter };
    }

    return this.prisma.point.findMany({
      where,
      orderBy: { creationDate: 'asc' },
      skip: query?.skip ?? 0,
      take: query?.take ?? 100,
    });
  }

  async findById(id: number): Promise<PrismaPoint | null> {
    return this.prisma.point.findUnique({
      where: { id },
    });
  }

  async findBySerieId(serieId: number): Promise<PrismaPoint[]> {
    return this.prisma.point.findMany({
      where: { serieId },
      orderBy: { creationDate: 'asc' },
    });
  }

  async create(dto: CreatePointDto): Promise<PrismaPoint> {
    return this.prisma.point.create({
      data: {
        serieId: dto.serieId,
        creationDate: new Date(dto.creationDate),
        value: dto.value,
        quality: dto.quality,
      },
    });
  }

  async createMany(points: Omit<PrismaPoint, 'id'>[]): Promise<Prisma.BatchPayload> {
    return this.prisma.point.createMany({
      data: points.map((point) => ({
        serieId: point.serieId,
        creationDate: point.creationDate,
        value: point.value,
        quality: point.quality,
      })),
      skipDuplicates: true,
    });
  }

  async update(id: number, dto: UpdatePointDto): Promise<PrismaPoint | null> {
    const updateData: Prisma.PointUpdateInput = {};

    if (dto.serieId !== undefined) {
      updateData.serie = { connect: { id: dto.serieId } };
    }
    if (dto.creationDate !== undefined) {
      updateData.creationDate = new Date(dto.creationDate);
    }
    if (dto.value !== undefined) {
      updateData.value = dto.value;
    }
    if (dto.quality !== undefined) {
      updateData.quality = dto.quality;
    }

    return this.prisma.point.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: number): Promise<PrismaPoint | null> {
    return this.prisma.point.delete({
      where: { id },
    });
  }

  async count(serieId?: number): Promise<number> {
    const where: Prisma.PointWhereInput = serieId ? { serieId } : {};
    return this.prisma.point.count({ where });
  }

  async deleteManyBySerieId(serieId: number): Promise<Prisma.BatchPayload> {
    return this.prisma.point.deleteMany({
      where: { serieId },
    });
  }

  async deleteAll(): Promise<Prisma.BatchPayload> {
    return this.prisma.point.deleteMany({});
  }

  async getDateRange(): Promise<{ min?: string; max?: string }> {
    const result = await this.prisma.point.aggregate({
      _min: { creationDate: true },
      _max: { creationDate: true },
    });

    return {
      min: result._min.creationDate?.toISOString(),
      max: result._max.creationDate?.toISOString(),
    };
  }
}
