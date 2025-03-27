import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ScreeningService } from "./screening.service";
import { Screening } from "@/entities/screening.entity";
import { CreateScreeningDto } from "./dto/create-screening.dto";
import { UpdateScreeningDto } from "./dto/update-screening.dto";
import { Role } from "../auth/enums/role.enum";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("screenings")
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
  async findAll(
    @Query("movieId") movieId?: string,
    @Query("theaterId") theaterId?: string,
    @Query("date") date?: string
  ): Promise<Screening[]> {
    return this.screeningService.findAll(movieId, theaterId, date);
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

  @Post()
  @Roles(Role.STAFF)
  @ApiBearerAuth()
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

  @Put(":id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
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
    return this.screeningService.update(id, updateScreeningDto);
  }

  @Delete(":id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
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
}
