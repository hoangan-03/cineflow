import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNumber,
  IsDate,
  IsBoolean,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateScreeningDto {
  @ApiProperty({
    example: "2024-05-15T18:30:00Z",
    description: "Screening start time",
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startTime?: Date;

  @ApiProperty({
    example: "2D",
    description: "Screening format (2D, 3D, IMAX)",
  })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiProperty({
    example: 12.99,
    description: "Ticket price for this screening",
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    example: true,
    description: "Whether the screening is available for booking",
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID of the movie being screened",
  })
  @IsOptional()
  movie_id?: number;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID of the room where the screening takes place",
  })
  @IsOptional()
  theater_id?: number;
}
