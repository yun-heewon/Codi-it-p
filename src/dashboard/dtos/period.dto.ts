import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ChangeRateDto } from './change-rate.dto';
import { Expose, Type } from 'class-transformer';
import { SalesStatsDto } from './stats.dto';

export class PeriodSummaryDto {
  @Type(() => SalesStatsDto)
  @ValidateNested()
  @IsNotEmpty()
  @Expose()
  current: SalesStatsDto;

  @Type(() => SalesStatsDto)
  @ValidateNested()
  @IsNotEmpty()
  @Expose()
  previous: SalesStatsDto;

  @Type(() => ChangeRateDto)
  @ValidateNested()
  @IsNotEmpty()
  @Expose()
  changeRate: ChangeRateDto;
}
