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
  import { Movie } from "@/entities/movie.entity";
  import { Theater } from "@/entities/theater.entity";
  import { Booking } from "@/entities/booking.entity";
  
  @Entity({ name: "screenings" })
  export class Screening extends BaseEntity {
    @ApiProperty({
      example: "123e4567-e89b-12d3-a456-426614174000",
      description: "Screening unique identifier"
    })
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @ApiProperty({
      example: "2024-05-15T18:30:00Z",
      description: "Screening start time"
    })
    @Column({ type: "timestamp" })
    startTime: Date;
  
    @ApiProperty({
      example: "2D",
      description: "Screening format (2D, 3D, IMAX)"
    })
    @Column({ type: "varchar", length: 10 })
    format: string;
  
    @ApiProperty({
      example: 12.99,
      description: "Ticket price for this screening"
    })
    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;
  
    @ApiProperty({
      example: true,
      description: "Whether the screening is available for booking"
    })
    @Column({ type: "boolean", default: true })
    isAvailable: boolean;
  
    @ApiProperty({
      type: () => Movie,
      description: "The movie being screened"
    })
    @ManyToOne(() => Movie, movie => movie.screenings)
    @JoinColumn({ name: "movie_id" })
    movie: Movie;
  
    @Column({ type: "uuid" })
    movie_id: string;
  
    @ApiProperty({
      type: () => Theater,
      description: "The theater where the screening takes place"
    })
    @ManyToOne(() => Theater, theater => theater.screenings)
    @JoinColumn({ name: "theater_id" })
    theater: Theater;
  
    @Column({ type: "uuid" })
    theater_id: string;
  
    @OneToMany(() => Booking, booking => booking.screening)
    bookings: Booking[];
  }