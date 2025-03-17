import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MovieService } from './movie.service';
import { Movie } from '@/entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@/modules/auth/enums/role.enum';
import { Public } from '@/modules/auth/decorators/public.decorator';

@ApiTags('movies')
@Controller('movies')
@UseGuards(JWTAuthGuard, RolesGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  
  // PUBLIC
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'Return all movies', type: [Movie] })
  async findAll(@Query('genre') genre?: string): Promise<Movie[]> {
    return this.movieService.findAll(genre);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID' })
  @ApiResponse({ status: 200, description: 'Return movie by ID', type: Movie })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async findOne(@Param('id') id: string): Promise<Movie> {
    return this.movieService.findOne(id);
  }

  // STAFF
  @Post()
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new movie (staff only)' })
  @ApiResponse({ status: 201, description: 'Movie created successfully', type: Movie })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovieDto);
  }

  @Put(':id')
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a movie (staff only)' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully', type: Movie })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto): Promise<Movie> {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a movie (staff only)' })
  @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.movieService.remove(id);
  }

  // MOVIEGOER
  @Get('recommendations')
  @Roles(Role.MOVIEGOER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personalized movie recommendations' })
  @ApiResponse({ status: 200, description: 'Return recommended movies', type: [Movie] })
  async getRecommendations(): Promise<Movie[]> {
    return this.movieService.getRecommendations();
  }
}