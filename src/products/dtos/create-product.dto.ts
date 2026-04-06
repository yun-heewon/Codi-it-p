import {
  IsArray,
  ValidateNested,
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDate,
} from 'class-validator';
import { StocksDto } from './stocks.dto';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { CategoryType } from './product.dto';

export class CreateProductDto {
  @IsNotEmpty({ message: '상품이름은 필수 입력 항목입니다.' })
  @IsString({ message: '상품번호는 문자열이어야 합니다.' })
  name!: string;

  @Type(() => Number)
  @IsNotEmpty({ message: '상품 가격은 필수 입력 항목입니다.' })
  @IsInt({ message: '상품 가격은 숫자여야 합니다.' })
  price!: number;

  @IsOptional()
  @IsString({ message: '제품 상품 정보는 문자열이어야 합니다.' })
  content!: string;

  @IsOptional()
  @IsString({ message: '상품이미지경로는 문자열이어야 합니다.' })
  image!: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: '할인율은 숫자여야 합니다.' })
  discountRate!: number;

  @IsOptional()
  @IsDate({ message: '할인기간은 날짜형식이어야 합니다.' })
  @Type(() => Date)
  discountStartTime!: Date | null;

  @IsOptional()
  @IsDate({ message: '할인 기간은 날짜형식이어야 합니다.' })
  @Type(() => Date)
  discountEndTime!: Date | null;

  @IsNotEmpty({ message: '상품 카테고리는 필수 입력 항목입니다.' })
  @IsString({ message: '상품 카테고리 이름은 문자열이어야 합니다.' })
  categoryName!: CategoryType;

  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty({ message: '상품이름은 필수 입력 항목입니다.' })
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
  stocks!: StocksDto[];
}
