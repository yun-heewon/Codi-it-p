import { Expose, Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class StoreResponseDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  id!: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  name!: string;

  @IsDateString()
  @IsNotEmpty()
  @Expose()
  createdAt!: Date;

  @IsDateString()
  @IsNotEmpty()
  @Expose()
  updatedAt!: Date;

  @IsString()
  @IsNotEmpty()
  @Expose()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  address!: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  detailAddress!: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  content!: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @Expose()
  @Transform(({ value }) => {
    if (!value) return '/images/sample-store.png';
    const strValue = String(value);
    if (strValue.startsWith('http')) return strValue;

    const baseUrl = process.env.AWS_S3_BASE_URL;
    return `${baseUrl}${value}`;
  })
  image?: string | null | undefined;

  constructor(partial: Partial<StoreResponseDto>) {
    Object.assign(this, partial);
  }
}
