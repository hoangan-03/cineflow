import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsInt, IsOptional } from "class-validator";

export class UpdateRoomDto {
  @ApiPropertyOptional({
    example: "Room 1",
    description: "Room name/number",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 150,
    description: "Total seats in room",
  })
  @IsOptional()
  @IsInt()
  totalSeats?: number;

  @ApiPropertyOptional({
    example: "1b5a5c50-e31b-4812-9280-09a2a1ea481c",
    description: "ID of the cinema this room belongs to",
  })
  @IsOptional()
  cinema_id?: number;
}
