import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';
import {
  getStartOfMonth,
  getStartOfNextDay,
  getStartOfNextMonth,
  getStartOfNextWeek,
  getStartOfNextYear,
  getStartOfPreviousPeriod,
  getStartOfToday,
  getStartOfWeek,
  getStartOfYear,
} from '../common/utils/date-util';
import { PeriodSummaryDto } from './dtos/period.dto';
import { ChangeRateDto } from './dtos/change-rate.dto';
import { DashboardResponseDto } from './dtos/dashboard-response.dto';
import { calculateChangeRate } from '../common/utils/stats-util';

type PeriodKey = 'today' | 'week' | 'month' | 'year';

interface PeriodRangeGetter {
  start: () => Date; // 현재 기간의 시작일 (예: 오늘 0시)
  end: () => Date; // 현재 기간의 종료일 경계 (예: 내일 0시)
  duration: 'day' | 'week' | 'month' | 'year'; // 이전 기간 계산을 위한 단위
}

const PeriodMappers: Record<PeriodKey, PeriodRangeGetter> = {
  today: { start: getStartOfToday, end: getStartOfNextDay, duration: 'day' },
  week: { start: getStartOfWeek, end: getStartOfNextWeek, duration: 'week' },
  month: {
    start: getStartOfMonth,
    end: getStartOfNextMonth,
    duration: 'month',
  },
  year: { start: getStartOfYear, end: getStartOfNextYear, duration: 'year' },
};

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getPeriodSummary(
    storeId: string,
    periodKey: PeriodKey,
  ): Promise<PeriodSummaryDto> {
    const mapper = PeriodMappers[periodKey];

    const currentStartDate = mapper.start();
    const currentEndDate = mapper.end();

    const previousStartDate = getStartOfPreviousPeriod(
      currentStartDate,
      mapper.duration,
    );
    const previousEndDate = currentStartDate; // 이전 기간 종료 = 현재 기간 시작

    const [currentStats, previousStats] = await Promise.all([
      this.dashboardRepository.getSalesAndOrdersByPeriod(
        storeId,
        currentStartDate,
        currentEndDate,
      ),
      this.dashboardRepository.getSalesAndOrdersByPeriod(
        storeId,
        previousStartDate,
        previousEndDate,
      ),
    ]);

    const salesChangeRate = calculateChangeRate(
      currentStats.totalSales,
      previousStats.totalSales,
    );
    const ordersChangeRate = calculateChangeRate(
      currentStats.totalOrders,
      previousStats.totalOrders,
    );
    return {
      current: currentStats,
      previous: previousStats,
      changeRate: {
        totalSales: salesChangeRate,
        totalOrders: ordersChangeRate,
      } as ChangeRateDto,
    } as PeriodSummaryDto;
  }

  async getDashboardSummary(
    storeId: string,
    topSalesLimit: number = 5,
  ): Promise<DashboardResponseDto> {
    const [
      todaySummary,
      weekSummary,
      monthSummary,
      yearSummary,
      topSales,
      priceRange,
    ] = await Promise.all([
      this.getPeriodSummary(storeId, 'today'),
      this.getPeriodSummary(storeId, 'week'),
      this.getPeriodSummary(storeId, 'month'),
      this.getPeriodSummary(storeId, 'year'),

      this.dashboardRepository.getTopSellingProducts(storeId, topSalesLimit),
      this.dashboardRepository.getSalesByPriceRange(storeId),
    ]);

    return {
      today: todaySummary,
      week: weekSummary,
      month: monthSummary,
      year: yearSummary,
      topSales: topSales,
      priceRange: priceRange,
    };
  }
}
