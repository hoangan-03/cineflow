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
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Booked seat unique identifier",
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    type: () => Booking,
    description: "The booking this seat is part of",
  })
  @ManyToOne(() => Booking, (booking) => booking.bookedSeats)
  @JoinColumn({ name: "booking_id" })
  booking: Booking;

  @Column({ type: "uuid" })
  booking_id: string;

  @ApiProperty({
    type: () => Seat,
    description: "The seat that is booked",
  })
  @ManyToOne(() => Seat, (seat) => seat.bookedSeats)
  @JoinColumn({ name: "seat_id" })
  seat: Seat;

  @Column({ type: "uuid" })
  seat_id: string;

  @ApiProperty({
    type: () => Screening,
    description: "The screening this seat is booked for",
  })
  @ManyToOne(() => Screening, (screening) => screening.bookedSeats)
  screening: Screening;

  @Column({ type: "uuid" })
  screening_id: string;

  @ApiProperty({
    example: 12.99,
    description: "Price paid for this seat",
  })
  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;
}
