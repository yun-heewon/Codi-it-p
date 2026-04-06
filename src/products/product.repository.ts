import { Injectable } from '@nestjs/common';
import { InquiryStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dtos/create-inquiry.dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data,
      include: {
        store: true,
        Stock: {
          include: { size: true },
        },
        Category: true,
      },
    });
  }

  async updateWithStocks(
    productId: string,
    data: Prisma.ProductUpdateInput,
    stocks?: { sizeId: number; quantity: number }[],
  ) {
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        ...data,
        Stock: stocks
          ? {
              upsert: stocks.map((stock) => ({
                where: {
                  productId_sizeId: { productId, sizeId: stock.sizeId },
                },
                update: { quantity: stock.quantity },
                create: {
                  size: { connect: { id: stock.sizeId } },
                  quantity: stock.quantity,
                },
              })),
            }
          : undefined,
      },
      include: {
        store: true,
        Stock: { include: { size: true } },
        Category: true,
      },
    });
  }

  async findById(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        store: true,
        Stock: { include: { size: true } },
        Review: true,
        Inquiry: {
          include: { InquiryReply: true, user: true },
        },
        Category: true,
      },
    });
  }

  async findSellerByUserId(userId: string) {
    return this.prisma.store.findUnique({
      where: { userId },
    });
  }

  async findCategoryByName(name: string) {
    return this.prisma.category.findUnique({
      where: { name },
    });
  }

  async findByProductId(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
    });
  }

  async findMany(
    where: Prisma.ProductWhereInput,
    orderBy: Prisma.ProductOrderByWithRelationInput,
    skip: number,
    take: number,
  ) {
    return this.prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
        discountRate: true,
        discountStartTime: true,
        discountEndTime: true,
        isSoldOut: true,
        createdAt: true,
        updatedAt: true,
        storeId: true,
        store: true,
        Stock: true,
        Review: true,
        Category: true,
      },
    });
  }

  async count(where: Prisma.ProductWhereInput) {
    return this.prisma.product.count({ where });
  }

  async getSalesByProducts(productIds: string[]) {
    return this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      where: { productId: { in: productIds } },
    });
  }

  async delete(productId: string) {
    return this.prisma.product.delete({
      where: { id: productId },
    });
  }

  async createInquiry(
    userId: string,
    productId: string,
    data: CreateInquiryDto,
  ) {
    return this.prisma.inquiry.create({
      data: {
        userId,
        productId,
        title: data.title,
        content: data.content,
        status: InquiryStatus.WaitingAnswer,
        isSecret: data.isSecret ?? false,
      },
    });
  }

  async getInquiries(productId: string) {
    return this.prisma.inquiry.findMany({
      where: { productId },
      include: {
        user: { select: { name: true } },
        InquiryReply: {
          include: { user: { select: { name: true } } },
        },
      },
    });
  }

  async findUsersWithProductAndSizeInCart(productId: string, sizeId: number) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { productId, sizeId },
      include: {
        cart: { select: { buyerId: true } },
      },
    });

    const userIds = cartItems.map((item) => item.cart.buyerId);
    return [...new Set(userIds)];
  }

  async findSellerIdByProductId(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        store: { select: { userId: true } },
      },
    });
    return product?.store?.userId || null;
  }

  async findUsersWithProductInCart(
    productId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<string[]> {
    const client = tx ?? this.prisma;
    const carts = await client.cart.findMany({
      where: { items: { some: { productId } } },
      select: { buyerId: true },
      distinct: ['buyerId'],
    });

    return carts.map((cart) => cart.buyerId);
  }
}
