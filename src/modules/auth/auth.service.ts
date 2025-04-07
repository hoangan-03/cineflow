import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@/entities/user.entity";
import { RegisterUserDto } from "@/modules/auth/dto/register-user.dto";
import { JwtPayload } from "@/modules/auth/interfaces/jwt-payload.interface";
import { UserService } from "@/modules/user/user.service";
import { AuthTokenResponseDto } from "@/modules/auth/dto/auth-token-response.dto";
import { AuthConstant } from "@/modules/auth/constant";
import { Response } from "express";
import { checkPassword, hashPassword } from "@/utils/hash-password";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(signUp: RegisterUserDto): Promise<User> {
    try {
      const hashedPassword = await hashPassword(signUp.password);
      const user = await this.userService.create({
        ...signUp,
        password: hashedPassword,
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof Error) {
        if ("code" in error && (error as any).code === "23505") {
          throw new BadRequestException("Email or username already exists.");
        }
        throw new InternalServerErrorException(
          error.message || "Registration failed."
        );
      }
      throw new InternalServerErrorException("An unexpected error occurred.");
    }
  }

  async login(email: string, password: string): Promise<AuthTokenResponseDto> {
    let user: User;

    try {
      user = await this.userService.getOne({ where: { email } });
    } catch (err) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    if (!(await checkPassword(password, user.password || ""))) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    return this.generateTokens(user);
  }

  generateTokens(user: User): AuthTokenResponseDto {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: AuthConstant.ACCESS_TOKEN_EXPIRATION,
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: AuthConstant.REFRESH_TOKEN_EXPIRATION,
    });

    return {
      data: {
        access_token,
        refresh_token,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokenResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        ignoreExpiration: false, 
      });
  
      const user = await this.userService.getOne({
        where: { id: payload.sub },
      });
  
      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }
  
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Could not refresh token');
    }
  }

  getUserProfile(user: User): User {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;

    try {
      user = await this.userService.getOne({
        where: { id: payload.sub },
      });
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with ID: ${payload.sub}`
      );
    }

    return user;
  }

  logout(response: Response): { message: string } {
    // Clear authentication cookies
    response.clearCookie("token", {
      httpOnly: true,
      signed: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Remove the authorization header
    response.removeHeader("Authorization");

    return { message: "Logged out successfully" };
  }
}
