import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ChangeRateDto } from './change-rate.dto';
import { Type } from 'class-transformer';
import { SalesStatsDto } from './stats.dto';

export class PeriodSummaryDto {
  @Type(() => SalesStatsDto)
  @ValidateNested()
  @IsNotEmpty()
  current: SalesStatsDto;

  @Type(() => SalesStatsDto)
  @ValidateNested()
  @IsNotEmpty()
  previous: SalesStatsDto;

  @Type(() => ChangeRateDto)
  @ValidateNested()
  @IsNotEmpty()
  changeRate: ChangeRateDto;
}
