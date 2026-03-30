import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GetUser } from 'src/auth/get-user-decorator';
import { NotificationResponseDto } from './dtos/response.dto';
import type { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

// interface SseResponse extends Response {
//   flush?: () => void;
// }

// const PING_INTERVAL_MS = 30000;
// const ALLOWED_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3001';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('sse')
  sseConnect(
    @Query('token') token: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    {
      if (!token) {
        throw new UnauthorizedException('토큰이 없습니다.');
      }
      try {
        // 1. 토큰 해독 및 유저 ID 추출
        const payload = this.jwtService.verify<JwtPayload>(token);
        const userId = payload.sub;

        if (!userId) {
          throw new UnauthorizedException('유저 정보가 토큰에 없습니다.');
        }

        console.log(`[SSE] 유저 ${userId} 연결 시도`);

        // 2. SSE 헤더 설정
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': 'http://localhost:3001', // 프론트 주소
          'Access-Control-Allow-Credentials': 'true',
        });

        // 3. 클라이언트 등록 및 연결 확인 메시지 전송
        const removeClient = this.notificationService.addClient(
          userId,
          res as any,
        );
        res.write(`event: connected\n`);
        res.write(
          `data: ${JSON.stringify({ message: 'connected', userId })}\n\n`,
        );

        // 4. 30초마다 핑(Keep-alive)
        const pingInterval = setInterval(() => {
          res.write(': keep-alive\n\n');
        }, 30000);

        // 5. 연결 종료 시 자원 정리
        req.on('close', () => {
          clearInterval(pingInterval);
          removeClient();
          console.log(`[SSE] 유저 ${userId} 연결 종료`);
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '알 수 없는 에러';
        console.error(`[SSE Error] 인증 실패 또는 연결 에러:`, errorMessage);
        res.status(401).send('Unauthorized');
      }
    }
  }

  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  async getNotifications(
    @GetUser('id') userId: string,
  ): Promise<NotificationResponseDto[]> {
    const notifications =
      await this.notificationService.getNotifications(userId);
    return notifications.map((noti) => new NotificationResponseDto(noti));
  }

  @Patch(':alarmId/check')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async checkNotification(@Param('alarmId') alarmId: string) {
    await this.notificationService.checkNotification(alarmId);
  }
}
