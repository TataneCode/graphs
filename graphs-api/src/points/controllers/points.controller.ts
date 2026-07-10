import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PointsRepository } from '@/points/repositories/points.repository';
import { PointMapper } from '@/points/mappers/point.mapper';
import { CreatePointDto } from '@/points/dto/request/create-point.dto';
import { UpdatePointDto } from '@/points/dto/request/update-point.dto';
import { PointsQueryDto } from '@/points/dto/request/points-query.dto';
import { PointResponseDto } from '@/points/dto/response/point-response.dto';

@ApiTags('Points')
@Controller('points')
export class PointsController {
  constructor(private readonly pointsRepository: PointsRepository) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all points with optional filters' })
  @ApiQuery({ type: PointsQueryDto })
  @ApiResponse({ status: 200, description: 'List of points', type: [PointResponseDto] })
  async findAll(@Query() query?: PointsQueryDto): Promise<PointResponseDto[]> {
    const points = await this.pointsRepository.findAll(query);
    return PointMapper.toResponseDtos(points);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get one point by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Point ID' })
  @ApiResponse({ status: 200, description: 'Point details', type: PointResponseDto })
  @ApiResponse({ status: 404, description: 'Point not found' })
  async findById(@Param('id') id: number): Promise<PointResponseDto> {
    const point = await this.pointsRepository.findById(id);
    if (!point) {
      throw new Error('Point not found');
    }
    return PointMapper.toResponseDto(point);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new point' })
  @ApiBody({ type: CreatePointDto })
  @ApiResponse({ status: 201, description: 'Point created', type: PointResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() dto: CreatePointDto): Promise<PointResponseDto> {
    const point = await this.pointsRepository.create(dto);
    return PointMapper.toResponseDto(point);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a point' })
  @ApiParam({ name: 'id', type: Number, description: 'Point ID' })
  @ApiBody({ type: UpdatePointDto })
  @ApiResponse({ status: 200, description: 'Point updated', type: PointResponseDto })
  @ApiResponse({ status: 404, description: 'Point not found' })
  async update(@Param('id') id: number, @Body() dto: UpdatePointDto): Promise<PointResponseDto> {
    const point = await this.pointsRepository.update(id, dto);
    if (!point) {
      throw new Error('Point not found');
    }
    return PointMapper.toResponseDto(point);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a point' })
  @ApiParam({ name: 'id', type: Number, description: 'Point ID' })
  @ApiResponse({ status: 204, description: 'Point deleted' })
  @ApiResponse({ status: 404, description: 'Point not found' })
  async delete(@Param('id') id: number): Promise<void> {
    const point = await this.pointsRepository.findById(id);
    if (!point) {
      throw new Error('Point not found');
    }
    await this.pointsRepository.delete(id);
  }
}
