import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, MoreThan, Repository } from "typeorm";
import { Cinema } from "@/entities/cinema.entity";
import { Room } from "@/entities/room.entity";
import { Screening } from "@/entities/screening.entity";
import { CreateCinemaDto } from "./dto/create-cinema.dto";
import { UpdateCinemaDto } from "./dto/update-cinema.dto";

@Injectable()
export class CinemaService {
  constructor(
    @InjectRepository(Cinema)
    private readonly cinemaRepository: Repository<Cinema>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Screening)
    private readonly screeningRepository: Repository<Screening>
  ) {}

  async findAll(): Promise<Cinema[]> {
    return this.cinemaRepository.find({
      relations: ["rooms"],
    });
  }

  async findOne(id: string): Promise<Cinema> {
    const cinema = await this.cinemaRepository.findOne({
      where: { id },
      relations: ["rooms"],
    });

    if (!cinema) {
      throw new NotFoundException(`Cinema with ID ${id} not found`);
    }

    return cinema;
  }

  async create(createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    // Validate input data if needed
    if (!createCinemaDto.name || createCinemaDto.name.trim() === "") {
      throw new BadRequestException("Cinema name is required");
    }

    const cinema = this.cinemaRepository.create(createCinemaDto);
    return this.cinemaRepository.save(cinema);
  }

  async update(id: string, updateCinemaDto: UpdateCinemaDto): Promise<Cinema> {
    const cinema = await this.findOne(id);

    // Validate input data if needed
    if (updateCinemaDto.name && updateCinemaDto.name.trim() === "") {
      throw new BadRequestException("Cinema name cannot be empty");
    }

    Object.assign(cinema, updateCinemaDto);
    return this.cinemaRepository.save(cinema);
  }

  async remove(id: string): Promise<void> {
    const cinema = await this.findOne(id);

    // Check if cinema has associated rooms
    if (cinema.rooms && cinema.rooms.length > 0) {
      throw new BadRequestException(
        "Cannot delete cinema with associated rooms"
      );
    }

    const result = await this.cinemaRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Cinema with ID ${id} not found`);
    }
  }

  async findRooms(cinemaId: string): Promise<Room[]> {
    const cinema = await this.cinemaRepository.findOne({
      where: { id: cinemaId },
      relations: ["rooms"],
    });

    if (!cinema) {
      throw new NotFoundException(`Cinema with ID ${cinemaId} not found`);
    }

    return cinema.rooms;
  }

  async findscreenings(cinemaId: string): Promise<any[]> {
    const cinema = await this.findOne(cinemaId);

    // Get all room IDs for this cinema
    const roomIds = cinema.rooms.map((room) => room.id);

    // Find all screenings for these rooms
    const screenings = await this.screeningRepository
      .createQueryBuilder("screening")
      .leftJoinAndSelect("screening.room", "room")
      .leftJoinAndSelect("screening.movie", "movie")
      .where("room.id IN (:...roomIds)", { roomIds })
      .orderBy("screening.startTime", "ASC")
      .getMany();

    return screenings;
  }

  // Staff-only method to get cinema statistics
  async getStatistics(cinemaId: string): Promise<any> {
    const cinema = await this.findOne(cinemaId);

    // Get room count
    const roomCount = cinema.rooms ? cinema.rooms.length : 0;

    // Get all room IDs for this cinema
    const theaterIds = cinema.rooms.map((room) => room.id);

    // Count upcoming showtimes
    const upcomingShowtimesCount = await this.screeningRepository.count({
      where: {
        room: { id: In(theaterIds) },
        startTime: MoreThan(new Date()),
      },
    });

    // Additional statistics can be added here

    return {
      cinemaId: cinema.id,
      cinemaName: cinema.name,
      theaterCount: roomCount,
      upcomingShowtimesCount,
      // Add more statistics as needed
    };
  }
}
