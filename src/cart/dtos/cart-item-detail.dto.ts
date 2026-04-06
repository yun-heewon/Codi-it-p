import { CartItemDto } from './cart-item.dto';
import { CartDto } from './cart.dto';

export class CartItemDetailDto extends CartItemDto {
  cart!: CartDto;

  constructor(partial: Partial<CartItemDetailDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
