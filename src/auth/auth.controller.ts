import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { type Response, type Request } from 'express';
import { COOKIE_SAMESITE, COOKIE_SECURE } from '../common/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(data);

    // 토큰을 쿠키에 저장
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: COOKIE_SECURE,
      sameSite: COOKIE_SAMESITE as 'lax' | 'strict' | 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return {
      user,
      accessToken,
    };
  }

  // 토큰 재발급
  @Post('refresh')
  @HttpCode(HttpStatus.CREATED)
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    // const refreshToken = req.cookies ? req.cookies['refreshToken'] : undefined;
    const cookies = req.cookies as Record<string, string>;
    const refreshToken = cookies ? cookies['refreshToken'] : undefined;

    if (typeof refreshToken !== 'string') {
      throw new UnauthorizedException('RefreshToken이 없습니다.');
    }
    const response = await this.authService.refresh(refreshToken);

    // 새 RefreshToken을 쿠키에 저장
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: COOKIE_SECURE,
      sameSite: COOKIE_SAMESITE as 'lax' | 'strict' | 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return { accessToken: response.accessToken };
  }

  // 로그아웃
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    // RefreshToken 쿠키 제거
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: COOKIE_SECURE,
      sameSite: COOKIE_SAMESITE as 'lax' | 'strict' | 'none',
    });

    return this.authService.logout();
  }
}
