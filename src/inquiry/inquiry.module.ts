import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { InquiryRepository } from './inquiry.repository';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [NotificationService],
  providers: [InquiryService, InquiryRepository],
  controllers: [InquiryController],
})
export class InquiryModule {}
