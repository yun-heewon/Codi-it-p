import { IsInt } from 'class-validator';

export class StocksDto {
  @IsInt()
  sizeId!: number;

  @IsInt()
  quantity!: number;
}
