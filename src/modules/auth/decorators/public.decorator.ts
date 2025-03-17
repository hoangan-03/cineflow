import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Public decorator to mark routes that don't require authentication
 * 
 * Usage example:
 * @Public()
 * @Get()
 * findAll() {...}
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);