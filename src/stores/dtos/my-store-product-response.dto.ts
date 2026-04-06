import { Expose, Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { ProductResponseDto } from './product-response.dto';

export class MyStoreProductResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductResponseDto)
  @Expose()
  list!: ProductResponseDto[];

  @IsInt()
  @IsNotEmpty()
  @Expose()
  totalCount!: number;

  constructor(partial: Partial<MyStoreProductResponseDto>) {
    Object.assign(this, partial);

    if (partial.list) {
      this.list = partial.list.map((item) => new ProductResponseDto(item));
    }
    this.totalCount = partial.totalCount ?? 0;
  }
}
