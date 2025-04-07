import { MIN_RATING, MAX_RATING } from "@/constants/validation.constant";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from "class-validator";

export class UpdateReviewDto {
  @ApiProperty({
    example: "Great movie with amazing visuals",
    description: "Review title",
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example:
      "This movie had incredible special effects and a compelling story...",
    description: "Review content",
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    example: 4.5,
    description: "Rating given in the review (out of 5)",
  })
  @IsOptional()
  @IsNumber()
  @Min(MIN_RATING)
  @Max(MAX_RATING)
  rating?: number;

  @ApiProperty({
    example: true,
    description: "Whether this review contains spoilers",
  })
  @IsOptional()
  @IsBoolean()
  containsSpoilers?: boolean;

  @ApiProperty({
    example: "1",
    description: "ID of the movie being reviewed",
  })
  @IsOptional()
  movie_id?: number;
}
