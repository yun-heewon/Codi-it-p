import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ✅ 매월 1일 0시 0분에 실행되는 크론잡
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleMonthlyReset() {
    this.logger.log('월간 좋아요 수 초기화 작업을 시작합니다...');

    try {
      const result = await this.prisma.store.updateMany({
        data: {
          monthFavoriteCount: 0,
        },
      });

      this.logger.log(`${result.count}개의 상점 초기화 완료!`);
    } catch (error) {
      this.logger.error('초기화 중 오류 발생:', error);
    }
  }
}
