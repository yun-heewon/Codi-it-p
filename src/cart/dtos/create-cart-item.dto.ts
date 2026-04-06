import { Type } from 'class-transformer';
import { IsInt, IsString, IsOptional, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsOptional()
  @IsString()
  productId!: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sizeId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  quantity?: number;
}
