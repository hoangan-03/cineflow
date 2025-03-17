import { ApiProperty } from "@nestjs/swagger";

export class TokenDataDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "JWT access token",
  })
  access_token: string;

  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "JWT refresh token",
  })
  refresh_token: string;
}

export class AuthTokenResponseDto {
  @ApiProperty({
    type: TokenDataDto,
    description: "Authentication token data",
  })
  data: TokenDataDto;
}
