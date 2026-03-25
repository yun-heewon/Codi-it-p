import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { InquiryRepository } from './inquiry.repository';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [InquiryService, InquiryRepository],
  controllers: [InquiryController],
})
export class InquiryModule {}
