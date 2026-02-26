import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';

@Module({
  providers: [CartService, CartRepository],
  controllers: [CartController],
})
export class CartModule {}
