import { Role } from "@/modules/auth/enums/role.enum";

export interface JwtPayload {
  sub: number;
  email?: string;
  username?: string;
  iat?: number;
  exp?: number;
  role?: Role;
}
