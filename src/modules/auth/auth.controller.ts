import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  Res,
  UnauthorizedException,
  Req,
  HttpCode,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiCookieAuth,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthUser } from "@/modules/user/decorators/user.decorator";
import { User } from "@/entities/user.entity";
import { AuthService } from "@/modules/auth/auth.service";
import { RegisterUserDto } from "@/modules/auth/dto/register-user.dto";
import { JWTAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "@/modules/auth/guards/local-auth.guard";
import { SessionAuthGuard } from "@/modules/auth/guards/session-auth.guard";
import { TokenInterceptor } from "@/modules/auth/interceptors/token.interceptor";
import { LoginUserDTO } from "@/modules/auth/dto/login-user.dto";
import { AuthTokenResponseDto } from "@/modules/auth/dto/auth-token-response.dto";
import { RegisterUserResponseDto } from "@/modules/auth/dto/register-user-response.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("auth")
@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: "User successfully registered",
    type: RegisterUserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid input data",
  })
  async register(
    @Body() signUp: RegisterUserDto
  ): Promise<RegisterUserResponseDto> {
    const user = await this.authService.register(signUp);
    return new RegisterUserResponseDto(user.email, user.username);
  }

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: "Login with email/username and password" })
  @ApiBody({ type: LoginUserDTO })
  @ApiResponse({
    status: 200,
    description: "User successfully logged in",
    type: AuthTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid credentials",
  })
  async login(
    @Body() credentials: { email: string; password: string }
  ): Promise<AuthTokenResponseDto> {
    return this.authService.login(credentials.email, credentials.password);
  }

  @Post("refresh")
  @Public()
  @UseInterceptors(TokenInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: "Get new access token using refresh token from cookie",
  })
  @ApiCookieAuth("refresh_token")
  @ApiResponse({
    status: 200,
    description: "New tokens generated successfully",
    type: AuthTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Invalid or expired refresh token",
  })
  async refresh(@Req() request: Request): Promise<AuthTokenResponseDto> {
    const refreshToken = request.signedCookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is missing");
    }

    return this.authService.refreshToken(refreshToken);
  }

  @Get("/me")
  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "Returns the current authenticated user",
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  me(@AuthUser() user: User): User {
    if (!user) {
      throw new UnauthorizedException("Authentication required");
    }
    return this.authService.getUserProfile(user);
  }

  @Post("logout")
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Logout the current user" })
  @ApiResponse({
    status: 200,
    description: "User successfully logged out",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Logged out successfully",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or missing token",
  })
  async logout(
    @Res({ passthrough: true }) response: Response
  ): Promise<{ message: string }> {
    return this.authService.logout(response);
  }
}
