import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { SeriesRepository } from '../repositories/series.repository';
import { SerieMapper } from '../mappers/serie.mapper';
import { CreateSerieDto } from '../dto/request/create-serie.dto';
import { UpdateSerieDto } from '../dto/request/update-serie.dto';
import { SerieResponseDto } from '../dto/response/serie-response.dto';

@ApiTags('Series')
@Controller('series')
export class SeriesController {
  constructor(private readonly seriesRepository: SeriesRepository) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all series' })
  @ApiResponse({ status: 200, description: 'List of all series', type: [SerieResponseDto] })
  async findAll(): Promise<SerieResponseDto[]> {
    const series = await this.seriesRepository.findAll();
    return SerieMapper.toResponseDtos(series);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get one serie by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Serie ID' })
  @ApiResponse({ status: 200, description: 'Serie details', type: SerieResponseDto })
  @ApiResponse({ status: 404, description: 'Serie not found' })
  async findById(@Param('id') id: number): Promise<SerieResponseDto> {
    const serie = await this.seriesRepository.findById(id);
    if (!serie) {
      throw new Error('Serie not found');
    }
    return SerieMapper.toResponseDto(serie);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new serie' })
  @ApiBody({ type: CreateSerieDto })
  @ApiResponse({ status: 201, description: 'Serie created', type: SerieResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() dto: CreateSerieDto): Promise<SerieResponseDto> {
    const serie = await this.seriesRepository.create(dto);
    return SerieMapper.toResponseDto(serie);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a serie' })
  @ApiParam({ name: 'id', type: Number, description: 'Serie ID' })
  @ApiBody({ type: UpdateSerieDto })
  @ApiResponse({ status: 200, description: 'Serie updated', type: SerieResponseDto })
  @ApiResponse({ status: 404, description: 'Serie not found' })
  async update(@Param('id') id: number, @Body() dto: UpdateSerieDto): Promise<SerieResponseDto> {
    const serie = await this.seriesRepository.update(id, dto);
    if (!serie) {
      throw new Error('Serie not found');
    }
    return SerieMapper.toResponseDto(serie);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a serie' })
  @ApiParam({ name: 'id', type: Number, description: 'Serie ID' })
  @ApiResponse({ status: 204, description: 'Serie deleted' })
  @ApiResponse({ status: 404, description: 'Serie not found' })
  async delete(@Param('id') id: number): Promise<void> {
    const serie = await this.seriesRepository.findById(id);
    if (!serie) {
      throw new Error('Serie not found');
    }
    await this.seriesRepository.delete(id);
  }
}
