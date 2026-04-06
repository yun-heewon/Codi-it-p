import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';
import { StoreResponseDto } from './response.dto';

export class DetailResponseDto extends StoreResponseDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  favoriteCount!: number;

  constructor(partial: Partial<DetailResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
