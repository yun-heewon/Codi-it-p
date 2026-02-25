import { Expose } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsEnum,
  IsDate,
  IsNotEmpty,
} from 'class-validator';
import { InquiryStatus } from '@prisma/client';

export interface InquiryReplyResponse {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: InquiryUser;
}

export interface InquiryUser {
  id?: string;
  name: string;
}

export class InquiryResponse {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Expose()
  @IsEnum(InquiryStatus)
  status: InquiryStatus;

  @Expose()
  @IsBoolean()
  isSecret: boolean;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;

  constructor(partial: Partial<InquiryResponse>) {
    Object.assign(this, partial);
  }
}
