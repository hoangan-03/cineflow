import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { MovieService } from "./movie.service";
import { Movie } from "@/entities/movie.entity";
import { Genre } from "@/entities/genre.entity";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { JWTAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/modules/auth/guards/roles.guard";
import { Roles } from "@/modules/auth/decorators/roles.decorator";
import { Role } from "@/modules/auth/enums/role.enum";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { AuthUser } from "@/modules/user/decorators/user.decorator";
import { User } from "@/entities/user.entity";

@ApiTags("movies")
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // PUBLIC ROUTES

  @Public()
  @Get("movies")
  @ApiOperation({ summary: "Get all movies" })
  @ApiResponse({ status: 200, description: "Return all movies", type: [Movie] })
  async getAllMovie(): Promise<Movie[]> {
    return this.movieService.findAll();
  }

  @Public()
  @Get("movies/genres")
  @ApiOperation({ summary: "Get all available genres" })
  @ApiResponse({ status: 200, description: "Return all genres", type: [Genre] })
  async getAllGenres(): Promise<Genre[]> {
    return this.movieService.findAllGenres();
  }

  @Public()
  @Get("movies/by-genre")
  @ApiOperation({ summary: "Get all movies filtered by genre" })
  @ApiResponse({
    status: 200,
    description: "Return filtered movies by genre name",
    type: [Movie],
  })
  @ApiQuery({
    name: "genreName",
    required: false,
    description: "Filter by genre name",
  })
  async getAllMovieByGenre(
    @Query("genreName") genreName?: string
  ): Promise<Movie[]> {
    return this.movieService.findAllByGenre(genreName);
  }

  @Public()
  @Get("movies/:id")
  @ApiOperation({ summary: "Get movie by ID" })
  @ApiResponse({ status: 200, description: "Return movie by ID", type: Movie })
  @ApiResponse({ status: 404, description: "Movie not found" })
  async findOne(@Param("id") id: string): Promise<Movie> {
    return this.movieService.findOne(id);
  }

  @Public()
  @Get("movies/now-playing/list")
  @ApiOperation({ summary: "Get currently showing movies" })
  @ApiResponse({
    status: 200,
    description: "Return currently showing movies",
    type: [Movie],
  })
  async getNowPlaying(): Promise<Movie[]> {
    return this.movieService.getNowPlaying();
  }

  @Public()
  @Get("movies/coming-soon/list")
  @ApiOperation({ summary: "Get upcoming movies" })
  @ApiResponse({
    status: 200,
    description: "Return upcoming movies",
    type: [Movie],
  })
  async getComingSoon(): Promise<Movie[]> {
    return this.movieService.getComingSoon();
  }

  // USER ROUTES
  @Get("user/movies/recommendations")
  @Roles(Role.MOVIEGOER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get personalized movie recommendations" })
  @ApiResponse({
    status: 200,
    description: "Return recommended movies",
    type: [Movie],
  })
  async getRecommendations(@AuthUser() user: User): Promise<Movie[]> {
    return this.movieService.getRecommendations(user.id);
  }

  // STAFF ROUTES

  @Post("staff/movies")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new movie" })
  @ApiResponse({
    status: 201,
    description: "Movie created successfully",
    type: Movie,
  })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovieDto);
  }

  @Put("staff/movies/:id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a movie' })
  @ApiResponse({
    status: 200,
    description: "Movie updated successfully",
    type: Movie,
  })
  @ApiResponse({ status: 404, description: "Movie not found" })
  async update(
    @Param("id") id: string,
    @Body() updateMovieDto: UpdateMovieDto
  ): Promise<Movie> {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete("staff/movies/:id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a movie' })
  @ApiResponse({ status: 200, description: "Movie deleted successfully" })
  @ApiResponse({ status: 404, description: "Movie not found" })
  async remove(@Param("id") id: string): Promise<void> {
    return this.movieService.remove(id);
  }
}
