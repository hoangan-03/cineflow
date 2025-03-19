import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BaseEntity } from "@/entities/base-class";
import { Room } from "@/entities/room.entity";
import { Max, MaxLength, Min, MinLength } from "class-validator";
import {
  FREE_STR,
  PHONE,
  LONG_STR,
  URL_STR,
  MIN_NAME,
} from "@/constants/validation.constant";

@Entity({ name: "cinemas" })
export class Cinema extends BaseEntity {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Cinema unique identifier",
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @MaxLength(FREE_STR)
  @MinLength(MIN_NAME)
  @ApiProperty({
    example: "CGV",
    description: "Cinema name",
  })
  @Column({ type: "varchar", length: FREE_STR, default: "CGV" })
  name: string;

  @MaxLength(FREE_STR)
  @MinLength(MIN_NAME)
  @ApiPropertyOptional({
    example: "John Alice",
    description: "Cinema name",
  })
  @Column({ type: "varchar", length: FREE_STR, nullable: true })
  owner?: string;

  @MaxLength(LONG_STR)
  @ApiProperty({
    example: "123 Main Street, Cityville",
    description: "Cinema address",
  })
  @Column({ type: "text" })
  address: string;

  @MaxLength(PHONE)
  @ApiPropertyOptional({
    example: "+1234567890",
    description: "Cinema phone number",
  })
  @Column({ type: "varchar", length: PHONE, nullable: true })
  phoneNumber: string;

  @MaxLength(URL_STR)
  @ApiPropertyOptional({
    example: "https://example.com/image.jpg",
    description: "Cinema image URL",
  })
  @Column({ type: "text", nullable: true })
  imageUrl: string;

  @OneToMany(() => Room, (room) => room.cinema)
  rooms: Room[];
}
