import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Movie } from "@/entities/movie.entity";
import { FREE_STR } from "@/constants/validation.constant";

@Entity({ name: "genres" })
export class Genre {
  @ApiProperty({
    example: 1,
    description: "Genre unique identifier"
  })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: "Sci-Fi",
    description: "Genre name"
  })
  @Column({ type: "varchar", length: FREE_STR, unique: true })
  name: string;

  @ManyToMany(() => Movie, movie => movie.genres)
  movies: Movie[];
}