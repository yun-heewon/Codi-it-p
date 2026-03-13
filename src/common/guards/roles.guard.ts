import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';

interface AuthUser {
  id: string;
  email: string;
  type: UserType;
}

interface AuthorizedRequest extends Request {
  user?: AuthUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthorizedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('로그인이 필요합니다.');
    }

    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );

    if (user.type !== requiredRole) {
      throw new ForbiddenException(`${requiredRole} 권한이 필요합니다.`);
    }

    return true;
  }
}
