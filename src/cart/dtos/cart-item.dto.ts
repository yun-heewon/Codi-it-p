import { ProductInCartDto } from './product-in-cart.dto';

export class CartItemDto {
  id: string;
  cartId: string;
  productId: string;
  sizeId: number;
  quantity: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  product: ProductInCartDto;

  constructor(partial: Partial<CartItemDto>) {
    Object.assign(this, partial);
  }
}
