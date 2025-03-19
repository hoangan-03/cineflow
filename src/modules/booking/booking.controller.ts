import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { BookingService } from "./booking.service";
import { Booking } from "@/entities/booking.entity";
import { CreateBookingDTO } from "./dto/create-booking.dto";
import { UpdateBookingDTO } from "./dto/update-booking.dto";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Role } from "@/modules/auth/enums/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthUser } from "../user/decorators/user.decorator";

@ApiTags("bookings")
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // STAFF
  @Get("staff")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all bookings" })
  @ApiResponse({
    status: 200,
    description: "Return all bookings",
    type: [Booking],
  })
  async findAllForStaff(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  @Get("staff/:id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get booking by ID" })
  @ApiResponse({
    status: 200,
    description: "Return booking by ID",
    type: Booking,
  })
  @ApiResponse({ status: 404, description: "Booking not found" })
  async findOneForStaff(@Param("id") id: string): Promise<Booking> {
    return this.bookingService.findOne(id);
  }

  @Put("staff/:id")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a booking (staff)" })
  @ApiResponse({
    status: 200,
    description: "Booking updated successfully",
    type: Booking,
  })
  @ApiResponse({ status: 404, description: "Booking not found" })
  async updateForStaff(
    @Param("id") id: string,
    @Body() updateBookingDto: UpdateBookingDTO
  ): Promise<Booking> {
    return this.bookingService.updateForStaff(id, updateBookingDto);
  }

  @Put("staff/:id/cancel")
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cancel a booking" })
  @ApiResponse({ status: 200, description: "Booking cancelled successfully" })
  @ApiResponse({ status: 404, description: "Booking not found" })
  async cancelForStaff(@Param("id") id: string): Promise<void> {
    return this.bookingService.cancelForStaff(id);
  }

  // MOVIEGOER
  @Post()
  @Roles(Role.MOVIEGOER, Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new booking" })
  @ApiResponse({
    status: 201,
    description: "Booking created successfully",
    type: Booking,
  })
  async create(
    @AuthUser("id") userId: string,
    @Body() createBookingDto: CreateBookingDTO
  ): Promise<Booking> {
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get("user")
  @Roles(Role.MOVIEGOER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all bookings for the current user" })
  @ApiResponse({
    status: 200,
    description: "Return all bookings",
    type: [Booking],
  })
  async findAll(@AuthUser("id") userId: string): Promise<Booking[]> {
    return this.bookingService.findAllByUser(userId);
  }

  @Get("user/:id")
  @Roles(Role.MOVIEGOER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get booking by ID for the current user" })
  @ApiResponse({
    status: 200,
    description: "Return booking by ID",
    type: Booking,
  })
  @ApiResponse({ status: 404, description: "Booking not found" })
  async findOneForUser(
    @AuthUser("id") userId: string,
    @Param("id") bookingId: string
  ): Promise<Booking> {
    return this.bookingService.findOneByUser(bookingId, userId);
  }

  @Put("user/:id")
  @Roles(Role.MOVIEGOER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a booking (user)" })
  @ApiResponse({
    status: 200,
    description: "Booking updated successfully",
    type: Booking,
  })
  @ApiResponse({ status: 404, description: "Booking not found" })
  async update(
    @Param("id") id: string,
    @AuthUser("id") userId: string,
    @Body() updateBookingDto: UpdateBookingDTO
  ): Promise<Booking> {
    return this.bookingService.update(id, updateBookingDto, userId);
  }

  @Put("user/:id/cancel")
  @Roles(Role.MOVIEGOER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cancel a booking for the current user" })
  @ApiResponse({ status: 200, description: "Booking cancelled successfully" })
  @ApiResponse({ status: 404, description: "Booking not found" })
  async cancelForUser(
    @AuthUser("id") userId: string,
    @Param("id") id: string
  ): Promise<void> {
    return this.bookingService.cancel(id, userId);
  }
}