import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Movie } from "@/entities/movie.entity";

@Entity({ name: "genres" })
export class Genre {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Genre unique identifier"
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: "Sci-Fi",
    description: "Genre name"
  })
  @Column({ type: "varchar", length: 50, unique: true })
  name: string;

  @ManyToMany(() => Movie, movie => movie.genres)
  movies: Movie[];
}