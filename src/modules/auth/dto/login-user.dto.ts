import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EMAIL } from "@/constants/validation.constant";
export class LoginUserDTO {
  @ApiProperty({
    example: "teststaffemail@gmail.com",
    description: "Email address",
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(EMAIL)
  email: string;

  @ApiProperty({
    example: "Password123@",
    description: "Password",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
