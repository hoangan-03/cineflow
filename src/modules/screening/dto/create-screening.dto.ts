import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsBoolean,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateScreeningDto {
  @ApiProperty({
    example: "2025-04-07 10:00:00",
    description: "Screening start time",
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({
    example: "2D",
    description: "Screening format (2D, 3D, IMAX)",
  })
  @IsNotEmpty()
  @IsString()
  format: string;

  @ApiProperty({
    example: 12.99,
    description: "Ticket price for this screening",
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: true,
    description: "Whether the screening is available for booking",
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({
    example: "1",
    description: "ID of the movie being screened",
  })
  @IsNotEmpty()
  movie_id: number;

  @ApiProperty({
    example: "1",
    description: "ID of the room where the screening takes place",
  })
  @IsNotEmpty()
  room_id: number;
}
