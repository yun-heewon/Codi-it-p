import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(data: Prisma.ReviewCreateInput) {
    return this.prisma.review.create({
      data,
    });
  }

  async updateReview(reviewId: string, data: Prisma.ReviewUpdateInput) {
    return this.prisma.review.update({
      where: { id: reviewId },
      data,
    });
  }

  async findById(reviewId: string) {
    return this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
        orderItem: { select: { createdAt: true } },
      },
    });
  }

  async findByOrderItemId(orderItemId: string) {
    return this.prisma.review.findUnique({
      where: { orderItemId },
      select: { id: true },
    });
  }

  async findByReviewProductId(
    productId: string,
    limit: number,
    offset: number,
  ) {
    return this.prisma.review.findMany({
      where: { productId },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
    });
  }

  async deleteReview(reviewId: string) {
    return this.prisma.review.delete({
      where: { id: reviewId },
    });
  }

  async findByItemIdAndUserId(orderItemId: string, userId: string) {
    return this.prisma.orderItem.findFirst({
      where: {
        id: orderItemId,
        order: {
          buyerId: userId,
        },
      },
      select: {
        productId: true,
        isReviewed: true,
      },
    });
  }

  async updateReviewStatus(orderItemId: string, status: boolean) {
    return this.prisma.orderItem.update({
      where: { id: orderItemId },
      data: { isReviewed: status },
    });
  }

  async countByProductId(productId: string): Promise<number> {
    return this.prisma.review.count({
      where: {
        productId,
      },
    });
  }
}
