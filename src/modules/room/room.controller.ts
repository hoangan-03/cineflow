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
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { RoomService } from "./room.service";
import { Room } from "@/entities/room.entity";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { JWTAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@/modules/auth/guards/roles.guard";
import { Roles } from "@/modules/auth/decorators/roles.decorator";
import { Role } from "@/modules/auth/enums/role.enum";
import { AuthUser } from "../user/decorators/user.decorator";

@ApiTags("rooms")
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("rooms")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Roles(Role.STAFF, Role.MOVIEGOER)
  @Get()
  @ApiOperation({ summary: "Get all rooms" })
  @ApiResponse({ status: 200, description: "Return all rooms", type: [Room] })
  async findAll(): Promise<Room[]> {
    return this.roomService.findAll();
  }

  @Roles(Role.STAFF, Role.MOVIEGOER)
  @Get("cinema/:cinemaId")
  @ApiOperation({ summary: "Get all rooms by cinema" })
  @ApiResponse({
    status: 200,
    description: "Return all rooms for a cinema",
    type: [Room],
  })
  async findByCinema(@Param("cinemaId") cinemaId: string): Promise<Room[]> {
    return this.roomService.findByCinema(cinemaId);
  }

  @Roles(Role.STAFF, Role.MOVIEGOER)
  @Get(":id")
  @ApiOperation({ summary: "Get room by ID" })
  @ApiResponse({ status: 200, description: "Return room by ID", type: Room })
  @ApiResponse({ status: 404, description: "Room not found" })
  async findOne(
    @Param("id") id: string,
    @AuthUser("role") role: Role
  ): Promise<Room> {
    return this.roomService.findOne(id, role);
  }

  @Post()
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new room" })
  @ApiResponse({
    status: 201,
    description: "Room created successfully",
    type: Room,
  })
  async create(@Body() createTheaterDto: CreateRoomDto): Promise<Room> {
    return this.roomService.create(createTheaterDto);
  }

  @Put(":id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a room" })
  @ApiResponse({
    status: 200,
    description: "Room updated successfully",
    type: Room,
  })
  @ApiResponse({ status: 404, description: "Room not found" })
  async update(
    @Param("id") id: string,
    @Body() updateTheaterDto: UpdateRoomDto,
    @Request() req
  ): Promise<Room> {
    return this.roomService.update(id, updateTheaterDto, req.user.role);
  }

  @Delete(":id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a room" })
  @ApiResponse({ status: 200, description: "Room deleted successfully" })
  @ApiResponse({ status: 404, description: "Room not found" })
  async remove(@Param("id") id: string): Promise<void> {
    return this.roomService.remove(id);
  }

  @Roles(Role.STAFF, Role.MOVIEGOER)
  @Get(":id/seats")
  @ApiOperation({ summary: "Get all seats in a room" })
  @ApiResponse({ status: 200, description: "Return all seats in a room" })
  @ApiResponse({ status: 404, description: "Room not found" })
  async findSeats(@Param("id") id: string) {
    return this.roomService.findSeats(id);
  }

  @Roles(Role.STAFF, Role.MOVIEGOER)
  @Get(":id/availability")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get room availability for a specific date" })
  @ApiQuery({ name: "date", required: true, type: Date })
  @ApiResponse({ status: 200, description: "Return room availability" })
  async getRoomAvailability(
    @Param("id") id: string,
    @Query("date") dateString: string
  ) {
    const date = new Date(dateString);
    return this.roomService.getRoomAvailability(id, date);
  }
}
