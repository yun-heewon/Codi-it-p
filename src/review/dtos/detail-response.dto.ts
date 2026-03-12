import { Expose, Type } from 'class-transformer';

export class ReviewSizeDto {
  @Expose() en!: string;
  @Expose() ko!: string;
}

export class ReviewDetailResponseDto {
  @Expose()
  reviewId: string;

  @Expose()
  productName: string;

  @Expose()
  @Type(() => ReviewSizeDto)
  size: ReviewSizeDto;

  @Expose()
  price: number;

  @Expose()
  quantity: number;

  @Expose()
  rating: number;

  @Expose()
  content: string;

  @Expose()
  reviewer: string;

  @Expose()
  @Type(() => String)
  reviewCreatedAt: string;

  @Expose()
  @Type(() => String)
  purchasedAt: string;

  constructor(partial: Record<string, any>) {
    // 1. 기본 필드들은 ??를 사용해 안전하게 대입합니다.
    this.reviewId = String(partial.id ?? partial.reviewId ?? '');
    this.productName = String(
      (partial.product as { name: string })?.name ?? '',
    ); // include된 product에서 이름 가져오기

    // 2. size는 객체이므로 그대로 할당 (ReviewSizeDto 구조에 맞게)
    this.size = partial.size as ReviewSizeDto;

    this.price = Number(partial.price ?? 0);
    this.quantity = Number(partial.quantity ?? 0);
    this.rating = Number(partial.rating ?? 0);
    this.content = String(partial.content ?? '');

    // 3. reviewer는 include된 user의 name을 가져옵니다.
    this.reviewer = String((partial.user as { name: string })?.name ?? '');

    // 4. 리뷰 작성일 처리 (Review 모델의 자체 createdAt)
    if (partial.createdAt instanceof Date) {
      this.reviewCreatedAt = partial.createdAt.toISOString();
    } else {
      this.reviewCreatedAt = String(partial.createdAt ?? '');
    }

    const orderItem = partial['orderItem'] as
      | Record<string, unknown>
      | undefined;

    const rawPurchasedAt = orderItem ? orderItem['createdAt'] : undefined;

    if (rawPurchasedAt instanceof Date) {
      this.purchasedAt = rawPurchasedAt.toISOString();
    } else if (typeof rawPurchasedAt === 'string') {
      this.purchasedAt = rawPurchasedAt;
    } else {
      this.purchasedAt = '';
    }
  }
}
