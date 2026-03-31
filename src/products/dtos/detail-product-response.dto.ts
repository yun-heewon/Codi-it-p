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

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  reviews: ReviewDto;

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

    const s3BaseUrl = process.env.AWS_S3_BASE_URL;

    // 2. image 필드가 비어있지 않고, http로 시작하지 않을 때만 조립
    if (
      this.image &&
      typeof this.image === 'string' &&
      !this.image.startsWith('http')
    ) {
      // 주소 끝에 /가 있으면 제거하고, 파일명 앞에 /를 붙여서 깔끔하게 합치기
      const cleanBaseUrl = s3BaseUrl!.replace(/\/$/, ''); // 끝에 있는 / 제거
      const cleanFileName = this.image.replace(/^\//, ''); // 앞에 있는 / 제거

      this.image = `${cleanBaseUrl}/${cleanFileName}`;

      // ✅ 진짜 최종 주소가 어떻게 만들어졌는지 터미널에 찍어보세요!
      console.log('🚀 [최종 이미지 URL 확인]:', this.image);
    }
  }
}
