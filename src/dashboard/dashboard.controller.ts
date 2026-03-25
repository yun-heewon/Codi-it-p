import {
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { DashboardResponseDto } from './dtos/dashboard-response.dto';
import { SellerStoreGuard } from 'src/common/guards/seller-store.guard';
import { GetStoreId } from './get-store-decorator';

@UseGuards(AuthGuard('jwt'), SellerStoreGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getDashboard(
    @GetStoreId() storeId: string,
  ): Promise<DashboardResponseDto> {
    if (!storeId) {
      throw new ForbiddenException('Store ID가 필요합니다.');
    }
    const dashboard = await this.dashboardService.getDashboardSummary(
      storeId,
      5,
    );

    return new DashboardResponseDto(dashboard);
  }
}
