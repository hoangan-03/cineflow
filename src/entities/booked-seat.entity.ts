import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "@/entities/base-class";
import { Booking } from "@/entities/booking.entity";
import { Seat } from "@/entities/seat.entity";
import { Screening } from "./screening.entity";

@Entity({ name: "booked_seats" })
export class BookedSeat extends BaseEntity {
  @ApiProperty({
    example: "1",
    description: "Booked seat unique identifier",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: () => Booking,
    description: "The booking this seat is part of",
  })
  @ManyToOne(() => Booking, (booking) => booking.bookedSeats)
  @JoinColumn({ name: "booking_id" })
  booking: Booking;

  @Column()
  booking_id: number;

  @ApiProperty({
    type: () => Seat,
    description: "The seat that is booked",
  })
  @ManyToOne(() => Seat, (seat) => seat.bookedSeats)
  @JoinColumn({ name: "seat_id" })
  seat: Seat;

  @Column()
  seat_id: number;

  @ApiProperty({
    type: () => Screening,
    description: "The screening this seat is booked for",
  })
  @ManyToOne(() => Screening, (screening) => screening.bookedSeats)
  screening: Screening;

  @Column()
  screening_id: number;

  @ApiProperty({
    example: 12.99,
    description: "Price paid for this seat",
  })
  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;
}
