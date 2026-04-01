import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ChangeRateDto {
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  totalOrders: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  totalSales: number;
}
