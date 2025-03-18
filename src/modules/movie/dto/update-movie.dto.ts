import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsInt,
  IsDate,
  IsUrl,
  IsOptional,
  IsArray,
  IsUUID,
  IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";
import { Genre } from "@/entities/genre.entity";

export class UpdateMovieDto {
  @ApiProperty({
    example: "Inception",
    description: "Movie title",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: "Array of genre IDs",
  })
  @IsNotEmpty()
  genres: Genre[];

  @ApiProperty({
    example:
      "A thief who steals corporate secrets through the use of dream-sharing technology...",
    description: "Movie description",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: "Christopher Nolan",
    description: "Movie director",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({
    example: 148,
    description: "Movie duration in minutes",
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  duration?: number;

  @ApiProperty({
    example: "2010-07-16",
    description: "Movie release date",
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  releaseDate?: Date;

  @ApiProperty({
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
}
