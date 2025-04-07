import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RedeemVoucherDto {
  @ApiProperty({
    example: 'ABC',
    description: 'Voucher code to redeem',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  code: string;
}