import { Expose, Type } from 'class-transformer';

export class ProductListDto {
  @Expose() id: string;
  @Expose() storeId: string;
  @Expose() storeName: string;
  @Expose() name: string;
  @Expose() image: string;
  @Expose() price: number;
  @Expose() discountPrice: number;
  @Expose() discountRate: number;
  @Expose() discountStartTime?: Date | null;
  @Expose() discountEndTime?: Date | null;
  @Expose() reviewsCount: number;
  @Expose() reviewsRating: number;
  @Expose() createdAt: string;
  @Expose() updatedAt: string;
  @Expose() sales: number;
  @Expose() isSoldOut: boolean;

  constructor(partial: Partial<ProductListDto>) {
    // 1. 기본 데이터 할당
    Object.assign(this, partial);

    // 2. S3 주소 자동 조립 로직 (무적 코드!)
    const s3BaseUrl = process.env.AWS_S3_BASE_URL;

    if (
      this.image &&
      typeof this.image === 'string' &&
      !this.image.startsWith('http')
    ) {
      if (s3BaseUrl) {
        const cleanBaseUrl = s3BaseUrl.replace(/\/$/, '');
        const cleanFileName = this.image.replace(/^\//, '');
        this.image = `${cleanBaseUrl}/${cleanFileName}`;
      }
    } else if (!this.image) {
      // 이미지가 없을 경우 기본 이미지 처리
      this.image = 'https://placehold.co/600x400.jpg?text=No+Image';
    }
  }
}

export class ProductListResponse {
  @Expose()
  @Type(() => ProductListDto) // 배열 내부의 각 객체를 DTO 클래스로 변환
  list: ProductListDto[];

  @Expose()
  totalCount: number;

  constructor(list: any[], totalCount: number) {
    // 2. item을 Partial<ProductListDto>로 단언(Assertion)하여 안전하게 전달
    this.list = list.map(
      (item) => new ProductListDto(item as Partial<ProductListDto>),
    );
    this.totalCount = totalCount;
  }
}
