import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ReviewUpdateDto {
  @IsOptional()
  @IsNumber()
  @Expose()
  rating?: number;

  @IsOptional()
  @IsString()
  @Expose()
  content?: string;
}
