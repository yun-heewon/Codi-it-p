import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // 본인의 PrismaService 경로에 맞게 수정하세요!
import { UserType } from '@prisma/client';

interface AuthUser {
  id: string;
  email: string;
  type: UserType;
}

interface AuthorizedRequest extends Request {
  user?: AuthUser;
  storeId?: string;
}

@Injectable()
export class SellerStoreGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthorizedRequest>();
    const user = request.user;

    // 1. 일단 판매자인지 먼저 확인 (기본 방어)
    if (!user || user.type !== 'SELLER') {
      throw new ForbiddenException('판매자 권한이 필요합니다.');
    }

    // 2. 이 판매자의 상점이 있는지 DB에서 찾기
    const sellerStore = await this.prisma.store.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!sellerStore) {
      throw new ForbiddenException('연결된 상점 정보가 없습니다.');
    }

    // NestJS의 request 객체에 storeId를 담아둡니다.
    request['storeId'] = sellerStore.id;

    return true;
  }
}
