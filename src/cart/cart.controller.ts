import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { CartDto } from './dtos/cart.dto';
import { CreateCartItemDto } from './dtos/create-cart-item.dto';
import { GetUser } from 'src/auth/get-user-decorator';
import { CartResponseDto } from './dtos/cart-response.dto';
import { UpdateCartBySizesDto } from './dtos/update-cart-by-sizes.dto';
import { CartItemDto } from './dtos/cart-item.dto';
import { CartItemDetailDto } from './dtos/cart-item-detail.dto';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  async createCartItem(
    @GetUser('id') userId: string,
    @Body() data: CreateCartItemDto,
  ): Promise<CartDto> {
    const newCart = await this.cartService.createCartItem(userId, data);
    return new CartDto(newCart);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getCartItems(@GetUser('id') userId: string): Promise<CartResponseDto> {
    const cartItems = await this.cartService.getCartItems(userId);
    return new CartResponseDto(cartItems);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async patchCartItems(
    @GetUser('id') userId: string,
    @Body() data: UpdateCartBySizesDto,
  ): Promise<CartItemDto[]> {
    const patchedCart = await this.cartService.patchCartItems(userId, data);
    return patchedCart.map((item) => new CartItemDto(item));
  }

  @Get(':cartItemId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getCartItem(
    @GetUser('id') userId: string,
    @Param('cartItemId') cartItemId: string,
  ): Promise<CartItemDetailDto> {
    if (typeof cartItemId !== 'string') {
      throw new BadRequestException('cartItemId가 누락되었습니다.');
    }

    const item = await this.cartService.getCartItem(userId, cartItemId);

    return new CartItemDetailDto(item);
  }

  @Delete(':cartItemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCartItem(
    @GetUser('id') userId: string,
    @Param('cartItemId') cartItemId: string,
  ): Promise<void> {
    await this.cartService.removeCartItem(userId, cartItemId);
  }
}
