import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_ACCESS_SECRET } from '../../common/constants';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Request } from 'express';
import { UserRepository } from '../../users/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const fromCookie = req.cookies?.['accessToken'] as unknown;
          if (typeof fromCookie === 'string') return fromCookie;

          const formQuery = req.query?.['token'] as unknown;
          if (typeof formQuery === 'string') return formQuery;

          return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.getUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('인증되지 않은 사용자입니다.');
    }

    return {
      id: user.id,
      email: user.email,
      type: user.type,
      storeId: user.Store?.id,
    };
  }
}
