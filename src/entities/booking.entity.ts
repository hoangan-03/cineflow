import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "@/entities/base-class";
import { User } from "@/entities/user.entity";
import { Screening } from "@/entities/screening.entity";
import { BookedSeat } from "@/entities/booked-seat.entity";
import { BookingStatus } from "@/modules/booking/enums/booking-status.enum";

@Entity({ name: "bookings" })
export class Booking extends BaseEntity {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Booking unique identifier"
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: "INV-12345",
    description: "Booking reference number"
  })
  @Column({ type: "varchar", length: 20, unique: true })
  referenceNumber: string;

  @ApiProperty({
    example: 2,
    description: "Number of tickets booked"
  })
  @Column({ type: "integer" })
  ticketCount: number;

  @ApiProperty({
    example: 25.98,
    description: "Total amount paid"
  })
  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalAmount: number;

  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    description: "Current booking status"
  })
  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status: BookingStatus;

  @ApiProperty({
    type: () => User,
    description: "The user who made the booking"
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "uuid" })
  user_id: string;

  @ApiProperty({
    type: () => Screening,
    description: "The screening being booked"
  })
  @ManyToOne(() => Screening, screening => screening.bookings)
  @JoinColumn({ name: "screening_id" })
  screening: Screening;

  @Column({ type: "uuid" })
  screening_id: string;

  @OneToMany(() => BookedSeat, bookedSeat => bookedSeat.booking, { cascade: true })
  bookedSeats: BookedSeat[];
}