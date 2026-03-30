import { BadRequestException, Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { CartDto } from './dtos/cart.dto';
import { CartItemDetailDto } from './dtos/cart-item-detail.dto';
import { CreateCartItemDto } from './dtos/create-cart-item.dto';
import { Prisma } from '@prisma/client';
import { CartResponseDto } from './dtos/cart-response.dto';
import { UpdateCartBySizesDto } from './dtos/update-cart-by-sizes.dto';
import { CartItemDto } from './dtos/cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  // --- CREATE (POST /api/cart) ---
  async createCartItem(
    buyerId: string,
    dto: CreateCartItemDto,
  ): Promise<CartDto> {
    const cart = await this.cartRepository.getOrCreateCartByBuyer(buyerId);

    if (dto.productId && dto.sizeId) {
      const existing = await this.cartRepository.findCartItem(
        cart.id,
        dto.productId,
        dto.sizeId,
      );

      if (existing) {
        await this.cartRepository.updateCartItem(
          existing.id,
          existing.quantity + (dto.quantity || 1),
        );
      } else {
        const createData: Prisma.CartItemCreateInput = {
          cart: { connect: { id: cart.id } },
          product: { connect: { id: dto.productId } },
          size: { connect: { id: dto.sizeId } },
          quantity: dto.quantity || 1,
        };
        await this.cartRepository.createCartItem(createData);
      }

      await this.cartRepository.recalcCartQuantity(cart.id);
    }
    const updatedCart =
      await this.cartRepository.getOrCreateCartByBuyer(buyerId);

    return {
      id: updatedCart.id,
      buyerId: updatedCart.buyerId,
      quantity: updatedCart.quantity,
      createdAt: updatedCart.createdAt.toISOString(),
      updatedAt: updatedCart.updatedAt.toISOString(),
    } as CartDto;
  }

  // --- READ ALL (GET /api/cart) ---
  async getCartItems(buyerId: string): Promise<CartResponseDto> {
    const cart = await this.cartRepository.getOrCreateCartByBuyer(buyerId);
    const rows = await this.cartRepository.findAllCartItems(cart.id);

    const items = rows.map((it) => this.cartRepository.toCartItemDto(it));

    return {
      id: cart.id,
      buyerId: cart.buyerId,
      quantity: cart.quantity,
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
      items,
    } as CartResponseDto;
  }

  // --- UPDATE (PATCH /api/cart) ---
  async patchCartItems(
    buyerId: string,
    dto: UpdateCartBySizesDto,
  ): Promise<CartItemDto[]> {
    if (!dto.productId || !Array.isArray(dto.sizes)) {
      throw new BadRequestException();
    }

    const cart = await this.cartRepository.getOrCreateCartByBuyer(buyerId);

    for (const { sizeId, quantity } of dto.sizes) {
      const existing = await this.cartRepository.findCartItem(
        cart.id,
        dto.productId,
        sizeId,
      );

      if (!existing && quantity > 0) {
        const createData: Prisma.CartItemCreateInput = {
          cart: { connect: { id: cart.id } },
          product: { connect: { id: dto.productId } },
          size: { connect: { id: sizeId } },
          quantity: quantity,
        };
        await this.cartRepository.createCartItem(createData);
      } else if (existing && quantity > 0) {
        await this.cartRepository.updateCartItem(existing.id, quantity);
      } else if (existing && quantity === 0) {
        await this.cartRepository.deleteCartItem(existing.id);
      }
    }

    await this.cartRepository.recalcCartQuantity(cart.id);

    const updatedRows = await this.cartRepository.findAllCartItems(cart.id);
    return updatedRows.map((it) => this.cartRepository.toCartItemDto(it));
  }

  // --- READ ONE (GET /api/cart/:cartItemId) ---
  async getCartItem(
    buyerId: string,
    cartItemId: string,
  ): Promise<CartItemDetailDto> {
    const item = await this.cartRepository.findCartItemDetail(
      cartItemId,
      buyerId,
    );

    const cartItemDto = this.cartRepository.toCartItemDto(item);

    const cartDto: CartDto = {
      id: item.cart.id,
      buyerId: item.cart.buyerId,
      quantity: item.cart.quantity,
      createdAt: item.cart.createdAt.toISOString(),
      updatedAt: item.cart.updatedAt.toISOString(),
    };

    return { ...cartItemDto, cart: cartDto } as CartItemDetailDto;
  }

  // --- DELETE (DELETE /api/cart/:cartItemId) ---
  async removeCartItem(buyerId: string, cartItemId: string): Promise<void> {
    const item = await this.cartRepository.findCartItemDetail(
      cartItemId,
      buyerId,
    );

    await this.cartRepository.deleteCartItem(item.id);
    await this.cartRepository.recalcCartQuantity(item.cartId);
  }
}
