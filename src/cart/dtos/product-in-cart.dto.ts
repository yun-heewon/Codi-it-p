import { Expose } from 'class-transformer';

export interface StoreInCartDto {
  id: string;
  name: string;
}

export interface StockInCartDto {
  id: string;
  quantity: number;
  size: {
    id: number;
    name: string;
  };
}

export class ProductInCartDto {
  @Expose() id: string;
  @Expose() storeId: string;
  @Expose() storeName: string;
  @Expose() name: string;
  @Expose() image: string;
  @Expose() price: number;
  @Expose() discountRate: number | null;
  @Expose() discountStartTime: string | null;
  @Expose() discountEndTime: string | null;
  @Expose() isSoldOut: boolean;

  @Expose() stocks: StockInCartDto[];
  @Expose() store: StoreInCartDto;

  constructor(partial: Partial<ProductInCartDto>) {
    Object.assign(this, partial);

    const s3BaseUrl = process.env.AWS_S3_BASE_URL;

    if (
      this.image &&
      typeof this.image === 'string' &&
      !this.image.startsWith('http')
    ) {
      const baseUrl = s3BaseUrl?.endsWith('/') ? s3BaseUrl : `${s3BaseUrl}/`;
      this.image = `${baseUrl}${this.image}`;
    }
  }
}
