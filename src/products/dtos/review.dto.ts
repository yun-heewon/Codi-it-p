import { Expose } from 'class-transformer';
import { IsNumber, IsInt, Min } from 'class-validator';

export class ReviewDto {
  @Expose()
  @IsInt()
  @Min(0)
  rate1Length: number;

  @Expose()
  @IsInt()
  @Min(0)
  rate2Length: number;

  @Expose()
  @IsInt()
  @Min(0)
  rate3Length: number;

  @Expose()
  @IsInt()
  @Min(0)
  rate4Length: number;

  @Expose()
  @IsInt()
  @Min(0)
  rate5Length: number;

  @Expose()
  @IsNumber()
  @Min(0)
  sumScore: number;

  constructor(partial: Partial<ReviewDto>) {
    Object.assign(this, partial);
  }
}
