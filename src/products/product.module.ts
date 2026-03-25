import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { NotificationModule } from 'src/notification/notification.module';
import { StoreModule } from 'src/stores/store.module';

@Module({
  imports: [NotificationModule, StoreModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
