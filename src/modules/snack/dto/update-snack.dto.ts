import { PartialType } from '@nestjs/swagger';
import { CreateSnackDto } from './create-snack.dto';

/**
 * DTO for updating a snack
 * 
 * Makes all fields from CreateSnackDto optional
 */
export class UpdateSnackDto extends PartialType(CreateSnackDto) {}