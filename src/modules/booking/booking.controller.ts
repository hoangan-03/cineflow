import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { Booking } from '@/entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '@/modules/auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
@ApiTags('bookings')
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @Roles(Role.STAFF) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings for the current user' })
  @ApiResponse({ status: 200, description: 'Return all bookings', type: [Booking] })
  async findAll(@Request() req): Promise<Booking[]> {
    return this.bookingService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @Roles(Role.STAFF, Role.MOVIEGOER) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Return booking by ID', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async findOne(@Request() req, @Param('id') id: string): Promise<Booking> {
    return this.bookingService.findOneByUser(id, req.user.id);
  }

  @Post()
  @Roles(Role.STAFF, Role.MOVIEGOER) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully', type: Booking })
  async create(@Request() req, @Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingService.create(createBookingDto, req.user.id);
  }

  @Put(':id')
  @Roles(Role.STAFF, Role.MOVIEGOER) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a booking' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async update(
    @Request() req,
    @Param('id') id: string, 
    @Body() updateBookingDto: UpdateBookingDto
  ): Promise<Booking> {
    return this.bookingService.update(id, updateBookingDto, req.user.id);
  }

  @Delete(':id')
  @Roles(Role.STAFF, Role.MOVIEGOER) 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async remove(@Request() req, @Param('id') id: string): Promise<void> {
    return this.bookingService.cancel(id, req.user.id);
  }
}