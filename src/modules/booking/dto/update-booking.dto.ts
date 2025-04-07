import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
    IsEnum,
  IsNumber,
  IsString,
  IsPositive,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { BookingStatus } from "../enums/booking-status.enum";

export class UpdateBookingDTO {
  @ApiProperty({
    example: "INV-12345",
    description: "Booking reference number",
    required: false,
  })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiProperty({
    example: 2,
    description: "Number of tickets booked",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  ticketCount?: number;

  @ApiProperty({
    example: 25.98,
    description: "Total amount paid",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalAmount?: number;

  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    description: "Current booking status",
    required: false,
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({
    example: "1",
    description: "User ID (only for staff use)",
    required: false,
  })
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    example: "1",
    description: "Screening ID (only for staff use)",
    required: false,
  })
  @IsOptional()
  screening_id?: string;
}
