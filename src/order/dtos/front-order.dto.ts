import { PaymentStatus } from '@prisma/client';
import { FrontOrderItem } from './front-order-item.dto';
import { Expose, Type } from 'class-transformer';

export class FrontPayment {
  @Expose()
  id: string;

  @Expose()
  price: number;

  @Expose()
  status: PaymentStatus;

  @Expose()
  createdAt: string;

  constructor(partial: Record<string, any>) {
    Object.assign(this, partial);

    // 날짜 변환: unknown으로 받아서 Date인지 확인 후 문자열로 변환
    const rawDate = partial['createdAt'] as unknown;
    if (rawDate instanceof Date) {
      this.createdAt = rawDate.toISOString();
    } else if (typeof rawDate === 'string') {
      this.createdAt = rawDate;
    }
  }
}

export class FrontOrder {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  subtotal: number;

  @Expose()
  totalQuantity: number;

  @Expose()
  usePoint: number;

  @Expose()
  createdAt: string;

  @Expose()
  @Type(() => FrontOrderItem)
  orderItems: FrontOrderItem[];

  @Expose()
  @Type(() => FrontPayment)
  payments: FrontPayment | null;

  constructor(partial: Record<string, any>) {
    Object.assign(this, partial);

    // 1. 날짜 변환 (unknown 세탁)
    const rawDate = partial['createdAt'] as unknown;
    if (rawDate instanceof Date) {
      this.createdAt = rawDate.toISOString();
    }

    // 2. orderItems 배열 인스턴스화
    const rawItems = partial['orderItems'] as unknown;
    if (Array.isArray(rawItems)) {
      this.orderItems = rawItems.map(
        (item: unknown) => new FrontOrderItem(item as Record<string, unknown>),
      );
    } else {
      this.orderItems = [];
    }

    // 3. payments 객체 인스턴스화 (null 체크 포함)
    const rawPayment = partial['payments'] as unknown;
    if (rawPayment && typeof rawPayment === 'object') {
      this.payments = new FrontPayment(rawPayment as Record<string, unknown>);
    } else {
      this.payments = null;
    }
  }
}
