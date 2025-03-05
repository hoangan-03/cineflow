import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsBoolean, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateCinemaDto {
  @ApiProperty({
    example: 'Cineworld',
    description: 'Cinema name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '123 Main Street, Cityville',
    description: 'Cinema address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Cinema phone number',
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Cinema image URL',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the cinema has parking',
  })
  @IsOptional()
  @IsBoolean()
  hasParking?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the cinema has food court',
  })
  @IsOptional()
  @IsBoolean()
  hasFoodCourt?: boolean;
}