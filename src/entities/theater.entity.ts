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

@Entity({ name: "theaters" })
export class Theater extends BaseEntity {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Theater unique identifier"
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: "Theater 1",
    description: "Theater name/number"
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
    example: true,
    description: "Whether the theater supports 3D"
  })
  @Column({ type: "boolean", default: false })
  has3D: boolean;

  @ApiProperty({
    example: true,
    description: "Whether the theater has IMAX"
  })
  @Column({ type: "boolean", default: false })
  hasIMAX: boolean;

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