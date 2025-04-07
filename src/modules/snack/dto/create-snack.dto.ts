import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, MaxLength, Min } from 'class-validator';
import { FREE_STR } from '@/constants/validation.constant';

export class CreateSnackDto {
  @ApiProperty({ example: 'Popcorn Large', description: 'Snack name' })
  @IsString()
  @MaxLength(FREE_STR)
  name: string;

  @ApiProperty({ example: 12.99, description: 'Snack price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 'Buttery popcorn in a large container',
    description: 'Snack description'
  })
  @IsString()
  @IsOptional()
  description?: string;
}