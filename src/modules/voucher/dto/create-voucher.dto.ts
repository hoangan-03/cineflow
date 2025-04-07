import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { FREE_STR } from '@/constants/validation.constant';

export class CreateVoucherDto {
  @ApiProperty({ example: 'Summer Discount', description: 'Voucher name' })
  @IsString()
  @MaxLength(FREE_STR)
  name: string;

  @ApiProperty({ example: '10%', description: 'Discount amount or percentage' })
  @IsString()
  @MaxLength(10)
  discount: string;

  @ApiProperty({ 
    example: '2024-12-31', 
    description: 'Voucher expiration date' 
  })
  @IsDate()
  @Type(() => Date)
  exp_date: Date;
}