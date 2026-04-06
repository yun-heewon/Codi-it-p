import { InquiryStatus } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsEnum,
  IsDate,
  ValidateNested,
  IsNotEmpty,
  IsArray,
  IsNumber,
} from 'class-validator';
import { InquiryUser } from '../../products/dtos/inquiries-response.dto';

export class InquiryStoreDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name!: string;

  constructor(partial: Partial<InquiryStoreDto>) {
    Object.assign(this, partial);
  }
}

export class InquiryProductDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  image!: string;

  @Expose()
  @ValidateNested()
  @Type(() => InquiryStoreDto)
  store!: InquiryStoreDto;

  constructor(partial: Partial<InquiryProductDto>) {
    Object.assign(this, partial);

    const s3BaseUrl = process.env.AWS_S3_BASE_URL;

    if (
      this.image &&
      typeof this.image === 'string' &&
      !this.image.startsWith('http')
    ) {
      const baseUrl = s3BaseUrl?.endsWith('/') ? s3BaseUrl : `${s3BaseUrl}/`;
      this.image = `${baseUrl}${this.image}`;
    }
  }
}
export class InquiryItemDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Expose()
  @IsBoolean()
  isSecret!: boolean;

  @Expose()
  @IsEnum(InquiryStatus)
  status!: InquiryStatus;

  @Expose()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @Expose()
  @IsDate()
  createdAt!: Date;

  @Expose()
  @ValidateNested()
  @Type(() => InquiryProductDto)
  product!: InquiryProductDto;

  @Expose()
  @ValidateNested()
  @Type(() => InquiryUser)
  user!: InquiryUser;

  constructor(partial: Partial<InquiryItemDto>) {
    Object.assign(this, partial);
  }
}

export class InquiryList {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InquiryItemDto)
  list!: InquiryItemDto[];

  @Expose()
  @IsNumber()
  totalCount!: number;

  constructor(partial: Partial<InquiryList>) {
    Object.assign(this, partial);

    if (this.list && Array.isArray(this.list)) {
      const s3BaseUrl = process.env.AWS_S3_BASE_URL!;
      const baseUrl = s3BaseUrl.endsWith('/') ? s3BaseUrl : `${s3BaseUrl}/`;

      this.list = this.list.map((inquiry) => {
        // 문의에 연결된 상품이 있다면 이미지 조립
        if (inquiry.product && inquiry.product.image) {
          if (!inquiry.product.image.startsWith('http')) {
            inquiry.product.image = `${baseUrl}${inquiry.product.image}`;
          }
        }
        return inquiry;
      });
    }
  }
}
