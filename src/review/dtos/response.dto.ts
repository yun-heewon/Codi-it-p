import { Expose } from 'class-transformer';

export class ReviewResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  productId: string;

  @Expose()
  rating: number;

  @Expose()
  content: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  constructor(partial: Record<string, any>) {
    Object.assign(this, partial);

    if (partial.createdAt instanceof Date) {
      this.createdAt = partial.createdAt.toISOString();
    }

    if (partial.updatedAt instanceof Date) {
      this.updatedAt = partial.updatedAt.toISOString();
    }
  }
}
