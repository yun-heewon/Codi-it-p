import { InquiryStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class GetMyInquiriesQueryDto {
  @IsOptional()
  @Type(() => Number) // 쿼리 스트링(문자열)을 숫자로 변환
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 16;

  @IsOptional()
  @IsEnum(InquiryStatus)
  status?: InquiryStatus;
}
