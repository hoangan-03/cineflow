import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class CreateBookingDTO {
  @ApiProperty({
    example: '00259475-3e2b-45e3-a39b-6775954d1599',
    description: 'ID of the screening being booked',
  })
  @IsNotEmpty()
  @IsUUID(4)
  screening_id: string;

  @ApiProperty({
    example: ['ab0c827b-8516-4604-bfbe-b055a6de2c1f'],
    description: 'IDs of the seats being booked',
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID(4, { each: true })
  seatIds: string[];
}