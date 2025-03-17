import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum, IsDateString } from "class-validator";
import { Gender } from "../enums/gender.enum";

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: "+1234567890",
    description: "User phone number",
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: "1990-01-01",
    description: "User date of birth",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dob?: Date;

  @ApiPropertyOptional({
    enum: Gender,
    enumName: "Gender",
    example: Gender.MALE,
    description: "User gender",
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    example: "https://example.com/profile.jpg",
    description: "User profile image URL",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @ApiPropertyOptional({
    example: "47 ABC Street, XYZ City",
    description: "User address",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  address?: string;
}
