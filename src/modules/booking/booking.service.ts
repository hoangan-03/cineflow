import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Connection } from "typeorm";
import { Booking } from "@/entities/booking.entity";
import { BookedSeat } from "@/entities/booked-seat.entity";
import { Screening } from "@/entities/screening.entity";
import { Seat } from "@/entities/seat.entity";
import { BookingStatus } from "./enums/booking-status.enum";
import { CreateBookingDTO } from "./dto/create-booking.dto";
import { UpdateBookingDTO } from "./dto/update-booking.dto";
import { generateReferenceNumber } from "./utils/reference-generator";
import { VoucherService } from "../voucher/voucher.service";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(BookedSeat)
    private readonly bookedSeatRepository: Repository<BookedSeat>,

    @InjectRepository(Screening)
    private readonly screeningRepository: Repository<Screening>,

    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,

    private connection: Connection,

    private voucherService: VoucherService
  ) {}

  async findAllByUser(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user_id: userId },
      relations: [
        "screening",
        "screening.movie",
        "screening.room",
        "bookedSeats",
        "bookedSeats.seat",
      ],
      order: { createdAt: "DESC" },
    });
  }

  async findOneByUser(id: number, userId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id, user_id: userId },
      relations: [
        "screening",
        "screening.movie",
        "screening.room",
        "bookedSeats",
        "bookedSeats.seat",
      ],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async create(
    createBookingDto: CreateBookingDTO,
    userId: number
  ): Promise<Booking> {
    const { screening_id, seat_ids: seatIds, voucherCode } = createBookingDto;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const screening = await this.screeningRepository.findOne({
        where: { id: screening_id },
      });

      if (!screening) {
        throw new NotFoundException(
          `Screening with ID ${screening_id} not found`
        );
      }

      if (!screening.isAvailable) {
        throw new BadRequestException(
          "This screening is not available for booking"
        );
      }

      const seats = await this.seatRepository.findByIds(seatIds);

      if (seats.length !== seatIds.length) {
        throw new BadRequestException("One or more seats do not exist");
      }

      const existingBookedSeats = await this.bookedSeatRepository
        .createQueryBuilder("bookedSeat")
        .innerJoin("bookedSeat.booking", "booking")
        .where("booking.screening_id = :screeningId", {
          screeningId: screening_id,
        })
        .andWhere("bookedSeat.seat_id IN (:...seatIds)", { seatIds })
        .andWhere("booking.status NOT IN (:...cancelledStatuses)", {
          cancelledStatuses: [BookingStatus.CANCELLED, BookingStatus.REFUNDED],
        })
        .getMany();

      if (existingBookedSeats.length > 0) {
        throw new BadRequestException(
          "One or more selected seats are already booked"
        );
      }

      // Calculate total amount based on seat types
      let totalAmount = 0;

      seats.forEach((seat) => {
        const basePrice = Number(screening.price);
        if (seat.type === "VIP") {
          totalAmount += basePrice * 1.5;
        } else if (seat.type === "COUPLE") {
          totalAmount += basePrice * 2;
        } else {
          totalAmount += basePrice;
        }
      });

      if (voucherCode) {
        try {
          let appliedVoucher = await this.voucherService.validateVoucher(
            voucherCode,
            userId
          );

          const discountStr = appliedVoucher.discount;
          const percentValue = parseInt(discountStr.replace("%", ""));
          totalAmount = totalAmount * ((100 - percentValue) / 100);

          // Round to 2 decimal places
          totalAmount = Math.round(totalAmount * 100) / 100;
        } catch (error) {
          throw new BadRequestException("Voucher error");
        }
      }

      const referenceNumber = generateReferenceNumber();

      const booking = this.bookingRepository.create({
        referenceNumber,
        ticketCount: seatIds.length,
        totalAmount,
        status: BookingStatus.PENDING,
        user_id: userId,
        screening_id,
        voucherCode: voucherCode || null,
      });

      const savedBooking = await queryRunner.manager.save(booking);

      const bookedSeats = seats.map((seat) =>
        this.bookedSeatRepository.create({
          booking_id: savedBooking.id,
          seat_id: seat.id,
          screening_id: screening_id,
          price:
            screening.price *
            (seat.type === "VIP" ? 1.5 : seat.type === "COUPLE" ? 2 : 1),
        })
      );

      await queryRunner.manager.save(bookedSeats);
      await queryRunner.commitTransaction();
      return this.findOneByUser(savedBooking.id, userId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDTO,
    userId: number
  ): Promise<Booking> {
    const booking = await this.findOneByUser(id, userId);

    if (updateBookingDto.status) {
      if (
        booking.status === BookingStatus.CANCELLED ||
        booking.status === BookingStatus.REFUNDED
      ) {
        throw new BadRequestException(
          `Cannot update a booking with status ${booking.status}`
        );
      }

      const allowedTransitions = {
        [BookingStatus.PENDING]: [
          BookingStatus.CONFIRMED,
          BookingStatus.CANCELLED,
        ],
        [BookingStatus.CONFIRMED]: [
          BookingStatus.PAID,
          BookingStatus.CANCELLED,
        ],
        [BookingStatus.PAID]: [BookingStatus.REFUNDED],
      };

      if (
        !allowedTransitions[booking.status]?.includes(updateBookingDto.status)
      ) {
        throw new BadRequestException(
          `Cannot change booking status from ${booking.status} to ${updateBookingDto.status}`
        );
      }

      booking.status = updateBookingDto.status;
      return this.bookingRepository.save(booking);
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        `Cannot update a booking with status ${booking.status}`
      );
    }

    return booking;
  }

  async cancel(id: number, userId: number): Promise<void> {
    const booking = await this.findOneByUser(id, userId);

    if (
      booking.status === BookingStatus.CANCELLED ||
      booking.status === BookingStatus.REFUNDED
    ) {
      throw new BadRequestException(`Booking is already ${booking.status}`);
    }

    if (
      booking.status === BookingStatus.PENDING ||
      booking.status === BookingStatus.CONFIRMED
    ) {
      booking.status = BookingStatus.CANCELLED;
    } else if (booking.status === BookingStatus.PAID) {
      booking.status = BookingStatus.REFUNDED;
    } else {
      throw new BadRequestException(
        `Cannot cancel a booking with status ${booking.status}`
      );
    }

    await this.bookingRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: [
        "screening",
        "screening.movie",
        "screening.room",
        "bookedSeats",
        "bookedSeats.seat",
        "user",
      ],
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: [
        "screening",
        "screening.movie",
        "screening.room",
        "bookedSeats",
        "bookedSeats.seat",
        "user",
      ],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async updateForStaff(
    id: number,
    updateBookingDto: UpdateBookingDTO
  ): Promise<Booking> {
    const booking = await this.findOne(id);

    if (updateBookingDto.status) {
      if (
        booking.status === BookingStatus.CANCELLED ||
        booking.status === BookingStatus.REFUNDED
      ) {
        throw new BadRequestException(
          `Cannot update a booking with status ${booking.status}`
        );
      }

      const forbiddenTransitions = {
        [BookingStatus.CANCELLED]: [
          BookingStatus.CONFIRMED,
          BookingStatus.PENDING,
          BookingStatus.PAID,
        ],
        [BookingStatus.REFUNDED]: [
          BookingStatus.CONFIRMED,
          BookingStatus.PENDING,
          BookingStatus.PAID,
        ],
      };

      if (
        forbiddenTransitions[booking.status]?.includes(updateBookingDto.status)
      ) {
        throw new BadRequestException(
          `Cannot change booking status from ${booking.status} to ${updateBookingDto.status}`
        );
      }

      booking.status = updateBookingDto.status;
    }

    if (updateBookingDto.ticketCount !== undefined) {
      booking.ticketCount = updateBookingDto.ticketCount;
    }

    if (updateBookingDto.totalAmount !== undefined) {
      booking.totalAmount = updateBookingDto.totalAmount;
    }
    return this.bookingRepository.save(booking);
  }

  async cancelForStaff(id: number): Promise<void> {
    const booking = await this.findOne(id);

    if (
      booking.status === BookingStatus.CANCELLED ||
      booking.status === BookingStatus.REFUNDED
    ) {
      throw new BadRequestException(`Booking is already ${booking.status}`);
    }

    if (booking.status === BookingStatus.PAID) {
      booking.status = BookingStatus.REFUNDED;
    } else {
      booking.status = BookingStatus.CANCELLED;
    }

    await this.bookingRepository.save(booking);
  }
}
