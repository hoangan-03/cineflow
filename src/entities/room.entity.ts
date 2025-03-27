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
import { Cinema } from "@/entities/cinema.entity";
import { Screening } from "@/entities/screening.entity";
import { FREE_STR } from "@/constants/validation.constant";
import { MaxLength } from "class-validator";

@Entity({ name: "rooms" })
export class Room extends BaseEntity {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Room unique identifier",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @MaxLength(FREE_STR)
  @ApiProperty({
    example: "Room 1",
    description: "Room name",
  })
  @Column({ type: "varchar", length: FREE_STR, default: "Room 1" })
  name: string;

  @ApiProperty({
    example: 150,
    description: "Total seats in room",
  })
  @Column({ type: "integer" })
  totalSeats: number;

  @ApiProperty({
    type: () => Cinema,
    description: "The cinema this room belongs to",
  })
  @ManyToOne(() => Cinema, (cinema) => cinema.rooms)
  @JoinColumn({ name: "cinema_id" })
  cinema: Cinema;

  @Column()
  cinema_id: number;

  @OneToMany(() => Screening, (screening) => screening.room)
  screenings: Screening[];
}
