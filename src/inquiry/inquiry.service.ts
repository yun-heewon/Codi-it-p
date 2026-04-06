import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InquiryRepository } from './inquiry.repository';
import { NotificationService } from '../notification/notification.service';
import { InquiryStatus, NotificationType, UserType } from '@prisma/client';
import { InquiryList } from './dtos/inquiry-list.dto';
import {
  InquiriesResponse,
  InquiryReplyResponse,
} from '../products/dtos/inquiries-response.dto';
import { UpdateInquiryDto } from './dtos/update-inquiry.dto';
import { InquiryResponse } from '../products/dtos/inquiry-response.dto';
import { CreateOrUpdateInquiryReplyDto } from './dtos/create-update-reply.dto';
import { CreateNotificationDto } from '../notification/dtos/create.dto';
import { GetMyInquiriesQueryDto } from './dtos/get-my-inquiries-params.dto';

@Injectable()
export class InquiryService {
  constructor(
    private readonly inquiryRepository: InquiryRepository,
    private readonly notificationService: NotificationService,
  ) {}
  async getMyInquiries(
    userId: string,
    params: GetMyInquiriesQueryDto,
    role: UserType,
  ): Promise<InquiryList> {
    const skip = (params.page! - 1) * params.pageSize!;
    const take = params.pageSize!;

    // seller
    if (role === 'SELLER') {
      const [list, totalCount] = await Promise.all([
        this.inquiryRepository.findInquiriesBySellerId(userId, {
          skip,
          take,
          status: params.status,
        }),
        this.inquiryRepository.countInquiriesBySellerId(userId, {
          status: params.status,
        }),
      ]);

      return { list, totalCount };
    }
    // buyer
    const [list, totalCount] = await Promise.all([
      this.inquiryRepository.findMyInquiryByUserId(userId, {
        skip,
        take,
        status: params.status,
      }),
      this.inquiryRepository.countInquiryByUserId(userId, {
        status: params.status,
      }),
    ]);

    return { list, totalCount };
  }

  async getDetailInquiry(
    userId: string,
    inquiryId: string,
  ): Promise<InquiriesResponse> {
    const inquiry =
      await this.inquiryRepository.findInquiryByInquiryId(inquiryId);
    if (!inquiry) {
      throw new NotFoundException();
    }

    const isSecret = inquiry.isSecret === true;

    if (isSecret) {
      const isAuthor = inquiry.userId === userId;
      const isSeller = inquiry.product.store.userId === userId;
      if (!isAuthor && !isSeller) {
        throw new UnauthorizedException();
      }
    }

    return {
      id: inquiry.id,
      userId: inquiry.userId,
      productId: inquiry.productId,
      title: inquiry.title,
      content: inquiry.content,
      status: inquiry.status,
      isSecret: inquiry.isSecret,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
      user: {
        name: inquiry.user.name,
      },
      reply: inquiry.InquiryReply
        ? {
            id: inquiry.InquiryReply.id,
            content: inquiry.InquiryReply.content,
            createdAt: inquiry.InquiryReply.createdAt,
            updatedAt: inquiry.InquiryReply.updatedAt,
            user: {
              name: inquiry.InquiryReply.user.name,
            },
          }
        : null,
    };
  }

  async updateInquiry(
    userId: string,
    inquiryId: string,
    data: UpdateInquiryDto,
  ): Promise<InquiryResponse> {
    const inquiry =
      await this.inquiryRepository.findInquiryByInquiryId(inquiryId);
    if (!inquiry) {
      throw new NotFoundException();
    }

    const isAuthor = inquiry.userId === userId;
    if (!isAuthor) {
      throw new ForbiddenException();
    }

    if (inquiry.status === InquiryStatus.CompletedAnswer) {
      throw new BadRequestException();
    }

    const updateInquiry = await this.inquiryRepository.updateInquiry(
      inquiryId,
      data,
    );
    return {
      id: updateInquiry.id,
      userId: updateInquiry.userId,
      productId: updateInquiry.productId,
      title: updateInquiry.title,
      content: updateInquiry.content,
      status: updateInquiry.status,
      isSecret: updateInquiry.isSecret,
      createdAt: updateInquiry.createdAt,
      updatedAt: updateInquiry.updatedAt,
    };
  }

  async deleteInquiry(
    userId: string,
    inquiryId: string,
  ): Promise<InquiryResponse> {
    const inquiry =
      await this.inquiryRepository.findInquiryByInquiryId(inquiryId);
    if (!inquiry) {
      throw new NotFoundException();
    }

    const isAuthor = inquiry.userId === userId;
    if (!isAuthor) {
      throw new ForbiddenException();
    }

    const deleteInquiry = await this.inquiryRepository.deleteInquiry(inquiryId);
    return {
      id: deleteInquiry.id,
      userId: deleteInquiry.userId,
      productId: deleteInquiry.productId,
      title: deleteInquiry.title,
      content: deleteInquiry.content,
      status: deleteInquiry.status,
      isSecret: deleteInquiry.isSecret,
      createdAt: deleteInquiry.createdAt,
      updatedAt: deleteInquiry.updatedAt,
    };
  }

  async postInquiryReply(
    userId: string,
    inquiryId: string,
    body: CreateOrUpdateInquiryReplyDto,
  ): Promise<InquiryReplyResponse> {
    const inquiry =
      await this.inquiryRepository.findInquiryByInquiryId(inquiryId);
    if (!inquiry) {
      throw new NotFoundException();
    }

    // 답글은 상품의 판매자만 등록 가능
    const isSeller = inquiry.product.store.userId === userId;
    if (!isSeller) {
      throw new ForbiddenException();
    }

    const { content } = body;
    if (!content) {
      throw new BadRequestException();
    }

    const createReply = await this.inquiryRepository.createReply({
      inquiryId,
      userId,
      content,
    });
    // 문의 상태를 답변 완료로 업데이트
    await this.inquiryRepository.updateInquiryStatus(
      inquiryId,
      InquiryStatus.CompletedAnswer,
    );

    // --- 알림 로직 ---
    try {
      const inquiryDto: CreateNotificationDto = {
        content: `작성하신 ${inquiry.product.name} 문의에 대한 답변이 등록되었습니다.`,
        type: NotificationType.BUYER_INQUIRY_ANSWERED,
      };
      await this.notificationService.createAndSendNotification(
        inquiry.userId,
        inquiryDto,
      );
    } catch (error) {
      console.error('[Notification Error] Failed to send notification:', error);
    }

    // --- 알림 종료 ---

    return {
      id: createReply.id,
      inquiryId: createReply.inquiryId,
      userId: createReply.userId,
      content: createReply.content,
      createdAt: createReply.createdAt,
      updatedAt: createReply.updatedAt,
      user: {
        id: createReply.user.id,
        name: createReply.user.name,
      },
    };
  }

  async getDetailReply(
    userId: string,
    replyId: string,
  ): Promise<InquiriesResponse> {
    const existReply = await this.inquiryRepository.findReplyByReplyId(replyId);
    if (!existReply) throw new NotFoundException();

    const inquiry = existReply.inquiry;

    if (inquiry.isSecret) {
      const isAuthor = inquiry.userId === userId;
      const isSeller = inquiry.product.store.userId === userId;
      if (!isAuthor && !isSeller) throw new UnauthorizedException();
    }

    return {
      id: inquiry.id,
      userId: inquiry.userId,
      productId: inquiry.productId,
      title: inquiry.title,
      content: inquiry.content,
      status: inquiry.status,
      isSecret: inquiry.isSecret,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
      user: {
        name: inquiry.user.name,
      },
      reply: {
        id: existReply.id,
        content: existReply.content,
        createdAt: existReply.createdAt,
        updatedAt: existReply.updatedAt,
        user: {
          name: existReply.user.name,
        },
      },
    };
  }

  async updateReply(
    userId: string,
    replyId: string,
    body: CreateOrUpdateInquiryReplyDto,
  ): Promise<InquiryReplyResponse> {
    const reply = await this.inquiryRepository.findReplyByReplyId(replyId);
    if (!reply) {
      throw new NotFoundException();
    }

    // 답글은 상품의 판매자만 수정 가능
    const isSeller = reply.inquiry.product.store.userId === userId;
    if (!isSeller) {
      throw new ForbiddenException();
    }

    const { content } = body;
    if (!content) {
      throw new BadRequestException();
    }
    const updateReply = await this.inquiryRepository.updateReply(replyId, body);
    return {
      id: updateReply.id,
      inquiryId: updateReply.inquiryId,
      userId: updateReply.userId,
      content: updateReply.content,
      createdAt: updateReply.createdAt,
      updatedAt: updateReply.updatedAt,
      user: {
        id: updateReply.user.id,
        name: updateReply.user.name,
      },
    };
  }
}
