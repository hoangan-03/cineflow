import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class ValidateVoucherDto {
  @ApiProperty({ 
    example: 'ABC123', 
    description: 'Voucher code to validate' 
  })
  @IsString()
  @MaxLength(10)
  code: string;
}