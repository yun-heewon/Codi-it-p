import { UserType } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  type: UserType;
}
