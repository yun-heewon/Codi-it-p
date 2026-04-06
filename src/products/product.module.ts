import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { NotificationModule } from '../notification/notification.module';
import { StoreModule } from '../stores/store.module';

@Module({
  imports: [NotificationModule, StoreModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
