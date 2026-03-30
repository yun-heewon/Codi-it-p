import { Expose } from 'class-transformer';
import { CartItemDto } from './cart-item.dto';
import { CartDto } from './cart.dto';

export class CartResponseDto extends CartDto {
  @Expose()
  items: CartItemDto[];

  constructor(partial: Partial<CartResponseDto>) {
    super(partial);
    Object.assign(this, partial);

    if (partial.items && Array.isArray(partial.items)) {
      this.items = partial.items.map((item) => new CartItemDto(item));
    } else {
      this.items = [];
    }
  }
}
