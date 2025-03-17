import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Screening } from '@/entities/screening.entity';
import { Movie } from '@/entities/movie.entity';
import { Room } from '@/entities/room.entity';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';

@Injectable()
export class ScreeningService {
  constructor(
    @InjectRepository(Screening)
    private readonly screeningRepository: Repository<Screening>,
    
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    
    @InjectRepository(Room)
    private readonly theaterRepository: Repository<Room>,
  ) {}

  async findAll(
    movieId?: string,
    theaterId?: string,
    dateStr?: string
  ): Promise<Screening[]> {
    const queryBuilder = this.screeningRepository.createQueryBuilder('screening')
      .leftJoinAndSelect('screening.movie', 'movie')
      .leftJoinAndSelect('screening.room', 'room')
      .leftJoinAndSelect('room.cinema', 'cinema');
    
    if (movieId) {
      queryBuilder.andWhere('screening.movie_id = :movieId', { movieId });
    }
    
    if (theaterId) {
      queryBuilder.andWhere('screening.theater_id = :theaterId', { theaterId });
    }
    
    if (dateStr) {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format');
      }
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      queryBuilder.andWhere('screening.startTime BETWEEN :start AND :end', { 
        start: startOfDay, 
        end: endOfDay 
      });
    }
    
    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Screening> {
    const screening = await this.screeningRepository.findOne({ 
      where: { id },
      relations: ['movie', 'room', 'room.cinema']
    });
    
    if (!screening) {
      throw new NotFoundException(`Screening with ID ${id} not found`);
    }
    
    return screening;
  }

  async create(createScreeningDto: CreateScreeningDto): Promise<Screening> {
    const { movie_id, theater_id, ...screeningData } = createScreeningDto;
    
    // Verify movie exists
    const movie = await this.movieRepository.findOne({ where: { id: movie_id } });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movie_id} not found`);
    }
    
    // Verify room exists
    const room = await this.theaterRepository.findOne({ where: { id: theater_id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${theater_id} not found`);
    }
    
    // Check for screening time conflicts in the same room
    const { startTime } = createScreeningDto;
    const startTimeDate = new Date(startTime);
    
    // Calculate end time based on movie duration (adding buffer time of 30 minutes)
    const endTimeDate = new Date(startTimeDate);
    endTimeDate.setMinutes(endTimeDate.getMinutes() + movie.duration+ 30);
    
    // Check for conflicts
    const existingScreening = await this.screeningRepository.findOne({
      where: {
        theater_id,
        startTime: Between(
          new Date(startTimeDate.getTime() - 30 * 60 * 1000), // 30 minutes before
          endTimeDate
        )
      }
    });
    
    if (existingScreening) {
      throw new BadRequestException('There is a scheduling conflict with another screening in this room');
    }
    
    const screening = this.screeningRepository.create({
      ...screeningData,
      movie_id,
      theater_id
    });
    
    return this.screeningRepository.save(screening);
  }

  async update(id: string, updateScreeningDto: UpdateScreeningDto): Promise<Screening> {
    const screening = await this.findOne(id);
    const { movie_id, theater_id, ...screeningData } = updateScreeningDto;
    
    if (movie_id) {
      const movie = await this.movieRepository.findOne({ where: { id: movie_id } });
      if (!movie) {
        throw new NotFoundException(`Movie with ID ${movie_id} not found`);
      }
    }
    
    if (theater_id) {
      const room = await this.theaterRepository.findOne({ where: { id: theater_id } });
      if (!room) {
        throw new NotFoundException(`Room with ID ${theater_id} not found`);
      }
    }
    
    // If startTime or room is changing, check for conflicts
    if (updateScreeningDto.startTime || theater_id) {
      const movieToCheck = movie_id 
        ? await this.movieRepository.findOne({ where: { id: movie_id } })
        : await this.movieRepository.findOne({ where: { id: screening.movie_id } });
      
      const theaterIdToCheck = theater_id || screening.theater_id;
      const startTimeToCheck = updateScreeningDto.startTime 
        ? new Date(updateScreeningDto.startTime)
        : screening.startTime;
      
      // Calculate end time
      const endTimeDate = new Date(startTimeToCheck);
      if (!movieToCheck) {
        throw new NotFoundException(`Movie not found`);
      }
      endTimeDate.setMinutes(endTimeDate.getMinutes() + movieToCheck.duration + 30);

      
      
      // Check for conflicts excluding the current screening
      const existingScreening = await this.screeningRepository.createQueryBuilder('screening')
        .where('screening.theater_id = :theaterIdToCheck', { theaterIdToCheck })
        .andWhere('screening.id != :id', { id })
        .andWhere(`(
          screening.startTime BETWEEN :start AND :end OR 
          DATE_ADD(screening.startTime, INTERVAL (SELECT durationMinutes FROM movies WHERE id = screening.movie_id) + 30 MINUTE) > :start
        )`, {
          start: new Date(startTimeToCheck.getTime() - 30 * 60 * 1000),
          end: endTimeDate
        })
        .getOne();
      
      if (existingScreening) {
        throw new BadRequestException('There is a scheduling conflict with another screening in this room');
      }
    }
    
    Object.assign(screening, { ...screeningData, movie_id, theater_id });
    return this.screeningRepository.save(screening);
  }

  async remove(id: string): Promise<void> {
    const result = await this.screeningRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Screening with ID ${id} not found`);
    }
  }
}