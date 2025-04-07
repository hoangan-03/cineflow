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
import { Movie } from "@/entities/movie.entity";
import { Room } from "@/entities/room.entity";
import { Booking } from "@/entities/booking.entity";
import { BookedSeat } from "./booked-seat.entity";

@Entity({ name: "screenings" })
export class Screening extends BaseEntity {
  @ApiProperty({
    example: "1",
    description: "Screening unique identifier",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: "2025-04-07 10:00:00",
    description: "Screening start time",
  })
  @Column({ type: "timestamp" })
  startTime: Date;

  @ApiProperty({
    example: "2D",
    description: "Screening format (2D, 3D, IMAX, L'Amour, Gold Class)",
  })
  @Column({ type: "varchar", length: 12 })
  format: string;

  @ApiProperty({
    example: 12.99,
    description: "Ticket price for this screening",
  })
  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    example: true,
    description: "Whether the screening is available for booking",
  })
  @Column({ type: "boolean", default: true })
  isAvailable: boolean;

  @ApiProperty({
    type: () => Movie,
    description: "The movie being screened",
  })
  @ManyToOne(() => Movie, (movie) => movie.screenings)
  @JoinColumn({ name: "movie_id" })
  movie: Movie;

  @Column()
  movie_id: number;

  @ApiProperty({
    type: () => Room,
    description: "The room where the screening takes place",
  })
  @ManyToOne(() => Room, (room) => room.screenings)
  @JoinColumn({ name: "room_id" })
  room: Room;

  @Column()
  room_id: number;

  @OneToMany(() => Booking, (booking) => booking.screening)
  bookings: Booking[];

  @OneToMany(() => BookedSeat, (bookedSeat) => bookedSeat.screening, {
    cascade: true,
  })
  bookedSeats: BookedSeat[];
}
