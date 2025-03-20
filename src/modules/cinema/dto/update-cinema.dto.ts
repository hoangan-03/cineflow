import { FREE_STR, PHONE, URL_STR } from "@/constants/validation.constant";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsPhoneNumber, MaxLength } from "class-validator";

export class UpdateCinemaDto {
  @ApiPropertyOptional({
    example: "Cineworld",
    description: "Cinema name",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(FREE_STR)
  name?: string;

  @ApiPropertyOptional({
    example: "John Alice",
    description: "Cinema name",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(FREE_STR)
  owner?: string;

  @ApiPropertyOptional({
    example: "123 Main Street, Cityville",
    description: "Cinema address",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: "+1234567890",
    description: "Cinema phone number",
    nullable: true,
  })
  @IsOptional()
  @MaxLength(PHONE)
  phoneNumber?: string;

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
