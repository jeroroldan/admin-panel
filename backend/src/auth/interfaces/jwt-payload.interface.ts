import { UserRole } from '../../users/entities/user.entity';

export interface JwtPayload {
  email: string;
  sub: string;
  role: UserRole;
}
