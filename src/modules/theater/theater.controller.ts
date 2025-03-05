import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TheaterService } from './theater.service';
import { Theater } from '@/entities/theater.entity';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';

@ApiTags('theaters')
@Controller('theaters')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @Get()
  @ApiOperation({ summary: 'Get all theaters' })
  @ApiResponse({ status: 200, description: 'Return all theaters', type: [Theater] })
  async findAll(): Promise<Theater[]> {
    return this.theaterService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get theater by ID' })
  @ApiResponse({ status: 200, description: 'Return theater by ID', type: Theater })
  @ApiResponse({ status: 404, description: 'Theater not found' })
  async findOne(@Param('id') id: string): Promise<Theater> {
    return this.theaterService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new theater' })
  @ApiResponse({ status: 201, description: 'Theater created successfully', type: Theater })
  async create(@Body() createTheaterDto: CreateTheaterDto): Promise<Theater> {
    return this.theaterService.create(createTheaterDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a theater' })
  @ApiResponse({ status: 200, description: 'Theater updated successfully', type: Theater })
  @ApiResponse({ status: 404, description: 'Theater not found' })
  async update(
    @Param('id') id: string, 
    @Body() updateTheaterDto: UpdateTheaterDto
  ): Promise<Theater> {
    return this.theaterService.update(id, updateTheaterDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a theater' })
  @ApiResponse({ status: 200, description: 'Theater deleted successfully' })
  @ApiResponse({ status: 404, description: 'Theater not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.theaterService.remove(id);
  }

  @Get(':id/seats')
  @ApiOperation({ summary: 'Get all seats in a theater' })
  @ApiResponse({ status: 200, description: 'Return all seats in a theater' })
  @ApiResponse({ status: 404, description: 'Theater not found' })
  async findSeats(@Param('id') id: string) {
    return this.theaterService.findSeats(id);
  }
}