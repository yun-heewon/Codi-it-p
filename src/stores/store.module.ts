import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { StoreRepository } from './store.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StoreController],
  providers: [StoreService, StoreRepository],
  exports: [StoreRepository],
})
export class StoreModule {}
