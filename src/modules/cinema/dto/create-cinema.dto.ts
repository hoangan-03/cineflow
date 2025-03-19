import { FREE_STR, LONG_STR, PHONE, URL_STR } from "@/constants/validation.constant";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
} from "class-validator";

export class CreateCinemaDto {
  @ApiProperty({
    example: "Cineworld",
    description: "Cinema name",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(FREE_STR)
  name: string;

  @ApiPropertyOptional({
    example: "John Alice",
    description: "Cinema name",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(FREE_STR)
  owner?: string;

  @ApiProperty({
    example: "123 Main Street, Cityville",
    description: "Cinema address",
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(LONG_STR)
  address: string;

  @ApiProperty({
    example: "+1234567890",
    description: "Cinema phone number",
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  @MaxLength(PHONE)
  phoneNumber: string;

  
  @ApiPropertyOptional({
    example: "https://example.com/image.jpg",
    description: "Cinema image URL",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(URL_STR)
  imageUrl?: string;
}
