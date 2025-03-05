import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CinemaService } from './cinema.service';
import { Cinema } from '@/entities/cinema.entity';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@ApiTags('cinemas')
@Controller('cinemas')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cinemas' })
  @ApiResponse({ status: 200, description: 'Return all cinemas', type: [Cinema] })
  async findAll(): Promise<Cinema[]> {
    return this.cinemaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cinema by ID' })
  @ApiResponse({ status: 200, description: 'Return cinema by ID', type: Cinema })
  @ApiResponse({ status: 404, description: 'Cinema not found' })
  async findOne(@Param('id') id: string): Promise<Cinema> {
    return this.cinemaService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new cinema' })
  @ApiResponse({ status: 201, description: 'Cinema created successfully', type: Cinema })
  async create(@Body() createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    return this.cinemaService.create(createCinemaDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a cinema' })
  @ApiResponse({ status: 200, description: 'Cinema updated successfully', type: Cinema })
  @ApiResponse({ status: 404, description: 'Cinema not found' })
  async update(
    @Param('id') id: string, 
    @Body() updateCinemaDto: UpdateCinemaDto
  ): Promise<Cinema> {
    return this.cinemaService.update(id, updateCinemaDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a cinema' })
  @ApiResponse({ status: 200, description: 'Cinema deleted successfully' })
  @ApiResponse({ status: 404, description: 'Cinema not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.cinemaService.remove(id);
  }

  @Get(':id/theaters')
  @ApiOperation({ summary: 'Get all theaters in a cinema' })
  @ApiResponse({ status: 200, description: 'Return all theaters in a cinema' })
  @ApiResponse({ status: 404, description: 'Cinema not found' })
  async findTheaters(@Param('id') id: string) {
    return this.cinemaService.findTheaters(id);
  }
}