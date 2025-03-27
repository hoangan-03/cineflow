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
  BadRequestException,
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
  @ApiOperation({ summary: "Get all movies - Public" })
  @ApiResponse({ status: 200, description: "Return all movies", type: [Movie] })
  async getAllMovie(): Promise<Movie[]> {
    return this.movieService.findAll();
  }

  @Public()
  @Get("movies/genres")
  @ApiOperation({ summary: "Get all available genres - Public" })
  @ApiResponse({ status: 200, description: "Return all genres", type: [Genre] })
  async getAllGenres(): Promise<Genre[]> {
    return this.movieService.findAllGenres();
  }

  @Public()
  @Get("movies/by-genre")
  @ApiOperation({ summary: "Get all movies filtered by genre = Public" })
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
  @ApiOperation({ summary: "Get movie by ID - Public" })
  @ApiResponse({ status: 200, description: "Return movie by ID", type: Movie })
  @ApiResponse({ status: 404, description: "Movie not found" })
  async findOne(@Param("id") id: number): Promise<Movie> {
    return this.movieService.findOne(id);
  }

  @Public()
  @Get("movies/:id/cinemas")
  @ApiOperation({
    summary: "Find cinemas showing a specific movie on a given date - Public",
  })
  @ApiResponse({
    status: 200,
    description: "Return cinemas showing the specified movie",
    type: [Movie],
  })
  @ApiResponse({ status: 404, description: "Movie not found" })
  @ApiResponse({ status: 400, description: "Invalid date format" })
  @ApiQuery({
    name: "date",
    required: true,
    description: "Date in YYYY-MM-DD format",
  })
  async findCinemasShowingMovie(
    @Param("id") id: number,
    @Query("date") date: string
  ): Promise<any[]> {
    if (!date) {
      throw new BadRequestException("Date parameter is required");
    }
    return this.movieService.findCinemasShowingMovie(id, date);
  }

  @Public()
  @Get("movies/now-playing/list")
  @ApiOperation({ summary: "Get currently showing movies - Public" })
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
  @ApiOperation({ summary: "Get upcoming movies - Public" })
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
  @ApiOperation({
    summary: "Get personalized movie recommendations - Role: Moviegoer",
  })
  @ApiResponse({
    status: 200,
    description: "Return recommended movies",
    type: [Movie],
  })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async getRecommendations(@AuthUser() user: User): Promise<Movie[]> {
    return this.movieService.getRecommendations(user.id);
  }

  // STAFF ROUTES

  @Post("staff/movies")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new movie - Role: Staff" })
  @ApiResponse({
    status: 201,
    description: "Movie created successfully",
    type: Movie,
  })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovieDto);
  }

  @Put("staff/movies/:id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a movie - Role: Staff" })
  @ApiResponse({
    status: 200,
    description: "Movie updated successfully",
    type: Movie,
  })
  @ApiResponse({ status: 404, description: "Movie not found - Role: Staff" })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async update(
    @Param("id") id: number,
    @Body() updateMovieDto: UpdateMovieDto
  ): Promise<Movie> {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete("staff/movies/:id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a movie - Role: Staff" })
  @ApiResponse({ status: 200, description: "Movie deleted successfully" })
  @ApiResponse({ status: 404, description: "Movie not found" })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async remove(@Param("id") id: number): Promise<void> {
    return this.movieService.remove(id);
  }
}
