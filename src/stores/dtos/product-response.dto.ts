import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class ProductResponseDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  id: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @Expose()
  image: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @IsNotEmpty()
  @Type(() => Number)
  @Expose()
  price: number;

  @IsInt()
  @IsNotEmpty()
  @Expose()
  stock: number;

  @IsBoolean()
  @Expose()
  isDiscount: boolean;

  @IsDateString()
  @IsNotEmpty()
  @Expose()
  createdAt: Date;

  @IsBoolean()
  @Expose()
  isSoldOut: boolean;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
