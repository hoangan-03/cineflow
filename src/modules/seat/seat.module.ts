import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeatController } from "./seat.controller";
import { SeatService } from "./seat.service";
import { Booking } from "@/entities/booking.entity";
import { BookedSeat } from "@/entities/booked-seat.entity";
import { Screening } from "@/entities/screening.entity";
import { Seat } from "@/entities/seat.entity";
import { Room } from "@/entities/room.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookedSeat, Screening, Seat, Room]),
  ],
  controllers: [SeatController],
  providers: [SeatService],
  exports: [SeatService],
})
export class SeatModule {}
