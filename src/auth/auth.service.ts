import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { UserRepository } from '../users/user.repository';
import { LoginResponseDto } from './dtos/login-response.dto';
import * as bcrypt from 'bcrypt';
import { AccessTokenPayload } from './interfaces/access-token-payload.interface';
import { RefreshTokenPayload } from './interfaces/refresh-token-payload.interface';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../common/constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  generateAccessToken(payload: AccessTokenPayload) {
    return jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: '10h', // 10시간 유효
    });
  }

  generateRefreshToken(payload: RefreshTokenPayload) {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: '7d', // 7일 유효
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    if (typeof decoded === 'string') {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }

    if (!decoded.sub || !decoded.email || !decoded.type) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }

    return decoded as AccessTokenPayload;
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

    if (typeof decoded === 'string') {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }

    if (!decoded.sub) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }

    return decoded as RefreshTokenPayload;
  }

  async login(
    data: LoginDto,
  ): Promise<LoginResponseDto & { refreshToken: string }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid)
      throw new NotFoundException('이메일 또는 비밀번호가 올바르지 않습니다.');

    // jwt 발급
    const accessToken = this.generateAccessToken({
      sub: user.id,
      email: user.email,
      type: user.type,
    });

    const refreshToken = this.generateRefreshToken({ sub: user.id });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        points: user.points ?? 0,
        image: user.image,
        grade: {
          id: user.grade.id,
          name: user.grade.name,
          rate: user.grade.rate,
          minAmount: user.grade.minAmount,
        },
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.verifyRefreshToken(refreshToken);

      const user = await this.userRepository.getUserById(payload.sub);
      if (!user) throw new NotFoundException('탈퇴했거나 없는 사용자입니다.');

      // accessToken 재발급
      const accessToken = this.generateAccessToken({
        sub: user.id,
        email: user.email,
        type: user.type,
      });

      // 새 RefreshToken 발급
      const newRefreshToken = this.generateRefreshToken({ sub: user.id });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('JWT refresh 실패:', error);
      throw new NotFoundException('토큰 재발급 실패');
    }
  }

  logout(): { message: string } {
    return { message: '성공적으로 로그아웃되었습니다.' };
  }
}
