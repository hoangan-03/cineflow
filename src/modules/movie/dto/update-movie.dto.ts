import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDate, IsUrl, IsOptional, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMovieDto {
  @ApiProperty({
    example: 'Inception',
    description: 'Movie title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
    description: 'Movie description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Christopher Nolan',
    description: 'Movie director',
  })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({
    example: 148,
    description: 'Movie duration in minutes',
  })
  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @ApiProperty({
    example: '2010-07-16',
    description: 'Movie release date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  releaseDate?: Date;

  @ApiProperty({
    example: 'https://example.com/poster.jpg',
    description: 'Movie poster URL',
  })
  @IsOptional()
  @IsUrl()
  posterUrl?: string;

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
  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  genreIds?: string[];
}