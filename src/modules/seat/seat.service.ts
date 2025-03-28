import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Booking } from "@/entities/booking.entity";
import { BookedSeat } from "@/entities/booked-seat.entity";
import { Screening } from "@/entities/screening.entity";
import { Seat } from "@/entities/seat.entity";
import { SeatType } from "./enums/seat-type.enum";
import { Room } from "@/entities/room.entity";
import { BookingStatus } from "../booking/enums/booking-status.enum";

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(BookedSeat)
    private readonly bookedSeatRepository: Repository<BookedSeat>,

    @InjectRepository(Screening)
    private readonly screeningRepository: Repository<Screening>,

    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>
  ) {}

  async findSeatsByRoom(room_id: number): Promise<Seat[]> {
    const room = await this.roomRepository.findOne({ where: { id: room_id } });

    if (!room) {
      throw new NotFoundException(`Room with ID ${room_id} not found`);
    }

    return this.seatRepository.find({
      where: { room_id: room_id },
      order: { row: "ASC", number: "ASC" },
    });
  }

  async findSeatsByScreening(screeningId: number): Promise<any> {
    const screening = await this.screeningRepository.findOne({
      where: { id: screeningId },
      relations: ["room"],
    });

    if (!screening) {
      throw new NotFoundException(`Screening with ID ${screeningId} not found`);
    }

    const seats = await this.seatRepository.find({
      where: { room_id: screening.room.id },
      order: { row: "ASC", number: "ASC" },
    });

    const bookedSeats = await this.bookedSeatRepository
      .createQueryBuilder("bookedSeat")
      .innerJoin("bookedSeat.booking", "booking")
      .where("booking.screening_id = :screeningId", { screeningId })
      .andWhere("booking.status NOT IN (:...cancelledStatuses)", {
        cancelledStatuses: [BookingStatus.CANCELLED, BookingStatus.REFUNDED],
      })
      .getMany();

    const bookedSeatIds = bookedSeats.map((bs) => bs.seat_id);

    return seats.map((seat) => ({
      ...seat,
      isAvailable: !bookedSeatIds.includes(seat.id),
    }));
  }

  async findSeatsAvalableByScreening(screeningId: number): Promise<any> {
    const screening = await this.screeningRepository.findOne({
      where: { id: screeningId },
      relations: ["room"],
    });

    if (!screening) {
      throw new NotFoundException(`Screening with ID ${screeningId} not found`);
    }

    const seats = await this.seatRepository.find({
      where: { room_id: screening.room.id },
      order: { row: "ASC", number: "ASC" },
    });
    const bookedSeats = await this.bookedSeatRepository
      .createQueryBuilder("bookedSeat")
      .innerJoin("bookedSeat.booking", "booking")
      .where("booking.screening_id = :screeningId", { screeningId })
      .andWhere("booking.status NOT IN (:...cancelledStatuses)", {
        cancelledStatuses: [BookingStatus.CANCELLED, BookingStatus.REFUNDED],
      })
      .getMany();

    const bookedSeatIds = bookedSeats.map((bs) => bs.seat_id);

    return seats.filter((seat) => !bookedSeatIds.includes(seat.id));
  }

  async createSeats(
    room_id: number,
    createSeatDto: Partial<Seat>
  ): Promise<Seat[]> {
    const room = await this.roomRepository.findOne({ where: { id: room_id } });

    if (!room) {
      throw new NotFoundException(`Room with ID ${room_id} not found`);
    }

    const { row, number, type = SeatType.STANDARD } = createSeatDto;
    const newSeats: Seat[] = [];

    newSeats.push(
      this.seatRepository.create({
        row,
        number,
        type,
        room_id: room_id,
      })
    );

    return this.seatRepository.save(newSeats);
  }

  async updateSeat(id: number, updateSeatDto: any): Promise<Seat> {
    const seat = await this.seatRepository.findOne({ where: { id } });

    if (!seat) {
      throw new NotFoundException(`Seat with ID ${id} not found`);
    }

    Object.assign(seat, updateSeatDto);
    return this.seatRepository.save(seat);
  }

  async removeSeat(id: number): Promise<void> {
    const seat = await this.seatRepository.findOne({ where: { id } });

    if (!seat) {
      throw new NotFoundException(`Seat with ID ${id} not found`);
    }

    const bookedSeats = await this.bookedSeatRepository.find({
      where: { seat_id: id },
    });
    if (bookedSeats.length > 0) {
      throw new BadRequestException("Cannot delete a seat that has bookings");
    }

    await this.seatRepository.remove(seat);
  }
}
