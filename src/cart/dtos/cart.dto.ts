import { Type } from 'class-transformer';
import { IsString, IsInt, IsDateString } from 'class-validator';

export class CartDto {
  @IsString()
  @Type(() => String)
  id!: string;

  @IsString()
  @Type(() => String)
  buyerId!: string;

  @IsInt()
  @Type(() => Number)
  quantity!: number;

  @IsDateString()
  createdAt!: string;

  @IsDateString()
  updatedAt!: string;

  constructor(partial: Partial<CartDto>) {
    Object.assign(this, partial);
  }
}
