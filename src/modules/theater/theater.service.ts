import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '@/entities/room.entity';
import { Seat } from '@/entities/seat.entity';
import { Cinema } from '@/entities/cinema.entity';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';

@Injectable()
export class TheaterService {
  constructor(
    @InjectRepository(Room)
    private readonly theaterRepository: Repository<Room>,
    
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    
    @InjectRepository(Cinema)
    private readonly cinemaRepository: Repository<Cinema>
  ) {}

  async findAll(): Promise<Room[]> {
    return this.theaterRepository.find();
  }

  async findOne(id: string): Promise<Room> {
    const theater = await this.theaterRepository.findOne({ 
      where: { id },
      relations: ['cinema']
    });
    
    if (!theater) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    
    return theater;
  }

  async create(createTheaterDto: CreateTheaterDto): Promise<Room> {
    const { cinema_id, ...theaterData } = createTheaterDto;
    
    // Verify cinema exists
    const cinema = await this.cinemaRepository.findOne({ where: { id: cinema_id } });
    if (!cinema) {
      throw new NotFoundException(`Cinema with ID ${cinema_id} not found`);
    }
    
    const theater = this.theaterRepository.create({
      ...theaterData,
      cinema_id
    });
    
    return this.theaterRepository.save(theater);
  }

  async update(id: string, updateTheaterDto: UpdateTheaterDto): Promise<Room> {
    const theater = await this.findOne(id);
    
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
    
    Object.assign(theater, updateTheaterDto);
    return this.theaterRepository.save(theater);
  }

  async remove(id: string): Promise<void> {
    const result = await this.theaterRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }

  async findSeats(theaterId: string): Promise<Seat[]> {
    // First check if theater exists
    await this.findOne(theaterId);
    
    return this.seatRepository.find({ where: { theater_id: theaterId } });
  }
}