import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { StoreRepository } from 'src/stores/store.repository';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [StoreRepository, NotificationService],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
