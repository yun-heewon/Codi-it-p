import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decorator';
import { NotificationResponseDto } from './dtos/response.dto';

// interface SseResponse extends Response {
//   flush?: () => void;
// }

// const PING_INTERVAL_MS = 30000;
// const ALLOWED_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3001';

@Controller('notification')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

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
