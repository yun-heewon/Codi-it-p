import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { MetadataController } from './metadata.controller';
import { MetadataRepository } from './metadata.repository';

@Module({
  providers: [MetadataService, MetadataRepository],
  controllers: [MetadataController],
})
export class MetadataModule {}
