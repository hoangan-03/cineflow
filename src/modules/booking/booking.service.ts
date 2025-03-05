import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Booking } from '@/entities/booking.entity';
import { BookedSeat } from '@/entities/booked-seat.entity';
import { Screening } from '@/entities/screening.entity';
import { Seat } from '@/entities/seat.entity';
import { BookingStatus } from './enums/booking-status.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { generateReferenceNumber } from './utils/reference-generator';

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
    
    private connection: Connection
  ) {}

  async findAllByUser(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user_id: userId },
      relations: ['screening', 'screening.movie', 'screening.theater', 'bookedSeats', 'bookedSeats.seat'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOneByUser(id: string, userId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id, user_id: userId },
      relations: ['screening', 'screening.movie', 'screening.theater', 'bookedSeats', 'bookedSeats.seat']
    });
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    return booking;
  }

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const { screening_id, payment_method_id, seatIds } = createBookingDto;
    
    // Start transaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Get screening
      const screening = await this.screeningRepository.findOne({ 
        where: { id: screening_id } 
      });
      
      if (!screening) {
        throw new NotFoundException(`Screening with ID ${screening_id} not found`);
      }
      
      if (!screening.isAvailable) {
        throw new BadRequestException('This screening is not available for booking');
      }
      
      // Check if seats exist and are not already booked for this screening
      const seats = await this.seatRepository.findByIds(seatIds);
      
      if (seats.length !== seatIds.length) {
        throw new BadRequestException('One or more seats do not exist');
      }
      
      // Check if any seats are already booked
      const existingBookedSeats = await this.bookedSeatRepository
        .createQueryBuilder('bookedSeat')
        .innerJoin('bookedSeat.booking', 'booking')
        .where('booking.screening_id = :screeningId', { screeningId: screening_id })
        .andWhere('bookedSeat.seat_id IN (:...seatIds)', { seatIds })
        .andWhere('booking.status NOT IN (:...cancelledStatuses)', { 
          cancelledStatuses: [BookingStatus.CANCELLED, BookingStatus.REFUNDED] 
        })
        .getMany();
      
      if (existingBookedSeats.length > 0) {
        throw new BadRequestException('One or more selected seats are already booked');
      }
      
      // Create booking
      const totalAmount = screening.price * seatIds.length;
      const referenceNumber = generateReferenceNumber();
      
      const booking = this.bookingRepository.create({
        referenceNumber,
        ticketCount: seatIds.length,
        totalAmount,
        status: BookingStatus.PENDING,
        user_id: userId,
        screening_id,
        payment_method_id,
      });
      
      const savedBooking = await queryRunner.manager.save(booking);
      
      // Create booked seats
      const bookedSeats = seats.map(seat => 
        this.bookedSeatRepository.create({
          booking_id: savedBooking.id,
          seat_id: seat.id,
          price: screening.price
        })
      );
      
      await queryRunner.manager.save(bookedSeats);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return this.findOneByUser(savedBooking.id, userId);
      
    } catch (error) {
      // Rollback transaction in case of error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, userId: string): Promise<Booking> {
    const booking = await this.findOneByUser(id, userId);
    
    // Only allow status updates
    if (updateBookingDto.status) {
      if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.REFUNDED) {
        throw new BadRequestException(`Cannot update a booking with status ${booking.status}`);
      }
      
      // Only allow certain status transitions
      const allowedTransitions = {
        [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
        [BookingStatus.CONFIRMED]: [BookingStatus.PAID, BookingStatus.CANCELLED],
        [BookingStatus.PAID]: [BookingStatus.REFUNDED],
      };
      
      if (!allowedTransitions[booking.status]?.includes(updateBookingDto.status)) {
        throw new BadRequestException(
          `Cannot change booking status from ${booking.status} to ${updateBookingDto.status}`
        );
      }
      
      booking.status = updateBookingDto.status;
      return this.bookingRepository.save(booking);
    }
    
    // For other updates, throw error if not PENDING
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(`Cannot update a booking with status ${booking.status}`);
    }
    
    // Update payment method if provided
    if (updateBookingDto.payment_method_id) {
      booking.payment_method_id = updateBookingDto.payment_method_id;
      return this.bookingRepository.save(booking);
    }
    
    return booking;
  }

  async cancel(id: string, userId: string): Promise<void> {
    const booking = await this.findOneByUser(id, userId);
    
    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.REFUNDED) {
      throw new BadRequestException(`Booking is already ${booking.status}`);
    }
    
    // Only allow cancellation for PENDING and CONFIRMED statuses
    // For PAID status, it should be REFUNDED instead of CANCELLED
    if (booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED) {
      booking.status = BookingStatus.CANCELLED;
    } else if (booking.status === BookingStatus.PAID) {
      booking.status = BookingStatus.REFUNDED;
    } else {
      throw new BadRequestException(`Cannot cancel a booking with status ${booking.status}`);
    }
    
    await this.bookingRepository.save(booking);
  }
}