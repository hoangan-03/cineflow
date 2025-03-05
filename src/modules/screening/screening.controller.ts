import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ScreeningService } from './screening.service';
import { Screening } from '@/entities/screening.entity';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';

@ApiTags('screenings')
@Controller('screenings')
export class ScreeningController {
  constructor(private readonly screeningService: ScreeningService) {}

  @Get()
  @ApiOperation({ summary: 'Get all screenings' })
  @ApiResponse({ status: 200, description: 'Return all screenings', type: [Screening] })
  async findAll(
    @Query('movieId') movieId?: string,
    @Query('theaterId') theaterId?: string,
    @Query('date') date?: string
  ): Promise<Screening[]> {
    return this.screeningService.findAll(movieId, theaterId, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get screening by ID' })
  @ApiResponse({ status: 200, description: 'Return screening by ID', type: Screening })
  @ApiResponse({ status: 404, description: 'Screening not found' })
  async findOne(@Param('id') id: string): Promise<Screening> {
    return this.screeningService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new screening' })
  @ApiResponse({ status: 201, description: 'Screening created successfully', type: Screening })
  async create(@Body() createScreeningDto: CreateScreeningDto): Promise<Screening> {
    return this.screeningService.create(createScreeningDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a screening' })
  @ApiResponse({ status: 200, description: 'Screening updated successfully', type: Screening })
  @ApiResponse({ status: 404, description: 'Screening not found' })
  async update(
    @Param('id') id: string, 
    @Body() updateScreeningDto: UpdateScreeningDto
  ): Promise<Screening> {
    return this.screeningService.update(id, updateScreeningDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a screening' })
  @ApiResponse({ status: 200, description: 'Screening deleted successfully' })
  @ApiResponse({ status: 404, description: 'Screening not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.screeningService.remove(id);
  }
}