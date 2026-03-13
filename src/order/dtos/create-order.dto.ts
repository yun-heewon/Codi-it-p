import { Type, Transform, Expose } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Expose({ name: 'phone' })
  @Transform(({ value, obj }: { value: unknown; obj: unknown }) => {
    const source = obj as Record<string, unknown>;
    const v = value ?? source['phoneNumber'] ?? source['phone'] ?? '';
    return String(v as any);
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems?: CreateOrderItemDto[];

  @Transform(({ value }: { value: unknown }) => {
    // value가 null/undefined일 때와 string일 때를 안전하게 처리
    if (value == null) return 0;

    const result = typeof value === 'string' ? Number(value) : value;
    // 최종 리턴 시 number로 확정 (as number)
    return result as number;
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  usePoint!: number;
}
