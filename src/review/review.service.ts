import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { ReviewCreateDto } from './dtos/create.dto';
import { Prisma, Review } from '@prisma/client';
import { ReviewUpdateDto } from './dtos/update.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async createReview(userId: string, data: ReviewCreateDto): Promise<Review> {
    const { orderItemId, ...reviewInput } = data;

    const orderItem = await this.reviewRepository.findByItemIdAndUserId(
      orderItemId,
      userId,
    );
    if (!orderItem) {
      throw new NotFoundException('리뷰를 작성할 수 있는 상품이 없습니다.');
    }
    if (orderItem.isReviewed) {
      throw new ConflictException('이미 리뷰가 작성된 상품입니다.');
    }

    const reviewData: Prisma.ReviewCreateInput = {
      ...reviewInput,
      product: {
        connect: { id: orderItem.productId },
      },
      orderItem: {
        connect: { id: orderItemId },
      },
      user: {
        connect: { id: userId },
      },
    };

    const newReview = await this.reviewRepository.createReview(reviewData);
    await this.reviewRepository.updateReviewStatus(orderItemId, true);

    return newReview;
  }

  async updateReview(
    reviewId: string,
    userId: string,
    data: ReviewUpdateDto,
  ): Promise<Review> {
    const existingReview = await this.reviewRepository.findById(reviewId);
    if (!existingReview) {
      throw new NotFoundException('존재하지 않는 리뷰입니다.');
    }

    if (existingReview.userId !== userId) {
      throw new ForbiddenException('리뷰 수정 권한이 없습니다.');
    }

    const updatedReview = await this.reviewRepository.updateReview(
      reviewId,
      data,
    );

    return updatedReview;
  }

  async getReviewsDetail(reviewId: string): Promise<Review> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException('존재하지 않는 리뷰입니다.');
    }
    return review;
  }

  async deleteReview(reviewId: string, userId: string): Promise<void> {
    const existingReview = await this.reviewRepository.findById(reviewId);
    if (!existingReview) {
      throw new NotFoundException('존재하지 않는 리뷰입니다.');
    }

    if (existingReview.userId !== userId) {
      throw new ForbiddenException('리뷰 삭제 권한이 없습니다.');
    }

    await this.reviewRepository.deleteReview(reviewId);
    await this.reviewRepository.updateReviewStatus(
      existingReview.orderItemId,
      false,
    );
  }

  async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ items: Review[]; total: number }> {
    const safeLimit = Math.max(1, limit);
    const safePage = Math.max(1, page);
    const offset = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      this.reviewRepository.findByReviewProductId(productId, safeLimit, offset),
      this.reviewRepository.countByProductId(productId),
    ]);
    return { items, total };
  }
}
