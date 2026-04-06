import { Expose } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class SizeResponse {
  @Expose()
  @IsInt() // ID가 숫자 타입이므로 IsInt 또는 IsNumber 사용
  id!: number;

  @Expose()
  @IsString()
  name!: string;
}
