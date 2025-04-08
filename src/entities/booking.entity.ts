import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "@/entities/base-class";
import { User } from "@/entities/user.entity";
import { Screening } from "@/entities/screening.entity";
import { BookedSeat } from "@/entities/booked-seat.entity";
import { BookingStatus } from "@/modules/booking/enums/booking-status.enum";
import { LONG_STR, STD_STR } from "@/constants/validation.constant";
import { Max, MaxLength } from "class-validator";
import { Snack } from "./snack.entity";

@Entity({ name: "bookings" })
export class Booking extends BaseEntity {
  @ApiProperty({
    example: "1",
    description: "Booking unique identifier",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @MaxLength(STD_STR)
  @ApiProperty({
    example: "INV-12345",
    description: "Booking reference number",
  })
  @Column({ type: "varchar", length: STD_STR, unique: true })
  referenceNumber: string;

  @Max(LONG_STR)
  @ApiProperty({
    example: 2,
    description: "Number of tickets booked",
  })
  @Column({ type: "integer" })
  ticketCount: number;

  @ApiProperty({
    example: 25.98,
    description: "Total amount paid",
  })
  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalAmount: number;

  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    description: "Current booking status",
  })
  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ApiProperty({
    type: () => User,
    description: "The user who made the booking",
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  user_id: number;

  @ApiProperty({
    type: () => Screening,
    description: "The screening being booked",
  })
  @ManyToOne(() => Screening, (screening) => screening.bookings)
  @JoinColumn({ name: "screening_id" })
  screening: Screening;

  @Column()
  screening_id: number;

  @OneToMany(() => BookedSeat, (bookedSeat) => bookedSeat.booking, {
    cascade: true,
  })
  bookedSeats: BookedSeat[];

  @OneToMany(() => Snack, (snack) => snack.booking, {
    cascade: true,
  })
  snacks: Snack[];
}

