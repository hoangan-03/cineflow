import { MAX_RATING, MIN_RATING } from "@/constants/validation.constant";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from "class-validator";

export class CreateReviewDto {
  @ApiProperty({
    example: "Great movie with amazing visuals",
    description: "Review title",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example:
      "This movie had incredible special effects and a compelling story...",
    description: "Review content",
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: 4.5,
    description: "Rating given in the review (out of 5)",
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(MIN_RATING)
  @Max(MAX_RATING)
  rating: number;

  @ApiProperty({
    example: true,
    description: "Whether this review contains spoilers",
  })
  @IsOptional()
  @IsBoolean()
  containsSpoilers?: boolean = false;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID of the movie being reviewed",
  })
  @IsNotEmpty()
  movie_id: number;
}
