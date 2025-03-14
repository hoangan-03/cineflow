import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { Booking } from '@/entities/booking.entity';
import { CreateBookingDTO } from './dto/create-booking.dto';
import { UpdateBookingDTO } from './dto/update-booking.dto';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '@/modules/auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('bookings')
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('/me')
  @Roles(Role.MOVIEGOER) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings for the current user' })
  @ApiResponse({ status: 200, description: 'Return all bookings', type: [Booking] })
  async findAll(@Request() req): Promise<Booking[]> {
    return this.bookingService.findAllByUser(req.user.id);
  }

  @Get('me/:id')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.MOVIEGOER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by ID for the current user' })
  @ApiResponse({ status: 200, description: 'Return booking by ID', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async findOneForUser(@Request() req, @Param('id') id: string): Promise<Booking> {
    return this.bookingService.findOneByUser(id, req.user.id);
  }

  @Post()
  @Roles(Role.MOVIEGOER) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully', type: Booking })
  async create(@Request() req, @Body() createBookingDto: CreateBookingDTO): Promise<Booking> {
    return this.bookingService.create(createBookingDto, req.user.id);
  }

  @Put('me/:id')
  @Roles(Role.MOVIEGOER) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a booking' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async update(
    @Request() req,
    @Param('id') id: string, 
    @Body() updateBookingDto: UpdateBookingDTO
  ): Promise<Booking> {
    return this.bookingService.update(id, updateBookingDto, req.user.id);
  }

  @Delete('me/:id')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.MOVIEGOER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a booking for the current user' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancelForUser(@Request() req, @Param('id') id: string): Promise<void> {
    return this.bookingService.cancel(id, req.user.id);
  }

  // Staff-specific routes
  @Get('staff')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings (staff only)' })
  @ApiResponse({ status: 200, description: 'Return all bookings', type: [Booking] })
  async findAllForStaff(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  @Get('staff/:id')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by ID (staff only)' })
  @ApiResponse({ status: 200, description: 'Return booking by ID', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async findOneForStaff(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.findOne(id);
  }

  @Put('staff/:id')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a booking (staff only)' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async updateForStaff(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDTO,
  ): Promise<Booking> {
    return this.bookingService.updateForStaff(id, updateBookingDto);
  }

  @Delete('staff/:id')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a booking (staff only)' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancelForStaff(@Param('id') id: string): Promise<void> {
    return this.bookingService.cancelForStaff(id);
  }
}