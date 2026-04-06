import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { StoreModule } from '../stores/store.module';
import { ProductModule } from '../products/product.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [StoreModule, ProductModule, NotificationModule],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
})
export class OrderModule {}
