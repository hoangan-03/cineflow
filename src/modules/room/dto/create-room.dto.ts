import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsInt,
} from "class-validator";

export class CreateRoomDto {
  @ApiProperty({
    example: "Room 1",
    description: "Room name/number",
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 150,
    description: "Total seats in room",
  })
  @IsNotEmpty()
  @IsInt()
  totalSeats: number;

  @ApiProperty({
    example: "1b5a5c50-e31b-4812-9280-09a2a1ea481c",
    description: "ID of the cinema this room belongs to",
  })
  @IsNotEmpty()
  cinema_id: number;
}
