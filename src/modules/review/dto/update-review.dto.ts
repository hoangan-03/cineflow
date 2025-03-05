import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, IsUUID, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({
    example: 'Great movie with amazing visuals',
    description: 'Review title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'This movie had incredible special effects and a compelling story...',
    description: 'Review content',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    example: 4.5,
    description: 'Rating given in the review (out of 5)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiProperty({
    example: true,
    description: 'Whether this review contains spoilers',
  })
  @IsOptional()
  @IsBoolean()
  containsSpoilers?: boolean;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the movie being reviewed',
  })
  @IsOptional()
  @IsUUID(4)
  movie_id?: string;
}