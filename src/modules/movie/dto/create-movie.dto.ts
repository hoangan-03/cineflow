import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsDate,
  IsOptional,
  Max,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateMovieDto {
  @ApiProperty({
    example: "Inception",
    description: "Movie title",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

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
  posterUrl?: string;

  @ApiProperty({
    example: "https://example.com/trailer.mp4",
    description: "Movie trailer URL",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @ApiProperty({
    example: "PG-13",
    description: "Movie rating",
  })
  @IsString()
  @Max(5)
  @IsNotEmpty()
  rated: string;
}
