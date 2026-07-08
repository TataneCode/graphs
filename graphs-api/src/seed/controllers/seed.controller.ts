import {
  Controller,
  Post,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SeedService } from '../services/seed.service';
import { SeedDto } from '../dto/request/seed.dto';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Seed database with sample data' })
  @ApiBody({ type: SeedDto })
  @ApiResponse({ status: 201, description: 'Database seeded successfully' })
  async seed(@Body() dto: SeedDto): Promise<{ message: string; seriesCreated: number; pointsCreated: number }> {
    const result = await this.seedService.seed(dto);
    return {
      message: 'Database seeded successfully',
      ...result,
    };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear all points from database' })
  @ApiResponse({ status: 200, description: 'All points cleared' })
  async clearAll(): Promise<{ message: string; pointsDeleted: number }> {
    const result = await this.seedService.clearAll();
    return {
      message: 'All points cleared successfully',
      ...result,
    };
  }
}
