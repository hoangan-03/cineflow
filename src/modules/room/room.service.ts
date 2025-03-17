import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '@/entities/room.entity';
import { Seat } from '@/entities/seat.entity';
import { Cinema } from '@/entities/cinema.entity';
import { CreateTheaterDto } from './dto/create-room.dto';
import { UpdateTheaterDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    
    @InjectRepository(Cinema)
    private readonly cinemaRepository: Repository<Cinema>
  ) {}

  async findAll(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({ 
      where: { id },
      relations: ['cinema']
    });
    
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    
    return room;
  }

  async create(createTheaterDto: CreateTheaterDto): Promise<Room> {
    const { cinema_id, ...theaterData } = createTheaterDto;
    
    // Verify cinema exists
    const cinema = await this.cinemaRepository.findOne({ where: { id: cinema_id } });
    if (!cinema) {
      throw new NotFoundException(`Cinema with ID ${cinema_id} not found`);
    }
    
    const room = this.roomRepository.create({
      ...theaterData,
      cinema_id
    });
    
    return this.roomRepository.save(room);
  }

  async update(id: string, updateTheaterDto: UpdateTheaterDto): Promise<Room> {
    const room = await this.findOne(id);
    
    if (updateTheaterDto.cinema_id) {
      // Verify cinema exists if cinema_id is being updated
      const cinema = await this.cinemaRepository.findOne({ 
        where: { id: updateTheaterDto.cinema_id }
      });
      
      if (!cinema) {
        throw new NotFoundException(
          `Cinema with ID ${updateTheaterDto.cinema_id} not found`
        );
      }
    }
    
    Object.assign(room, updateTheaterDto);
    return this.roomRepository.save(room);
  }

  async remove(id: string): Promise<void> {
    const result = await this.roomRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }

  async findSeats(roomId: string): Promise<Seat[]> {
    // First check if room exists
    await this.findOne(roomId);
    
    return this.seatRepository.find({ where: { room_id: roomId } });
  }
}