import { PaymentStatus } from '@prisma/client';
import { FrontOrderItem } from './front-order-item.dto';

export type FrontPayment = {
  id: string;
  price: number;
  status: PaymentStatus;
  createdAt: string;
};

export class FrontOrder {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  subtotal: number;
  totalQuantity: number;
  usePoint: number;
  createdAt: string;
  orderItems: FrontOrderItem[];
  payments: FrontPayment | null;

  constructor(partail: Partial<FrontOrder>) {
    Object.assign(this, partail);
  }
}
