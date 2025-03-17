import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsPhoneNumber,
} from "class-validator";

export class CreateCinemaDto {
  @ApiProperty({
    example: "Cineworld",
    description: "Cinema name",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: "John Alice",
    description: "Cinema name",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  owner: string;

  @ApiProperty({
    example: "123 Main Street, Cityville",
    description: "Cinema address",
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: "+1234567890",
    description: "Cinema phone number",
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiPropertyOptional({
    example: "https://example.com/image.jpg",
    description: "Cinema image URL",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
