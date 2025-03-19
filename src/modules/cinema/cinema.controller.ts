import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  Logger,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { CinemaService } from "./cinema.service";
import { Cinema } from "@/entities/cinema.entity";
import { CreateCinemaDto } from "./dto/create-cinema.dto";
import { UpdateCinemaDto } from "./dto/update-cinema.dto";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Public } from "../auth/decorators/public.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "@/modules/auth/enums/role.enum";

@ApiTags("cinemas")
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller()
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  // PUBLIC
  @Public()
  @Get("cinemas")
  @ApiOperation({ summary: "Get all cinemas" })
  @ApiResponse({
    status: 200,
    description: "Return all cinemas",
    type: [Cinema],
  })
  async findAll(): Promise<Cinema[]> {
    return this.cinemaService.findAll();
  }
  // STAFF

  @Post("staff/cinemas")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new cinema" })
  @ApiResponse({
    status: 201,
    description: "Cinema created successfully",
    type: Cinema,
  })
  async create(@Body() createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    Logger.log("Creating a new cinema", createCinemaDto);
    return this.cinemaService.create(createCinemaDto);
  }

  @Public()
  @Get("cinemas/:id")
  @ApiOperation({ summary: "Get cinema by ID" })
  @ApiResponse({
    status: 200,
    description: "Return cinema by ID",
    type: Cinema,
  })
  @ApiResponse({ status: 404, description: "Cinema not found" })
  async findOne(@Param("id") id: string): Promise<Cinema> {
    return this.cinemaService.findOne(id);
  }

  @Public()
  @Get("cinemas/:id/rooms")
  @ApiOperation({ summary: "Get all rooms in a cinema" })
  @ApiResponse({ status: 200, description: "Return all rooms in a cinema" })
  @ApiResponse({ status: 404, description: "Cinema not found" })
  async findRooms(@Param("id") id: string) {
    return this.cinemaService.findRooms(id);
  }

  @Public()
  @Get("cinemas/:id/screenings")
  @ApiOperation({ summary: "Get all screenings in a cinema" })
  @ApiResponse({
    status: 200,
    description: "Return all screenings in a cinema",
  })
  @ApiResponse({ status: 404, description: "Cinema not found" })
  async findScreenings(@Param("id") id: string) {
    return this.cinemaService.findScreenings(id);
  }

  // MOVIEGOER AND STAFF

  @Get("user/cinemas/:id/screenings/upcoming")
  @Roles(Role.MOVIEGOER, Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get upcoming screenings at a cinema" })
  @ApiResponse({ status: 200, description: "Return upcoming screenings" })
  @ApiResponse({ status: 404, description: "Cinema not found" })
  async findUpcomingScreenings(@Param("id") id: string) {
    return this.cinemaService.findUpcomingScreenings(id);
  }

  // STAFF

  @Put("staff/cinemas/:id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a cinema" })
  @ApiResponse({
    status: 200,
    description: "Cinema updated successfully",
    type: Cinema,
  })
  @ApiResponse({ status: 404, description: "Cinema not found" })
  async update(
    @Param("id") id: string,
    @Body() updateCinemaDto: UpdateCinemaDto
  ): Promise<Cinema> {
    return this.cinemaService.update(id, updateCinemaDto);
  }

  @Delete("staff/cinemas/:id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a cinema" })
  @ApiResponse({ status: 200, description: "Cinema deleted successfully" })
  @ApiResponse({ status: 404, description: "Cinema not found" })
  async remove(@Param("id") id: string): Promise<void> {
    return this.cinemaService.remove(id);
  }

  @Get("staff/cinemas/:id/stats")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get statistics for a specific cinema" })
  @ApiResponse({ status: 200, description: "Return cinema statistics" })
  @ApiResponse({ status: 404, description: "Cinema not found" })
  async getStatistics(@Param("id") id: string) {
    return this.cinemaService.getStatistics(id);
  }

  @Get("staff/cinemas/stats/overview")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get overview statistics for all cinemas" })
  @ApiResponse({ status: 200, description: "Return overview statistics" })
  async getAllStatistics() {
    return this.cinemaService.getAllStatistics();
  }
}
