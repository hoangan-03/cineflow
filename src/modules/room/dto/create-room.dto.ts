import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class CreateTheaterDto {
  @ApiProperty({
    example: 'Room 1',
    description: 'Room name/number',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 150,
    description: 'Total seats in room',
  })
  @IsNotEmpty()
  @IsInt()
  totalSeats: number;

  @ApiProperty({
    example: true,
    description: 'Whether the room supports 3D',
  })
  @IsOptional()
  @IsBoolean()
  has3D?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the room has IMAX',
  })
  @IsOptional()
  @IsBoolean()
  hasIMAX?: boolean;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the cinema this room belongs to',
  })
  @IsNotEmpty()
  @IsUUID(4)
  cinema_id: string;
}