import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { GetUser } from '../auth/get-user-decorator';
import { UserType } from '@prisma/client';
import { GetMyInquiriesQueryDto } from './dtos/get-my-inquiries-params.dto';
import { InquiryList } from './dtos/inquiry-list.dto';
import {
  InquiriesResponse,
  InquiryReplyResponse,
} from '../products/dtos/inquiries-response.dto';
import { UpdateInquiryDto } from './dtos/update-inquiry.dto';
import { InquiryResponse } from '../products/dtos/inquiry-response.dto';
import { CreateOrUpdateInquiryReplyDto } from './dtos/create-update-reply.dto';
import { AuthGuard } from '@nestjs/passport';
import { SellerStoreGuard } from '../common/guards/seller-store.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  // 내 문의 리스트 조회
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getMyInquiries(
    @GetUser('id') userId: string,
    @GetUser('type') role: UserType,
    @Query() query: GetMyInquiriesQueryDto,
  ): Promise<InquiryList> {
    const myInquiries = await this.inquiryService.getMyInquiries(
      userId,
      query,
      role,
    );

    return new InquiryList(myInquiries);
  }

  // 문의 상세 조회
  @Get(':inquiryId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getDetailInquiry(
    @GetUser('id') userId: string,
    @Param('inquiryId') inquiryId: string,
  ): Promise<InquiriesResponse> {
    const detailInquiry = await this.inquiryService.getDetailInquiry(
      userId,
      inquiryId,
    );
    return new InquiriesResponse(detailInquiry);
  }

  @Patch(':inquiryId')
  @SetMetadata('role', 'BUYER')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateInquiry(
    @GetUser('id') userId: string,
    @Param('inquiryId') inquiryId: string,
    @Body() data: UpdateInquiryDto,
  ): Promise<InquiryResponse> {
    const updatedInquiry = await this.inquiryService.updateInquiry(
      userId,
      inquiryId,
      data,
    );

    return new InquiryResponse(updatedInquiry);
  }

  @Delete(':inquiryId')
  @SetMetadata('role', 'BUYER')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteInquiry(
    @GetUser('id') userId: string,
    @Param('inquiryId') inquiryId: string,
  ): Promise<InquiryResponse> {
    const deletedInquiry = await this.inquiryService.deleteInquiry(
      userId,
      inquiryId,
    );
    return new InquiryResponse(deletedInquiry);
  }

  // 문의 답변 생성
  @Post('/:inquiryId/replies')
  @UseGuards(AuthGuard('jwt'), SellerStoreGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  async postInquiryReply(
    @GetUser('id') userId: string,
    @Param('inquiryId') inquiryId: string,
    @Body() data: CreateOrUpdateInquiryReplyDto,
  ): Promise<InquiryReplyResponse> {
    const createdReply = await this.inquiryService.postInquiryReply(
      userId,
      inquiryId,
      data,
    );

    return new InquiryReplyResponse(createdReply);
  }

  // 문의 답변 상세조회
  @Get('/:replyId/replies')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  async getDetailReply(
    @GetUser('id') userId: string,
    @Param('replyId') replyId: string,
  ): Promise<InquiriesResponse> {
    const detailReply = await this.inquiryService.getDetailInquiry(
      userId,
      replyId,
    );
    return new InquiriesResponse(detailReply);
  }

  @Patch('/:replyId/replies')
  @UseGuards(AuthGuard('jwt'), SellerStoreGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateReply(
    @GetUser('id') userId: string,
    @Param('replyId') replyId: string,
    @Body() data: CreateOrUpdateInquiryReplyDto,
  ): Promise<InquiryReplyResponse> {
    const updatedReply = await this.inquiryService.updateReply(
      userId,
      replyId,
      data,
    );

    return new InquiryReplyResponse(updatedReply);
  }
}
