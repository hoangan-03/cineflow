import { PartialType } from '@nestjs/swagger';
import { CreateVoucherDto } from './create-voucher.dto';

/**
 * DTO for updating a voucher
 * 
 * Makes all fields from CreateVoucherDto optional
 */
export class UpdateVoucherDto extends PartialType(CreateVoucherDto) {}