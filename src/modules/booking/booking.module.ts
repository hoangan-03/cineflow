import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from '@/entities/booking.entity';
import { BookedSeat } from '@/entities/booked-seat.entity';
import { Screening } from '@/entities/screening.entity';
import { Seat } from '@/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, BookedSeat, Screening, Seat])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}