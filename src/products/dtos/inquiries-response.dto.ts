import { InquiryStatus } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsEnum,
  IsDate,
  ValidateNested,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class InquiryUser {
  @Expose()
  @IsOptional()
  @IsString()
  id?: string;

  @Expose()
  @IsString()
  name!: string;

  constructor(partial: Partial<InquiryUser>) {
    Object.assign(this, partial);
  }
}

export class InquiryReplyResponse {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Expose()
  @IsString()
  inquiryId?: string;

  @Expose()
  @IsString()
  userId?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @Expose()
  @IsDate()
  createdAt!: Date;

  @Expose()
  @IsDate()
  updatedAt!: Date;

  @Expose()
  @ValidateNested()
  @Type(() => InquiryUser)
  user!: InquiryUser;

  constructor(partial: Partial<InquiryReplyResponse>) {
    Object.assign(this, partial);
  }
}

export class InquiriesResponse {
  @Expose()
  @IsString()
  id!: string;

  @Expose()
  @IsString()
  userId!: string;

  @Expose()
  @IsString()
  productId!: string;

  @Expose()
  @IsString()
  title!: string;

  @Expose()
  @IsString()
  content!: string;

  @Expose()
  @IsEnum(InquiryStatus)
  status!: InquiryStatus;

  @Expose()
  @IsBoolean()
  isSecret!: boolean;

  @Expose()
  @IsDate()
  createdAt!: Date;

  @Expose()
  @IsDate()
  updatedAt!: Date;

  // 작성자 정보 (중첩 객체)
  @Expose()
  @ValidateNested()
  @Type(() => InquiryUser)
  user!: InquiryUser;

  // 답변 정보 (null 허용 및 중첩 객체)
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => InquiryReplyResponse)
  reply!: InquiryReplyResponse | null;

  constructor(partial: Partial<InquiriesResponse>) {
    Object.assign(this, partial);
  }
}
