import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany
  } from "typeorm";
  import { ApiProperty } from "@nestjs/swagger";
  import { BaseEntity } from "@/entities/base-class";
  import { Room } from "@/entities/room.entity";
import { Max, Min } from "class-validator";
  
  @Entity({ name: "cinemas" })
  export class Cinema extends BaseEntity {
    @ApiProperty({
      example: "123e4567-e89b-12d3-a456-426614174000",
      description: "Cinema unique identifier"
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ApiProperty({
      example: "CGV",
      description: "Cinema name"
    })
    @Column({ type: "varchar", length: 255, nullable: false, default: "CGV" })
    name: string;

    @ApiProperty({
      example: "John Alice",
      description: "Cinema name"
    })
    @Column({ type: "varchar", length: 255, nullable: true })
    owner: string;
  
    @ApiProperty({
      example: "123 Main Street, Cityville",
      description: "Cinema address"
    })
    @Column({ type: "text", nullable: true })
    address: string;
  
    @Min(8)
    @Max(15)
    @ApiProperty({
      example: "+1234567890",
      description: "Cinema phone number"
    })
    @Column({ type: "varchar", length: 15, nullable: true })
    phoneNumber: string;
  
    @ApiProperty({
      example: "https://example.com/image.jpg",
      description: "Cinema image URL"
    })
    @Column({ type: "text", nullable: true })
    imageUrl: string;
  
    @OneToMany(() => Room, room => room.cinema)
    rooms: Room[];
  }