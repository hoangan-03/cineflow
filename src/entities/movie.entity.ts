import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "@/entities/base-class";
import { Screening } from "@/entities/screening.entity";
import { Review } from "@/entities/review.entity";
import { Genre } from "@/entities/genre.entity";

@Entity({ name: "movies" })
export class Movie extends BaseEntity {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Movie unique identifier"
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: "Inception",
    description: "Movie title"
  })
  @Column({ type: "varchar", length: 255 })
  title: string;

  @ApiProperty({
    example: "A thief who steals corporate secrets through the use of dream-sharing technology...",
    description: "Movie description"
  })
  @Column({ type: "text" })
  description: string;

  @ApiProperty({
    example: "Christopher Nolan",
    description: "Movie director"
  })
  @Column({ type: "varchar", length: 255 })
  director: string;

  @ApiProperty({
    example: 148,
    description: "Movie duration in minutes"
  })
  @Column({ type: "integer" })
  durationMinutes: number;

  @ApiProperty({
    example: "2010-07-16",
    description: "Movie release date"
  })
  @Column({ type: "date" })
  releaseDate: Date;

  @ApiProperty({
    example: "https://example.com/poster.jpg",
    description: "Movie poster URL"
  })
  @Column({ type: "text" })
  posterUrl: string;

  @ApiProperty({
    example: "https://example.com/trailer.mp4",
    description: "Movie trailer URL"
  })
  @Column({ type: "text", nullable: true })
  trailerUrl: string;

  @ApiProperty({
    type: () => [Genre],
    description: "Movie genres"
  })
  @ManyToMany(() => Genre)
  @JoinTable({
    name: "movie_genres",
    joinColumn: { name: "movie_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "genre_id", referencedColumnName: "id" }
  })
  genres: Genre[];

  @OneToMany(() => Screening, screening => screening.movie)
  screenings: Screening[];

  @OneToMany(() => Review, review => review.movie)
  reviews: Review[];
}