import { FrontPayment } from './front-order.dto';

export class FrontOrderDto {
  id!: string;
  name!: string;
  phoneNumber!: string;
  address!: string;
  subtotal!: number;
  totalQuantity!: number;
  usePoint!: number;
  createdAt!: string;

  orderItems!: any[];
  payments!: FrontPayment | null;

  constructor(partial: Record<string, any>) {
    // 1. 기본 필드들을 안전하게 복사
    this.id = (partial.id as string) ?? '';
    this.name = (partial.name as string) ?? '';
    this.address = (partial.address as string) ?? '';
    this.phoneNumber = (partial.phoneNumber as string) ?? '';

    // 2. Prisma Decimal 등을 고려해 숫자로 확실히 변환
    this.subtotal = Number(partial.subtotal ?? 0);
    this.totalQuantity = Number(partial.totalQuantity ?? 0);
    this.usePoint = Number(partial.usePoint ?? 0);

    // 3. 날짜 처리 (Date 객체면 ISO 스트링으로, 아니면 그대로)
    this.createdAt =
      partial.createdAt instanceof Date
        ? partial.createdAt.toISOString()
        : String(partial.createdAt);

    // 4. Prisma 필드명(OrderItem)과 프론트 필드명(orderItems) 둘 다 대응
    const rawItems = (partial.orderItems ?? partial.OrderItem) as unknown;
    this.orderItems = Array.isArray(rawItems) ? rawItems : [];

    // 5. payments 필드 대응
    const rawPayments = (partial.payments ?? partial.payment) as unknown;
    this.payments = (rawPayments ?? null) as FrontPayment | null;
  }
}
