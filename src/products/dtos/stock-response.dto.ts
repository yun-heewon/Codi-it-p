import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { SizeResponse } from './size-response.dto';

export class StockResponse {
  @Expose()
  @IsString()
  id!: string;

  @Expose()
  @IsString()
  productId!: string;

  @Expose()
  @IsNumber()
  quantity!: number;

  @Expose()
  @ValidateNested() // 객체 내부 유효성 검사 활성화
  @Type(() => SizeResponse) // 일반 객체를 SizeResponse 인스턴스로 변환
  size!: SizeResponse;
}
