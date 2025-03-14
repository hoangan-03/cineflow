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
import { Cinema } from "@/entities/cinema.entity";
import { Screening } from "@/entities/screening.entity";

@Entity({ name: "rooms" })
export class Room extends BaseEntity {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Room unique identifier"
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: "Room 1",
    description: "Room name/number"
  })
  @Column({ type: "varchar", length: 50 })
  name: string;

  @ApiProperty({
    example: 150,
    description: "Total seats in theater"
  })
  @Column({ type: "integer" })
  totalSeats: number;

  @ApiProperty({
    type: () => Cinema,
    description: "The cinema this theater belongs to"
  })
  @ManyToOne(() => Cinema, cinema => cinema.theaters)
  @JoinColumn({ name: "cinema_id" })
  cinema: Cinema;

  @Column({ type: "uuid" })
  cinema_id: string;

  @OneToMany(() => Screening, screening => screening.theater)
  screenings: Screening[];
}