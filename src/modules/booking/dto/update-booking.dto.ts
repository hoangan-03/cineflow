import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { BookingStatus } from '../enums/booking-status.enum';

export class UpdateBookingDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the payment method used',
  })
  @IsOptional()
  @IsUUID(4)
  payment_method_id?: string;

  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    description: 'Current booking status',
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}

