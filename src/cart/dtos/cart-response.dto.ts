import { CartItemDto } from './cart-item.dto';
import { CartDto } from './cart.dto';

export class CartResponseDto extends CartDto {
  items: CartItemDto[];

  constructor(partial: Partial<CartResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
