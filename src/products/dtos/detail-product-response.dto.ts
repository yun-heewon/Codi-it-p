import { Expose, Type } from 'class-transformer';
import { CategoryResponse, DetailInquiry } from './product.dto';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { StockResponse } from './stock-response.dto';
import { ReviewDto } from './review.dto';

export class DetailProductResponse {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  image: string;

  @Expose()
  @IsString()
  content: string;

  @Expose()
  @IsDateString()
  createdAt: string;

  @Expose()
  @IsDateString()
  updatedAt: string;

  @Expose()
  @IsNumber()
  reviewsRating: number;

  @Expose()
  @IsString()
  storeId: string;

  @Expose()
  @IsString()
  storeName: string;

  @Expose()
  @IsNumber()
  price: number;

  @Expose()
  @IsNumber()
  discountPrice: number;

  @Expose()
  @IsNumber()
  discountRate: number;

  @Expose()
  @IsOptional()
  @IsDateString()
  discountStartTime: string | null;

  @Expose()
  @IsOptional()
  @IsDateString()
  discountEndTime: string | null;

  @Expose()
  @IsNumber()
  reviewsCount: number;

  // 중첩 객체 배열 처리
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  reviews: ReviewDto[];

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailInquiry)
  inquiries: DetailInquiry[];

  // 중첩 단일 객체 처리
  @Expose()
  @ValidateNested()
  @Type(() => CategoryResponse)
  category: CategoryResponse;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockResponse)
  stocks: StockResponse[];

  constructor(partial: Partial<DetailProductResponse>) {
    Object.assign(this, partial);
  }
}
