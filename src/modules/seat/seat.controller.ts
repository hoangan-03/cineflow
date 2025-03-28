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
import { SeatService } from "./seat.service";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Role } from "@/modules/auth/enums/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Seat } from "@/entities/seat.entity";
import { Public } from "@/modules/auth/decorators/public.decorator";

@ApiTags("seats")
@UseGuards(JWTAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller()
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Public()
  @Get("rooms/:id")
  @ApiOperation({ summary: "Get all seats in a room - Public" })
  @ApiResponse({
    status: 200,
    description: "Return all seats in a room",
    type: [Seat],
  })
  @ApiResponse({ status: 404, description: "Room not found" })
  async findSeatsByRoom(@Param("id") room_id: number): Promise<Seat[]> {
    return this.seatService.findSeatsByRoom(room_id);
  }

  @Get("screenings/:id")
  @Roles(Role.STAFF, Role.MOVIEGOER)
  @ApiOperation({
    summary:
      "Get all seats with availability for a screening - Role: Staff/Moviegoer",
  })
  @ApiResponse({
    status: 200,
    description: "Return all seats with availability",
    type: [Seat],
  })
  @ApiResponse({ status: 404, description: "Screening not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async findSeatsByScreening(@Param("id") screeningId: number): Promise<any> {
    return this.seatService.findSeatsByScreening(screeningId);
  }

  @Get("screenings/:id/available")
  @Roles(Role.STAFF, Role.MOVIEGOER)
  @ApiOperation({
    summary: "Get all available seats for a screening - Role: Staff/Moviegoer",
  })
  @ApiResponse({
    status: 200,
    description: "Return all available seats",
    type: [Seat],
  })
  @ApiResponse({ status: 404, description: "Screening not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async findSeatsAvalableByScreening(
    @Param("id") screeningId: number
  ): Promise<any> {
    return this.seatService.findSeatsAvalableByScreening(screeningId);
  }

  // STAFF ROUTES
  @Post("staff/rooms/:id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create seat for a room - Role: Staff" })
  @ApiResponse({
    status: 201,
    description: "Seat created successfully",
    type: Seat,
  })
  @ApiResponse({ status: 404, description: "Room not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async createSeats(
    @Param("id") room_id: number,
    @Body() createSeatDto: Partial<Seat>
  ): Promise<Seat[]> {
    return this.seatService.createSeats(room_id, createSeatDto);
  }

  @Put("staff/:id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a seat - Role: Staff" })
  @ApiResponse({
    status: 200,
    description: "Seat updated successfully",
    type: Seat,
  })
  @ApiResponse({ status: 404, description: "Seat not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async updateSeat(
    @Param("id") id: number,
    @Body() updateSeatDto: any
  ): Promise<Seat> {
    return this.seatService.updateSeat(id, updateSeatDto);
  }

  @Delete("staff/:id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a seat - Role: Staff" })
  @ApiResponse({ status: 200, description: "Seat deleted successfully" })
  @ApiResponse({ status: 404, description: "Seat not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async removeSeat(@Param("id") id: number): Promise<void> {
    return this.seatService.removeSeat(id);
  }
}
