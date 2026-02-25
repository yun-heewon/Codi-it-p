import { InquiryStatus } from '@prisma/client';
import { InquiryUser } from 'src/products/dtos/inquiries-response.dto';
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

export class InquiryStoreDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(partial: Partial<InquiryStoreDto>) {
    Object.assign(this, partial);
  }
}

export class InquiryProductDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  image: string;

  @Expose()
  @ValidateNested()
  @Type(() => InquiryStoreDto)
  store: InquiryStoreDto;

  constructor(partial: Partial<InquiryProductDto>) {
    Object.assign(this, partial);
  }
}
export class InquiryItemDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Expose()
  @IsBoolean()
  isSecret: boolean;

  @Expose()
  @IsEnum(InquiryStatus)
  status: InquiryStatus;

  @Expose()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @ValidateNested()
  @Type(() => InquiryProductDto)
  product: InquiryProductDto;

  @Expose()
  @ValidateNested()
  @Type(() => InquiryUser)
  user: InquiryUser;

  constructor(partial: Partial<InquiryItemDto>) {
    Object.assign(this, partial);
  }
}

export class InquiryList {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InquiryItemDto)
  list: InquiryItemDto[];

  @Expose()
  @IsNumber()
  totalCount: number;

  constructor(partial: Partial<InquiryList>) {
    Object.assign(this, partial);
  }
}
