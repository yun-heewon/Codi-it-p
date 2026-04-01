import { Expose, Type } from 'class-transformer';

export class ItemDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  productId: string;

  @Expose()
  orderItemId: string;

  @Expose()
  rating: number;

  @Expose()
  content: string;

  @Expose()
  @Type(() => String)
  createdAt: string;

  @Expose()
  @Type(() => String)
  updatedAt: string;

  constructor(partial: Record<string, any>) {
    Object.assign(this, partial);
    // 날짜 변환
    if (partial.createdAt instanceof Date)
      this.createdAt = partial.createdAt.toISOString();
    if (partial.updatedAt instanceof Date)
      this.updatedAt = partial.updatedAt.toISOString();
  }
}

export class MetaDto {
  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  hasNextPage: boolean;

  constructor(partial: Partial<MetaDto>) {
    Object.assign(this, partial);
  }
}

export class ReviewListResponse {
  @Expose()
  @Type(() => ItemDto)
  items: ItemDto[];

  @Expose()
  @Type(() => MetaDto)
  meta: MetaDto;

  constructor(partial: { items: unknown[]; meta: unknown }) {
    this.items = (partial.items ?? []).map(
      (item) => new ItemDto(item as Record<string, unknown>),
    );

    this.meta = new MetaDto(partial.meta as Record<string, unknown>);
  }
}
