import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Response } from "express";
import { AuthService } from "@/modules/auth/auth.service";
import { User } from "@/entities/user.entity";
import { AuthConstant } from "@/modules/auth/constant/auth.constant";

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data) return data;

        const response = context.switchToHttp().getResponse<Response>();

        let user: User;

        // If it's a response like AuthTokenResponseDto
        if (data.data && data.data.access_token) {
          // For login/refresh endpoints which directly return tokens
          response.setHeader(
            "Authorization",
            `Bearer ${data.data.access_token}`
          );

          // Set access token as httpOnly cookie
          response.cookie("token", data.data.access_token, {
            httpOnly: true,
            signed: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: AuthConstant.ACCESS_TOKEN_EXPIRATION * 1000, // Convert to milliseconds
          });

          // Also set refresh token as httpOnly cookie
          response.cookie("refresh_token", data.data.refresh_token, {
            httpOnly: true,
            signed: true,
            sameSite: "lax", // Change from "strict" to "lax" to allow cross-site requests
            secure: process.env.NODE_ENV === "production",
            maxAge: AuthConstant.REFRESH_TOKEN_EXPIRATION * 1000, // Convert to milliseconds
            path: "/api/auth/refresh", // Restrict to refresh endpoint only
          });

          return data;
        }

        // If it's a user object directly
        if (data && data.id) {
          user = data;
          const tokens = this.authService.generateTokens(user);

          response.setHeader(
            "Authorization",
            `Bearer ${tokens.data.access_token}`
          );

          // Set access token
          response.cookie("token", tokens.data.access_token, {
            httpOnly: true,
            signed: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: AuthConstant.ACCESS_TOKEN_EXPIRATION * 1000,
          });

          // Set refresh token
          response.cookie("refresh_token", tokens.data.refresh_token, {
            httpOnly: true,
            signed: true,
            sameSite: "lax", // Change from "strict" to "lax"
            secure: process.env.NODE_ENV === "production",
            maxAge: AuthConstant.REFRESH_TOKEN_EXPIRATION * 1000,
            path: "/api/auth/refresh",
          });
        }

        return data;
      })
    );
  }
}
