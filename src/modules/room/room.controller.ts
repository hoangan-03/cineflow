import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { Room } from '@/entities/room.entity';
import { CreateTheaterDto } from './dto/create-room.dto';
import { UpdateTheaterDto } from './dto/update-room.dto';

@ApiTags('theaters')
@Controller('theaters')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  @ApiOperation({ summary: 'Get all theaters' })
  @ApiResponse({ status: 200, description: 'Return all theaters', type: [Room] })
  async findAll(): Promise<Room[]> {
    return this.roomService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiResponse({ status: 200, description: 'Return room by ID', type: Room })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async findOne(@Param('id') id: string): Promise<Room> {
    return this.roomService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room created successfully', type: Room })
  async create(@Body() createTheaterDto: CreateTheaterDto): Promise<Room> {
    return this.roomService.create(createTheaterDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a room' })
  @ApiResponse({ status: 200, description: 'Room updated successfully', type: Room })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async update(
    @Param('id') id: string, 
    @Body() updateTheaterDto: UpdateTheaterDto
  ): Promise<Room> {
    return this.roomService.update(id, updateTheaterDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a room' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.roomService.remove(id);
  }

  @Get(':id/seats')
  @ApiOperation({ summary: 'Get all seats in a room' })
  @ApiResponse({ status: 200, description: 'Return all seats in a room' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async findSeats(@Param('id') id: string) {
    return this.roomService.findSeats(id);
  }
}