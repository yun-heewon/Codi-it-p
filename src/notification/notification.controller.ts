import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GetUser } from '../auth/get-user-decorator';
import { NotificationResponseDto } from './dtos/response.dto';
import type { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

interface SseResponse extends Response {
  flushHeaders: () => void;
  flush?: () => void;
}

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('sse')
  sseConnect(@GetUser('id') userId: string, @Res() res: Response) {
    {
      const sseRes = res as SseResponse;

      if (!userId) {
        throw new UnauthorizedException('유저 정보를 찾을 수 없습니다.');
      }

      // 2. SSE 헤더 설정
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': 'https://codi-it-web.vercel.app', // 프론트 주소
        'Access-Control-Allow-Credentials': 'true',
      });

      if (typeof sseRes.flushHeaders === 'function') {
        sseRes.flushHeaders();
      } else if (typeof sseRes.flush === 'function') {
        sseRes.flush();
      }

      // 3. 클라이언트 등록 및 연결 확인 메시지 전송
      const removeClient = this.notificationService.addClient(userId, sseRes);

      res.write(`event: connected\n`);
      res.write(
        `data: ${JSON.stringify({ message: 'connected', userId })}\n\n`,
      );

      // 4. 30초마다 핑(Keep-alive)
      const pingInterval = setInterval(() => {
        res.write(': keep-alive\n\n');
      }, 30000);

      // 5. 연결 종료 시 자원 정리
      res.on('close', () => {
        clearInterval(pingInterval);
        removeClient();
      });
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
