import { CartItemDto } from './cart-item.dto';
import { CartDto } from './cart.dto';

export type CartResponseDto = CartDto & {
  items: CartItemDto[];
};
