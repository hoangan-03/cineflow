import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsDate, IsUrl, IsOptional, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({
    example: 'Inception',
    description: 'Movie title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
    description: 'Movie description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Christopher Nolan',
    description: 'Movie director',
  })
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty({
    example: 148,
    description: 'Movie duration in minutes',
  })
  @IsNotEmpty()
  @IsInt()
  durationMinutes: number;

  @ApiProperty({
    example: '2010-07-16',
    description: 'Movie release date',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  releaseDate: Date;

  @ApiProperty({
    example: 'https://example.com/poster.jpg',
    description: 'Movie poster URL',
  })
  @IsNotEmpty()
  @IsUrl()
  posterUrl: string;

  @ApiProperty({
    example: 'https://example.com/trailer.mp4',
    description: 'Movie trailer URL',
  })
  @IsOptional()
  @IsUrl()
  trailerUrl?: string;

  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    description: 'Array of genre IDs',
  })
  @IsArray()
  @IsUUID(4, { each: true })
  genreIds: string[];
}