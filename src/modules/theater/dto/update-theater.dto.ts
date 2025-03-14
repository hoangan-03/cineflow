import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class UpdateTheaterDto {
  @ApiProperty({
    example: 'Room 1',
    description: 'Room name/number',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 150,
    description: 'Total seats in theater',
  })
  @IsOptional()
  @IsInt()
  totalSeats?: number;

  @ApiProperty({
    example: true,
    description: 'Whether the theater supports 3D',
  })
  @IsOptional()
  @IsBoolean()
  has3D?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the theater has IMAX',
  })
  @IsOptional()
  @IsBoolean()
  hasIMAX?: boolean;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the cinema this theater belongs to',
  })
  @IsOptional()
  @IsUUID(4)
  cinema_id?: string;
}