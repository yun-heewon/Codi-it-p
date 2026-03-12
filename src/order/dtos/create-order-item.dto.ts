/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Type, Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateOrderItemDto {
  @Transform(({ value, obj }: { value: unknown; obj: Record<string, any> }) => {
    // obj를 any 객체로 인식시켜서 속성 접근 에러를 피합니다.
    return (value ?? obj?.product?.id ?? obj?.id) as string;
  })
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @Transform(({ value, obj }: { value: unknown; obj: Record<string, any> }) => {
    // 원래 로직 그대로: size.id나 size 자체를 가져옵니다.
    const v = value ?? obj?.size?.id ?? obj?.size;
    return (typeof v === 'string' ? Number(v) : v) as number;
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sizeId!: number;

  @Transform(({ value, obj }: { value: unknown; obj: Record<string, any> }) => {
    // 원래 로직 그대로: qty나 q 필드를 찾아 숫자로 바꿉니다.
    const v = value ?? obj?.qty ?? obj?.q ?? 1;
    return (typeof v === 'string' ? Number(v) : v) as number;
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}
