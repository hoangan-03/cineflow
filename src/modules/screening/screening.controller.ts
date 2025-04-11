import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
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
import { ScreeningService } from "./screening.service";
import { Screening } from "@/entities/screening.entity";
import { CreateScreeningDto } from "./dto/create-screening.dto";
import { UpdateScreeningDto } from "./dto/update-screening.dto";
import { Role } from "../auth/enums/role.enum";
import { Roles } from "../auth/decorators/roles.decorator";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("screenings")
@ApiBearerAuth()
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("screenings")
export class ScreeningController {
  constructor(private readonly screeningService: ScreeningService) {}

  @Get()
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Get all screenings - Role: Staff" })
  @ApiResponse({
    status: 200,
    description: "Return all screenings",
    type: [Screening],
  })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiQuery({
    name: "date",
    required: false,
    description: "Filter by date (format: YYYY-MM-DD)",
  })
  async findAll(
    @Query("movieId") movieId?: number,
    @Query("roomId") roomId?: string,
    @Query("date") date?: string
  ): Promise<Screening[]> {
    return this.screeningService.findAll(movieId, roomId, date);
  }

  @Post()
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Create a new screening - Role: Staff" })
  @ApiResponse({
    status: 201,
    description: "Screening created successfully",
    type: Screening,
  })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async create(
    @Body() createScreeningDto: CreateScreeningDto
  ): Promise<Screening> {
    return this.screeningService.create(createScreeningDto);
  }

  @Get(":id")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Get screening by ID - Role: Staff" })
  @ApiResponse({
    status: 200,
    description: "Return screening by ID",
    type: Screening,
  })
  @ApiResponse({ status: 404, description: "Screening not found" })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async findOne(@Param("id") id: number): Promise<Screening> {
    return this.screeningService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Update a screening - Role: Staff" })
  @ApiResponse({
    status: 200,
    description: "Screening updated successfully",
    type: Screening,
  })
  @ApiResponse({ status: 404, description: "Screening not found" })
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
    @Body() updateScreeningDto: UpdateScreeningDto
  ): Promise<Screening> {
    return this.screeningService.update(
      id,
      updateScreeningDto
    ) as Promise<Screening>;
  }

  @Delete(":id")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Delete a screening - Role: Staff" })
  @ApiResponse({ status: 200, description: "Screening deleted successfully" })
  @ApiResponse({ status: 404, description: "Screening not found" })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async remove(@Param("id") id: number): Promise<void> {
    return this.screeningService.remove(id);
  }

  @Get("cinema/:cinemaId")
  @Roles(Role.STAFF)
  @ApiOperation({
    summary: "Get all screenings for a cinema - Role: Staff",
  })
  @ApiResponse({
    status: 200,
    description: "Return all screenings for a cinema",
    type: [Screening],
  })
  @ApiResponse({ status: 404, description: "Cinema not found" })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  @ApiQuery({
    name: "date",
    required: false,
    description: "Filter by date (format: YYYY-MM-DD)",
  })
  async findByCinema(
    @Param("cinemaId") cinemaId: number,
    @Query("date") date?: string
  ): Promise<Screening[]> {
    return this.screeningService.findByCinema(cinemaId, date);
  }
}
