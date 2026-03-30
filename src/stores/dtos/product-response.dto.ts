import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class ProductResponseDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  id: string;

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

    const s3BaseUrl = process.env.AWS_S3_BASE_URL;

    if (this.image) {
      if (!this.image.startsWith('http')) {
        const baseUrl = s3BaseUrl!.endsWith('/') ? s3BaseUrl : `${s3BaseUrl}/`;
        this.image = `${baseUrl}${this.image}`;
      }
    }
  }
}
