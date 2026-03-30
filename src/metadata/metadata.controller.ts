import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { MetadataService } from './metadata.service';

@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get('size')
  @HttpCode(HttpStatus.OK)
  async getSizes() {
    return await this.metadataService.getSizes();
  }

  @Get('grade')
  @HttpCode(HttpStatus.OK)
  async getGrades() {
    return await this.metadataService.getGrades();
  }

  @Get('category')
  @HttpCode(HttpStatus.OK)
  async getCategories(@Param('name') name: string) {
    if (!name) {
      throw new BadRequestException('카테고리 이름이 필요합니다.');
    }
    return await this.metadataService.getCategories(name);
  }
}
