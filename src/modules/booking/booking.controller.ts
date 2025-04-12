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
@ApiBearerAuth()
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller("bookings")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // STAFF
  @Get("staff")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Get all bookings - Role: Staff" })
  @ApiResponse({
    status: 200,
    description: "Return all bookings",
    type: [Booking],
  })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async findAllForStaff(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  @Get("staff/:id")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Get booking by ID - Role: Staff" })
  @ApiResponse({
    status: 200,
    description: "Return booking by ID",
    type: Booking,
  })
  @ApiResponse({ status: 404, description: "Booking not found" })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async findOneForStaff(@Param("id") id: number): Promise<Booking> {
    return this.bookingService.findOne(id);
  }

  @Put("staff/:id")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Update a booking - Role: Staff" })
  @ApiResponse({
    status: 200,
    description: "Booking updated successfully",
    type: Booking,
  })
  @ApiResponse({ status: 404, description: "Booking not found" })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async updateForStaff(
    @Param("id") id: number,
    @Body() updateBookingDto: UpdateBookingDTO
  ): Promise<Booking> {
    return this.bookingService.updateForStaff(id, updateBookingDto);
  }

  @Put("staff/:id/cancel")
  @Roles(Role.STAFF)
  @ApiOperation({ summary: "Cancel a booking - Role: Staff" })
  @ApiResponse({ status: 200, description: "Booking cancelled successfully" })
  @ApiResponse({ status: 404, description: "Booking not found" })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async cancelForStaff(@Param("id") id: number): Promise<void> {
    return this.bookingService.cancelForStaff(id);
  }

  // MOVIEGOER
  @Post()
  @Roles(Role.MOVIEGOER, Role.STAFF)
  @ApiOperation({
    summary: "Create a new booking - Role: Moviegoer/Staff",
    description:
      "Creates a new booking with optional voucher code for discount",
  })
  @ApiResponse({
    status: 201,
    description: "Booking created successfully",
    type: Booking,
  })
  @ApiResponse({
    status: 400,
    description:
      "Bad request - Invalid voucher, expired voucher, or already booked seats",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async create(
    @AuthUser("id") userId: number,
    @Body() createBookingDto: CreateBookingDTO
  ): Promise<Booking> {
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get("user")
  @Roles(Role.MOVIEGOER)
  @ApiOperation({
    summary: "Get all bookings for the current user - Role: Moviegoer",
  })
  @ApiResponse({
    status: 200,
    description: "Return all bookings",
    type: [Booking],
  })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async findAll(@AuthUser("id") userId: number): Promise<Booking[]> {
    return this.bookingService.findAllByUser(userId);
  }

  @Get("user/:id")
  @Roles(Role.MOVIEGOER)
  @ApiOperation({
    summary: "Get booking by ID for the current user - Role: Moviegoer",
  })
  @ApiResponse({
    status: 200,
    description: "Return booking by ID",
    type: Booking,
  })
  @ApiResponse({ status: 404, description: "Booking not found" })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async findOneForUser(
    @AuthUser("id") userId: number,
    @Param("id") bookingId: number
  ): Promise<Booking> {
    return this.bookingService.findOneByUser(bookingId, userId);
  }

  @Put("user/:id")
  @Roles(Role.MOVIEGOER)
  @ApiOperation({ summary: "Update a booking (user) - Role: Moviegoer" })
  @ApiResponse({
    status: 200,
    description: "Booking updated successfully",
    type: Booking,
  })
  @ApiResponse({ status: 404, description: "Booking not found" })
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
    @AuthUser("id") userId: number,
    @Body() updateBookingDto: UpdateBookingDTO
  ): Promise<Booking> {
    return this.bookingService.update(id, updateBookingDto, userId);
  }

  @Put("user/:id/cancel")
  @Roles(Role.MOVIEGOER)
  @ApiOperation({
    summary: "Cancel a booking for the current user - Role: Moviegoer",
  })
  @ApiResponse({ status: 200, description: "Booking cancelled successfully" })
  @ApiResponse({ status: 404, description: "Booking not found" })
  @ApiResponse({
    status: 403,
    description: "You are not allowed to access this resource",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async cancelForUser(
    @AuthUser("id") userId: number,
    @Param("id") id: number
  ): Promise<void> {
    return this.bookingService.cancel(id, userId);
  }
}
