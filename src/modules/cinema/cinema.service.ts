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

  // PUBLIC

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

  async findScreenings(cinemaId: string): Promise<any[]> {
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

  // MOVIEGOER AND STAFF

  async findUpcomingScreenings(cinemaId: string): Promise<any[]> {
    const cinema = await this.findOne(cinemaId);
    const roomIds = cinema.rooms.map((room) => room.id);

    // Get screenings starting from now
    const now = new Date();

    const screenings = await this.screeningRepository
      .createQueryBuilder("screening")
      .leftJoinAndSelect("screening.room", "room")
      .leftJoinAndSelect("screening.movie", "movie")
      .where("room.id IN (:...roomIds)", { roomIds })
      .andWhere("screening.startTime > :now", { now })
      .orderBy("screening.startTime", "ASC")
      .getMany();

    return screenings;
  }

  // STAFF

  async create(createCinemaDto: CreateCinemaDto): Promise<Cinema> {
    console.log("Received DTO:", createCinemaDto);
    // if (!createCinemaDto.name || createCinemaDto.name.trim() === "") {
    //   throw new BadRequestException("Cinema name is required");
    // }

    const cinema = this.cinemaRepository.create(createCinemaDto);
    return this.cinemaRepository.save(cinema);
  }

  async update(id: string, updateCinemaDto: UpdateCinemaDto): Promise<Cinema> {
    const cinema = await this.findOne(id);
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

  async getStatistics(cinemaId: string): Promise<any> {
    const cinema = await this.findOne(cinemaId);

    // Get room count
    const roomCount = cinema.rooms ? cinema.rooms.length : 0;

    // Get all room IDs for this cinema
    const roomIds = cinema.rooms.map((room) => room.id);

    // Count upcoming showtimes
    const upcomingShowtimesCount = await this.screeningRepository.count({
      where: {
        room: { id: In(roomIds) },
        startTime: MoreThan(new Date()),
      },
    });

    // Get total seats capacity
    const totalSeats = cinema.rooms.reduce(
      (sum, room) => sum + room.totalSeats,
      0
    );

    return {
      cinemaId: cinema.id,
      cinemaName: cinema.name,
      roomCount,
      totalSeats,
      upcomingShowtimesCount,
    };
  }

  async getAllStatistics(): Promise<any> {
    const cinemas = await this.cinemaRepository.find({ relations: ["rooms"] });

    // Get total cinema count
    const cinemaCount = cinemas.length;

    // Get total room count across all cinemas
    const roomCount = cinemas.reduce(
      (sum, cinema) => sum + cinema.rooms.length,
      0
    );

    // Get upcoming screenings count
    const upcomingScreeningsCount = await this.screeningRepository.count({
      where: {
        startTime: MoreThan(new Date()),
      },
    });

    // Get cinema with most rooms
    const cinemaWithMostRooms = cinemas.reduce(
      (max, cinema) => (cinema.rooms.length > max.rooms.length ? cinema : max),
      cinemas[0]
    );

    return {
      totalCinemas: cinemaCount,
      totalRooms: roomCount,
      upcomingScreeningsCount,
      cinemaWithMostRooms: {
        id: cinemaWithMostRooms?.id,
        name: cinemaWithMostRooms?.name,
        roomCount: cinemaWithMostRooms?.rooms.length,
      },
    };
  }
}
