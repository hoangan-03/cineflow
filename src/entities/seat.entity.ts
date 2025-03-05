import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
  } from "typeorm";
  import { ApiProperty } from "@nestjs/swagger";
  import { BaseEntity } from "@/entities/base-class";
  import { Theater } from "@/entities/theater.entity";
  
  @Entity({ name: "seats" })
  export class Seat extends BaseEntity {
    @ApiProperty({
      example: "123e4567-e89b-12d3-a456-426614174000",
      description: "Seat unique identifier"
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ApiProperty({
      example: "A",
      description: "Seat row"
    })
    @Column({ type: "varchar", length: 5 })
    row: string;
  
    @ApiProperty({
      example: 10,
      description: "Seat number"
    })
    @Column({ type: "integer" })
    number: number;
  
    @ApiProperty({
      example: "standard",
      description: "Seat type (standard, vip, accessible)"
    })
    @Column({ type: "varchar", length: 20, default: "standard" })
    type: string;
  
    @ApiProperty({
      type: () => Theater,
      description: "The theater this seat belongs to"
    })
    @ManyToOne(() => Theater)
    @JoinColumn({ name: "theater_id" })
    theater: Theater;
  
    @Column({ type: "uuid" })
    theater_id: string;
  }