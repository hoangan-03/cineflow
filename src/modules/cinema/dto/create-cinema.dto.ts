import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsBoolean, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateCinemaDto {
  @ApiProperty({
    example: 'Cineworld',
    description: 'Cinema name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '123 Main Street, Cityville',
    description: 'Cinema address',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Cinema phone number',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Cinema image URL',
    required: false,
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