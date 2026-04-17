import { StocksDto } from './stocks.dto';
import {
  IsArray,
  ValidateNested,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: '상품 이름은 문자열이어야 합니다.' })
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '가격은 숫자여야 합니다.' })
  price?: number;

  @IsOptional()
  @IsString({ message: '제품 상세 정보는 문자열이어야 합니다.' })
  content?: string;

  @IsOptional()
  @IsString({ message: '이미지 URL은 문자열이어야 합니다.' })
  image?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '할인율은 숫자여야 합니다.' })
  discountRate?: number;

  @IsOptional()
  @IsDate({ message: '할인 시작 날짜는 유효한 날짜 형식이어야 합니다.' })
  @Type(() => Date)
  discountStartTime?: Date | null;

  @IsOptional()
  @IsDate({ message: '할인 종료 날짜는 유효한 날짜 형식이어야 합니다.' })
  @Type(() => Date)
  discountEndTime?: Date | null;

  @IsOptional()
  @IsString({ message: '카테고리 이름은 문자열이어야 합니다.' })
  categoryName?: string;

  @IsOptional()
  @IsBoolean({ message: '매진 여부는 true/false여야 합니다.' })
  isSoldOut?: boolean;

  @IsArray({ message: 'stocks는 배열이어야 합니다.' })
  @ValidateNested({ each: true })
  @Type(() => StocksDto)
  @Transform(({ value }): StocksDto[] => {
    if (typeof value === 'string') {
      try {
        const parsed: unknown = JSON.parse(value);
        // 배열이면 StocksDto로 매핑
        return Array.isArray(parsed) ? plainToInstance(StocksDto, parsed) : [];
      } catch {
        return [];
      }
    }
    return [];
  })
  stocks?: StocksDto[];
}
