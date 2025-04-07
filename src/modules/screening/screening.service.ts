import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Screening } from "@/entities/screening.entity";
import { Movie } from "@/entities/movie.entity";
import { Room } from "@/entities/room.entity";
import { CreateScreeningDto } from "./dto/create-screening.dto";
import { UpdateScreeningDto } from "./dto/update-screening.dto";

@Injectable()
export class ScreeningService {
  constructor(
    @InjectRepository(Screening)
    private readonly screeningRepository: Repository<Screening>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Room)
    private readonly theaterRepository: Repository<Room>
  ) {}

  async findAll(
    movieId?: number,
    roomId?: string,
    dateStr?: string
  ): Promise<Screening[]> {
    const queryBuilder = this.screeningRepository
      .createQueryBuilder("screening")
      .leftJoinAndSelect("screening.movie", "movie")
      .leftJoinAndSelect("screening.room", "room")
      .leftJoinAndSelect("room.cinema", "cinema");

    if (movieId) {
      queryBuilder.andWhere("screening.movie_id = :movieId", { movieId });
    }

    if (roomId) {
      queryBuilder.andWhere("screening.room_id = :roomId", { roomId });
    }

    if (dateStr) {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new BadRequestException("Invalid date format");
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      queryBuilder.andWhere("screening.startTime BETWEEN :start AND :end", {
        start: startOfDay,
        end: endOfDay,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Screening> {
    const screening = await this.screeningRepository.findOne({
      where: { id },
      relations: ["movie", "room", "room.cinema"],
    });

    if (!screening) {
      throw new NotFoundException(`Screening with ID ${id} not found`);
    }

    return screening;
  }

  async create(createScreeningDto: CreateScreeningDto): Promise<Screening> {
    const { movie_id, room_id, ...screeningData } = createScreeningDto;

    // Verify movie exists
    const movie = await this.movieRepository.findOne({
      where: { id: movie_id },
    });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movie_id} not found`);
    }

    // Verify room exists
    const room = await this.theaterRepository.findOne({
      where: { id: room_id },
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${room_id} not found`);
    }

    // Check for screening time conflicts in the same room
    const { startTime } = createScreeningDto;
    const startTimeDate = new Date(startTime);

    // Calculate end time based on movie duration (adding buffer time of 30 minutes)
    const endTimeDate = new Date(startTimeDate);
    endTimeDate.setMinutes(endTimeDate.getMinutes() + movie.duration + 30);

    // Check for conflicts
    const existingScreening = await this.screeningRepository.findOne({
      where: {
        room_id,
        startTime: Between(
          new Date(startTimeDate.getTime() - 30 * 60 * 1000), // 30 minutes before
          endTimeDate
        ),
      },
    });

    if (existingScreening) {
      throw new BadRequestException(
        "There is a scheduling conflict with another screening in this room"
      );
    }

    const screening = this.screeningRepository.create({
      ...screeningData,
      movie_id,
      room_id,
    });

    return this.screeningRepository.save(screening);
  }
  async update(
    id: number,
    updateScreeningDto: UpdateScreeningDto
  ): Promise<Screening> {
    const screening = await this.findOne(id);
    const { movie_id, room_id, startTime, ...screeningData } =
      updateScreeningDto;

    if (movie_id !== undefined) {
      const movie = await this.movieRepository.findOne({
        where: { id: movie_id },
      });
      if (!movie) {
        throw new NotFoundException(`Movie with ID ${movie_id} not found`);
      }
    }

    if (room_id !== undefined) {
      const room = await this.theaterRepository.findOne({
        where: { id: room_id },
      });
      if (!room) {
        throw new NotFoundException(`Room with ID ${room_id} not found`);
      }
    }

    const isRoomChanging =
      room_id !== undefined && room_id !== screening.room_id;
    const isStartTimeChanging =
      startTime !== undefined &&
      new Date(startTime).getTime() !== screening.startTime.getTime();


    if (
      (startTime !== undefined || isRoomChanging) &&
      (isStartTimeChanging || isRoomChanging)
    ) {
      const movieToUse =
        movie_id !== undefined
          ? await this.movieRepository.findOne({ where: { id: movie_id } })
          : await this.movieRepository.findOne({
              where: { id: screening.movie_id },
            });

      if (!movieToUse) {
        throw new NotFoundException(`Movie not found`);
      }

      const startTimeToCheck =
        startTime !== undefined ? new Date(startTime) : screening.startTime;

      const endTimeDate = new Date(startTimeToCheck);
      endTimeDate.setMinutes(
        endTimeDate.getMinutes() + movieToUse.duration + 30
      );

      const existingScreening = await this.screeningRepository
        .createQueryBuilder("screening")
        .where("screening.room_id = :roomId", { roomId: room_id })
        .andWhere("screening.id != :id", { id })
        .andWhere(
          `(
          screening.startTime BETWEEN :bufferStart AND :endTime OR
          (screening.startTime + INTERVAL '1 minute' * :duration) > :bufferStart
        )`,
          {
            bufferStart: new Date(startTimeToCheck.getTime() - 30 * 60 * 1000),
            endTime: endTimeDate,
            duration: movieToUse.duration + 30,
          }
        )
        .getOne();

      if (existingScreening) {
        throw new BadRequestException(
          "There is a scheduling conflict with another screening in this room"
        );
      }
    }

    if (isRoomChanging) {
      await this.screeningRepository
        .createQueryBuilder()
        .update(Screening)
        .set({ room_id: room_id })
        .where("id = :id", { id })
        .execute();

      const updatedScreening = await this.screeningRepository.findOne({
        where: { id },
        relations: ["movie", "room", "room.cinema"],
      });

      if (!updatedScreening) {
        throw new NotFoundException(
          `Screening with ID ${id} not found after update`
        );
      }

      console.log("After direct update, room_id is:", updatedScreening.room_id);

      Object.assign(updatedScreening, screeningData);
      if (movie_id !== undefined) updatedScreening.movie_id = movie_id;
      if (startTime !== undefined)
        updatedScreening.startTime = new Date(startTime);

      return this.screeningRepository.save(updatedScreening);
    }

    Object.assign(screening, screeningData);
    if (movie_id !== undefined) screening.movie_id = movie_id;
    if (startTime !== undefined) screening.startTime = new Date(startTime);

    return this.screeningRepository.save(screening);
  }
  async remove(id: number): Promise<void> {
    const result = await this.screeningRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Screening with ID ${id} not found`);
    }
  }
}
