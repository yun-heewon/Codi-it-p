import { Expose, Type } from 'class-transformer';

export class FrontReview {
  @Expose()
  id: string;

  @Expose()
  rating: number;

  @Expose()
  content: string;

  @Expose()
  createdAt: string;

  constructor(partial: Record<string, any>) {
    Object.assign(this, partial);
    if (partial.createdAt instanceof Date) {
      this.createdAt = partial.createdAt.toISOString();
    }
  }
}

export class FrontProduct {
  @Expose()
  name: string;

  @Expose()
  image?: string;

  @Expose()
  @Type(() => FrontReview)
  reviews: FrontReview[];

  constructor(partial: Record<string, any>) {
    Object.assign(this, partial);

    const s3BaseUrl = process.env.AWS_S3_BASE_URL;
    // 주소 끝에 /가 없으면 붙여주는 안전장치
    const baseUrl = s3BaseUrl?.endsWith('/') ? s3BaseUrl : `${s3BaseUrl}/`;

    if (this.image && !this.image.startsWith('http')) {
      this.image = `${baseUrl}${this.image}`;
    }

    // unknown으로 받아서 안전하게 접근합니다.
    const rawReviews = partial['reviews'] as unknown;

    // 배열인지 확인하여 'Unsafe member access .map'을 방지합니다.
    if (Array.isArray(rawReviews)) {
      // 내부 요소들을 Record<string, unknown>으로 캐스팅하여 'Unsafe call'을 방지합니다.
      this.reviews = rawReviews.map(
        (r: unknown) => new FrontReview(r as Record<string, unknown>),
      );
    } else {
      this.reviews = [];
    }
  }
}

export class FrontOrderItem {
  @Expose()
  id: string;

  @Expose()
  price: number;

  @Expose()
  quantity: number;

  @Expose()
  isReviewed: boolean;

  @Expose()
  productId: string;

  @Expose()
  @Type(() => FrontProduct)
  product: FrontProduct;

  @Expose()
  size: { size: { en: string; ko: string } };

  constructor(partial: Record<string, any>) {
    Object.assign(this, partial);

    const rawProduct = partial['product'] as unknown;
    if (rawProduct && typeof rawProduct === 'object') {
      this.product = new FrontProduct(rawProduct as Record<string, unknown>);
    }

    const rawSize = partial['size'] as unknown;
    let finalSizeValue: unknown = rawSize;

    if (rawSize && typeof rawSize === 'object') {
      const tempSize = (rawSize as Record<string, unknown>)['size'];
      if (tempSize) {
        finalSizeValue = tempSize;
      }
    }

    this.size = finalSizeValue as { size: { en: string; ko: string } };
  }
}
