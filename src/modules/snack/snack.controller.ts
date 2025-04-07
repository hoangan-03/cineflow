import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { SnackService } from "./snack.service";
import { JWTAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import { AuthUser } from "../user/decorators/user.decorator";
import { Snack } from "@/entities/snack.entity";
import { CreateSnackDto } from "./dto/create-snack.dto";
import { UpdateSnackDto } from "./dto/update-snack.dto";

@ApiTags("snacks")
@ApiBearerAuth()
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("snacks")
export class SnackController {
  constructor(private readonly snackService: SnackService) {}

  // STAFF routes
  @Get("admin")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Get all snacks - Role: Staff" })
  @ApiResponse({ status: 200, description: "Return all snacks", type: [Snack] })
  async findAll(): Promise<Snack[]> {
    return this.snackService.findAll();
  }

  @Get("admin/:id")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Get snack by ID - Role: Staff" })
  @ApiResponse({ status: 200, description: "Return snack by ID", type: Snack })
  @ApiResponse({ status: 404, description: "Snack not found" })
  async findOne(@Param("id") id: number): Promise<Snack> {
    return this.snackService.findOne(id);
  }

  // USER routes
  @Get("user")
  @Roles(Role.MOVIEGOER)
  @ApiOperation({ summary: "Get all snacks for current user - Role: Moviegoer" })
  @ApiResponse({ status: 200, description: "Return user's snacks", type: [Snack] })
  async findAllByUser(@AuthUser("id") userId: number): Promise<Snack[]> {
    return this.snackService.findAllByUser(userId);
  }

  @Post()
  @Roles(Role.MOVIEGOER, Role.STAFF)
  @ApiOperation({ summary: "Create a new snack - Role: Moviegoer/Staff" })
  @ApiResponse({ status: 201, description: "Snack created successfully", type: Snack })
  async create(
    @AuthUser("id") userId: number,
    @Body() createSnackDto: CreateSnackDto
  ): Promise<Snack> {
    return this.snackService.create(createSnackDto, userId);
  }

  @Put(":id")
  @Roles(Role.MOVIEGOER)
  @ApiOperation({ summary: "Update a snack - Role: Moviegoer" })
  @ApiResponse({ status: 200, description: "Snack updated successfully", type: Snack })
  @ApiResponse({ status: 404, description: "Snack not found" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async update(
    @Param("id") id: number,
    @Body() updateSnackDto: UpdateSnackDto,
    @AuthUser("id") userId: number
  ): Promise<Snack> {
    return this.snackService.update(id, updateSnackDto, userId);
  }

  @Delete(":id")
  @Roles(Role.MOVIEGOER)
  @ApiOperation({ summary: "Delete a snack - Role: Moviegoer" })
  @ApiResponse({ status: 200, description: "Snack deleted successfully" })
  @ApiResponse({ status: 404, description: "Snack not found" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async remove(
    @Param("id") id: number,
    @AuthUser("id") userId: number
  ): Promise<void> {
    return this.snackService.remove(id, userId);
  }
}