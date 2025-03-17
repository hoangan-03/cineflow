import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsPhoneNumber } from "class-validator";

export class UpdateCinemaDto {
  @ApiPropertyOptional({
    example: "Cineworld",
    description: "Cinema name",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: "John Alice",
    description: "Cinema name",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  owner: string;

  @ApiPropertyOptional({
    example: "123 Main Street, Cityville",
    description: "Cinema address",
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: "+1234567890",
    description: "Cinema phone number",
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: "https://example.com/image.jpg",
    description: "Cinema image URL",
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
