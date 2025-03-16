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
import { Room } from "@/entities/room.entity";
import { BookedSeat } from "./booked-seat.entity";

@Entity({ name: "seats" })
export class Seat extends BaseEntity {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Seat unique identifier",
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: "A",
    description: "Seat row",
  })
  @Column({ type: "varchar", length: 5 })
  row: string;

  @ApiProperty({
    example: 10,
    description: "Seat number",
  })
  @Column({ type: "integer" })
  number: number;

  @ApiProperty({
    example: "standard",
    description: "Seat type (standard, vip, accessible)",
  })
  @Column({ type: "varchar", length: 20, default: "standard" })
  type: string;

  @ApiProperty({
    type: () => Room,
    description: "The theater this seat belongs to",
  })
  @ManyToOne(() => Room)
  @JoinColumn({ name: "room_id" })
  room: Room;

  @Column({ type: "uuid" })
  room_id: string;

  @OneToMany(() => BookedSeat, (bookedSeat) => bookedSeat.seat, {
    cascade: true,
  })
  bookedSeats: BookedSeat[];
}
