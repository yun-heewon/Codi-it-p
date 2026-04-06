import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReviewCreateDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  rating!: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  content!: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  orderItemId!: string;
}
