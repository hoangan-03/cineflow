import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindOptionsWhere, In } from "typeorm";
import { Room } from "@/entities/room.entity";
import { Seat } from "@/entities/seat.entity";
import { Cinema } from "@/entities/cinema.entity";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { Role } from "@/modules/auth/enums/role.enum";
import { BookedSeat } from "@/entities/booked-seat.entity";
import { Screening } from "@/entities/screening.entity";
import { Booking } from "@/entities/booking.entity";

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
    const relations = ["cinema"];

    return this.roomRepository.find({
      relations,
      order: { name: "ASC" },
    });
  }

  async findByCinema(cinemaId: string): Promise<Room[]> {
    return this.roomRepository.find({
      where: { cinema_id: cinemaId },
      order: { name: "ASC" },
    });
  }

  async findOne(id: string, role?: Role): Promise<Room> {
    const relations = ["cinema"];

    if (role === Role.STAFF) {
      relations.push("screenings");
    }

    const room = await this.roomRepository.findOne({
      where: { id },
      relations,
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const { cinema_id, ...roomData } = createRoomDto;

    const cinema = await this.cinemaRepository.findOne({
      where: { id: cinema_id },
    });
    if (!cinema) {
      throw new NotFoundException(`Cinema with ID ${cinema_id} not found`);
    }

    const room = this.roomRepository.create({
      ...roomData,
      cinema_id,
    });

    return this.roomRepository.save(room);
  }

  async update(
    id: string,
    updateTheaterDto: UpdateRoomDto,
    userRole: Role
  ): Promise<Room> {
    if (userRole !== Role.STAFF) {
      throw new ForbiddenException("Only staff can update rooms");
    }

    const room = await this.findOne(id);

    if (updateTheaterDto.cinema_id) {
      const cinema = await this.cinemaRepository.findOne({
        where: { id: updateTheaterDto.cinema_id },
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
    await this.findOne(id);
    const queryRunner =
      this.roomRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const seats = await queryRunner.manager.find(Seat, {
        where: { room_id: id },
      });
      const seatIds = seats.map((seat) => seat.id);

      const screenings = await queryRunner.manager.find(Screening, {
        where: { room_id: id },
      });
      const screeningIds = screenings.map((screening) => screening.id);

      if (seatIds.length > 0) {
        await queryRunner.manager.delete(BookedSeat, { seat_id: In(seatIds) });
      }

      if (screeningIds.length > 0) {
        await queryRunner.manager.delete(Booking, {
          screening_id: In(screeningIds),
        });
      }

      await queryRunner.manager.delete(Seat, { room_id: id });
      await queryRunner.manager.delete(Screening, { room_id: id });

      const result = await queryRunner.manager.delete(Room, id);

      if (result.affected === 0) {
        throw new NotFoundException(`Room with ID ${id} not found`);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findSeats(roomId: string): Promise<Seat[]> {
    await this.findOne(roomId);

    return this.seatRepository.find({
      order: { row: "ASC" },
    });
  }

  async getRoomAvailability(roomId: string, date: Date): Promise<any> {
    const room = await this.findOne(roomId);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const screenings = await this.roomRepository
      .createQueryBuilder("room")
      .leftJoinAndSelect("room.screenings", "screening")
      .where("room.id = :roomId", { roomId })
      .andWhere("screening.startTime BETWEEN :start AND :end", {
        start: startOfDay,
        end: endOfDay,
      })
      .getOne();

    return {
      room: {
        id: room.id,
        name: room.name,
        totalSeats: room.totalSeats,
      },
      screenings: screenings?.screenings || [],
    };
  }
}
