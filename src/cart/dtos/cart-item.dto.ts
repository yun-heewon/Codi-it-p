import { Expose } from 'class-transformer';
import { ProductInCartDto } from './product-in-cart.dto';

export class CartItemDto {
  @Expose() id!: string;
  @Expose() cartId!: string;
  @Expose() productId!: string;
  @Expose() sizeId!: number;
  @Expose() quantity!: number;
  @Expose() createdAt!: Date | string;
  @Expose() updatedAt!: Date | string;
  @Expose() product!: ProductInCartDto;

  constructor(partial: Partial<CartItemDto>) {
    Object.assign(this, partial);

    if (this.product) {
      this.product = new ProductInCartDto(this.product);
    }
  }
}
