import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { UserType } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../common/constants';

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  email: string;
  type: UserType;
}

export interface RefreshTokenPayload extends JwtPayload {
  sub: string;
}

// AccessToken 발급
export function generateAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: '10h', // 10시간 유효
  });
}

// RefreshToken 발급
export function generateRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d', // 7일 유효
  });
}

// AccessToken 검증
export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

  if (typeof decoded === 'string') {
    throw new UnauthorizedException('토큰이 유효하지 않습니다.');
  }

  if (!decoded.sub || !decoded.email || !decoded.type) {
    throw new UnauthorizedException('토큰이 유효하지 않습니다.');
  }

  return decoded as AccessTokenPayload;
}

// RefreshToken 검증
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

  if (typeof decoded === 'string') {
    throw new UnauthorizedException('토큰이 유효하지 않습니다.');
  }

  if (!decoded.sub) {
    throw new UnauthorizedException('토큰이 유효하지 않습니다.');
  }

  return decoded as RefreshTokenPayload;
}
