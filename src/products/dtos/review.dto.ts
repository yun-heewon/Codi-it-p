import { Expose } from 'class-transformer';
import { IsNumber, IsInt, Min } from 'class-validator';

export class ReviewDto {
  @Expose()
  @IsInt()
  @Min(0)
  rate1Length!: number | null;

  @Expose()
  @IsInt()
  @Min(0)
  rate2Length!: number | null;

  @Expose()
  @IsInt()
  @Min(0)
  rate3Length!: number | null;

  @Expose()
  @IsInt()
  @Min(0)
  rate4Length!: number | null;

  @Expose()
  @IsInt()
  @Min(0)
  rate5Length!: number | null;

  @Expose()
  @IsNumber()
  @Min(0)
  sumScore!: number | null;

  constructor(partial: Partial<ReviewDto>) {
    Object.assign(this, partial);
  }
}
