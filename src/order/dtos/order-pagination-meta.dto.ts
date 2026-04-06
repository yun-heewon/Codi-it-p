import { Expose } from 'class-transformer';

export class OrderPaginationMetaDto {
  @Expose()
  total!: number;

  @Expose()
  page!: number;

  @Expose()
  limit!: number;

  @Expose()
  totalPages!: number;
}
