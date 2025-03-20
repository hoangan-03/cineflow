import {
    IsDefined,
    IsNotEmpty,
    IsEmail,
    MinLength,
    Validate,
    MaxLength,
  } from 'class-validator';
  import { IsUserAlreadyExist } from '@/modules/user/validators/is-user-already-exist.validator';
  import { ApiProperty } from '@nestjs/swagger';
import { EMAIL } from '@/constants/validation.constant';
  export class RegisterUserResponseDto {
    @ApiProperty({ 
      example: 'testuser',
      description: 'Username for registration'
    })
    @IsDefined()
    @IsNotEmpty()
    @MinLength(8)
    readonly username: string;
  
    @ApiProperty({ 
      example: 'test@example.com',
      description: 'Email address'
    })
    @IsDefined()
    @IsEmail()
    @MaxLength(EMAIL)
    @Validate(IsUserAlreadyExist)
    readonly email: string;

    constructor(email: string, username: string) {
      this.email = email;
      this.username = username;
    }
  }
  