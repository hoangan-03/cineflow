import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from '@/entities/cinema.entity';
import { Room } from '@/entities/room.entity';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';

@Injectable()
export class CinemaService {
  constructor(
    @InjectRepository(Cinema)
    private readonly cinemaRepository: Repository<Cinema>,
    
    @InjectRepository(Room)
    private readonly theaterRepository: Repository<Room>
  ) {}

  async findAll(): Promise<Cinema[]> {
    return this.cinemaRepository.find();
  }

  async findOne(id: string): Promise<Cinema> {
    const cinema = await this.cinemaRepository.findOne({ where: { id } });
    
    if (!cinema) {
      throw new NotFoundException(`Cinema with ID ${id} not found`);
    }
    
    return cinema;
  }

  async create(createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    const cinema = this.cinemaRepository.create(createCinemaDto);
    return this.cinemaRepository.save(cinema);
  }

  async update(id: string, updateCinemaDto: UpdateCinemaDto): Promise<Cinema> {
    const cinema = await this.findOne(id);
    Object.assign(cinema, updateCinemaDto);
    return this.cinemaRepository.save(cinema);
  }

  async remove(id: string): Promise<void> {
    const result = await this.cinemaRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Cinema with ID ${id} not found`);
    }
  }

  async findTheaters(cinemaId: string): Promise<Room[]> {
    const cinema = await this.cinemaRepository.findOne({ 
      where: { id: cinemaId },
      relations: ['theaters']
    });
    
    if (!cinema) {
      throw new NotFoundException(`Cinema with ID ${cinemaId} not found`);
    }
    
    return cinema.theaters;
  }
}