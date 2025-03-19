import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsDate,
  IsOptional,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";
import { Genre } from "@/entities/genre.entity";
import { URL_STR } from "@/constants/validation.constant";

export class CreateMovieDto {
  @ApiProperty({
    example: "Inception",
    description: "Movie title",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: "Array of genre IDs",
  })
  @IsNotEmpty()
  genres: number[];

  @ApiProperty({
    example:
      "A thief who steals corporate secrets through the use of dream-sharing technology...",
    description: "Movie description",
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: "Christopher Nolan",
    description: "Movie director",
  })
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty({
    example: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    description: "Movie cast",
  })
  @IsNotEmpty()
  cast: string[];

  @ApiProperty({
    example: 148,
    description: "Movie duration in minutes",
  })
  @IsNotEmpty()
  @IsInt()
  duration: number;

  @ApiProperty({
    example: "2010-07-16",
    description: "Movie release date",
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  releaseDate: Date;

  @ApiPropertyOptional({
    example: "https://example.com/poster.jpg",
    description: "Movie poster URL",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(URL_STR)
  posterUrl?: string;

  @ApiProperty({
    example: "https://example.com/trailer.mp4",
    description: "Movie trailer URL",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(URL_STR)
  trailerUrl?: string;

  @ApiProperty({
    example: "PG-13",
    description: "Movie rating",
  })
  @IsString()
  @IsNotEmpty()
  rated: string;
}
