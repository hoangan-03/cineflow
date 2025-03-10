import { Role } from '@/modules/auth/enums/role.enum';

export interface JwtPayload {
  sub: string;          
  email?: string;       
  username?: string;     
  iat?: number;         
  exp?: number;
  role?: Role;        
}