import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDate, IsBoolean, IsUUID, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateScreeningDto {
  @ApiProperty({
    example: '2024-05-15T18:30:00Z',
    description: 'Screening start time',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({
    example: '2D',
    description: 'Screening format (2D, 3D, IMAX)',
  })
  @IsNotEmpty()
  @IsString()
  format: string;

  @ApiProperty({
    example: 12.99,
    description: 'Ticket price for this screening',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: true,
    description: 'Whether the screening is available for booking',
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the movie being screened',
  })
  @IsNotEmpty()
  @IsUUID(4)
  movie_id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the room where the screening takes place',
  })
  @IsNotEmpty()
  @IsUUID(4)
  theater_id: string;
}