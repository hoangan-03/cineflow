import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the screening being booked',
  })
  @IsNotEmpty()
  @IsUUID(4)
  screening_id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the payment method used',
  })
  @IsNotEmpty()
  @IsUUID(4)
  payment_method_id: string;

  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
    description: 'IDs of the seats being booked',
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID(4, { each: true })
  seatIds: string[];
}