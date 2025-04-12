import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { Booking } from "@/entities/booking.entity";
import { BookedSeat } from "@/entities/booked-seat.entity";
import { Screening } from "@/entities/screening.entity";
import { Seat } from "@/entities/seat.entity";
import { VoucherModule } from "../voucher/voucher.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookedSeat, Screening, Seat]),
    VoucherModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
